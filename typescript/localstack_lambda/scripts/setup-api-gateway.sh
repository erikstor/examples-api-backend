#!/bin/bash

# Script para configurar API Gateway en LocalStack

set -e

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "=================================================="
echo "🌐 Configurando API Gateway en LocalStack"
echo "=================================================="

# Cargar variables de entorno
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Variables
LAMBDA_FUNCTION_NAME=${LAMBDA_FUNCTION_NAME:-user-handler}
AWS_ENDPOINT=${AWS_ENDPOINT:-http://localhost:4566}
AWS_REGION=${AWS_REGION:-us-east-1}
API_NAME="user-api"

echo "📍 Lambda Function: $LAMBDA_FUNCTION_NAME"
echo "📍 API Name: $API_NAME"
echo "📍 Endpoint: $AWS_ENDPOINT"
echo ""

# 1. Crear API REST
echo -e "${BLUE}1. Creando API REST...${NC}"
API_RESPONSE=$(aws --endpoint-url=$AWS_ENDPOINT \
    --region=$AWS_REGION \
    apigateway create-rest-api \
    --name $API_NAME \
    --description "User API for Lambda" \
    --endpoint-configuration types=REGIONAL)

API_ID=$(echo $API_RESPONSE | jq -r '.id')
echo -e "${GREEN}✅ API creada con ID: $API_ID${NC}"

# Guardar API_ID para uso posterior
echo "API_GATEWAY_ID=$API_ID" >> .env.api

# 2. Obtener el root resource ID
echo -e "\n${BLUE}2. Obteniendo root resource...${NC}"
ROOT_RESOURCE_ID=$(aws --endpoint-url=$AWS_ENDPOINT \
    --region=$AWS_REGION \
    apigateway get-resources \
    --rest-api-id $API_ID \
    | jq -r '.items[0].id')

echo -e "${GREEN}✅ Root Resource ID: $ROOT_RESOURCE_ID${NC}"

# 3. Crear recurso /user
echo -e "\n${BLUE}3. Creando recurso /user...${NC}"
USER_RESOURCE=$(aws --endpoint-url=$AWS_ENDPOINT \
    --region=$AWS_REGION \
    apigateway create-resource \
    --rest-api-id $API_ID \
    --parent-id $ROOT_RESOURCE_ID \
    --path-part user)

USER_RESOURCE_ID=$(echo $USER_RESOURCE | jq -r '.id')
echo -e "${GREEN}✅ Recurso /user creado con ID: $USER_RESOURCE_ID${NC}"

# 4. Crear recurso /user/{id}
echo -e "\n${BLUE}4. Creando recurso /user/{id}...${NC}"
USER_ID_RESOURCE=$(aws --endpoint-url=$AWS_ENDPOINT \
    --region=$AWS_REGION \
    apigateway create-resource \
    --rest-api-id $API_ID \
    --parent-id $USER_RESOURCE_ID \
    --path-part '{id}')

USER_ID_RESOURCE_ID=$(echo $USER_ID_RESOURCE | jq -r '.id')
echo -e "${GREEN}✅ Recurso /user/{id} creado con ID: $USER_ID_RESOURCE_ID${NC}"

# URI de la Lambda
LAMBDA_URI="arn:aws:apigateway:$AWS_REGION:lambda:path/2015-03-31/functions/arn:aws:lambda:$AWS_REGION:000000000000:function:$LAMBDA_FUNCTION_NAME/invocations"

# Función para configurar método
setup_method() {
    local RESOURCE_ID=$1
    local HTTP_METHOD=$2
    local RESOURCE_PATH=$3
    
    echo -e "\n${CYAN}Configurando $HTTP_METHOD $RESOURCE_PATH...${NC}"
    
    # Crear método
    aws --endpoint-url=$AWS_ENDPOINT \
        --region=$AWS_REGION \
        apigateway put-method \
        --rest-api-id $API_ID \
        --resource-id $RESOURCE_ID \
        --http-method $HTTP_METHOD \
        --authorization-type NONE \
        --no-api-key-required > /dev/null
    
    # Configurar integración con Lambda
    aws --endpoint-url=$AWS_ENDPOINT \
        --region=$AWS_REGION \
        apigateway put-integration \
        --rest-api-id $API_ID \
        --resource-id $RESOURCE_ID \
        --http-method $HTTP_METHOD \
        --type AWS_PROXY \
        --integration-http-method POST \
        --uri $LAMBDA_URI > /dev/null
    
    # Configurar respuesta del método
    aws --endpoint-url=$AWS_ENDPOINT \
        --region=$AWS_REGION \
        apigateway put-method-response \
        --rest-api-id $API_ID \
        --resource-id $RESOURCE_ID \
        --http-method $HTTP_METHOD \
        --status-code 200 \
        --response-models '{"application/json": "Empty"}' > /dev/null
    
    echo -e "${GREEN}  ✅ $HTTP_METHOD $RESOURCE_PATH configurado${NC}"
}

# 5. Configurar métodos
echo -e "\n${BLUE}5. Configurando métodos HTTP...${NC}"

# GET / (root - info de la API)
setup_method $ROOT_RESOURCE_ID GET "/"

# POST /user (crear o obtener usuario)
setup_method $USER_RESOURCE_ID POST "/user"

# GET /user/{id} (obtener usuario por ID)
setup_method $USER_ID_RESOURCE_ID GET "/user/{id}"

# 6. Desplegar API
echo -e "\n${BLUE}6. Desplegando API...${NC}"
aws --endpoint-url=$AWS_ENDPOINT \
    --region=$AWS_REGION \
    apigateway create-deployment \
    --rest-api-id $API_ID \
    --stage-name dev \
    --stage-description "Development stage" \
    --description "Initial deployment" > /dev/null

echo -e "${GREEN}✅ API desplegada en stage 'dev'${NC}"

# 7. Dar permisos a API Gateway para invocar Lambda
echo -e "\n${BLUE}7. Configurando permisos...${NC}"
aws --endpoint-url=$AWS_ENDPOINT \
    --region=$AWS_REGION \
    lambda add-permission \
    --function-name $LAMBDA_FUNCTION_NAME \
    --statement-id apigateway-invoke \
    --action lambda:InvokeFunction \
    --principal apigateway.amazonaws.com \
    --source-arn "arn:aws:execute-api:$AWS_REGION:000000000000:$API_ID/*/*" \
    2>/dev/null || echo "  (Permiso ya existe)"

echo -e "${GREEN}✅ Permisos configurados${NC}"

# 8. Mostrar información final
API_URL="$AWS_ENDPOINT/restapis/$API_ID/dev/_user_request_"

echo ""
echo "=================================================="
echo -e "${GREEN}✅ API Gateway configurado correctamente${NC}"
echo "=================================================="
echo ""
echo -e "${CYAN}📋 Información de la API:${NC}"
echo "  API ID: $API_ID"
echo "  API Name: $API_NAME"
echo "  Stage: dev"
echo ""
echo -e "${CYAN}🔗 URLs de los endpoints:${NC}"
echo "  GET  $AWS_ENDPOINT/restapis/$API_ID/dev/_user_request_/"
echo "  POST $AWS_ENDPOINT/restapis/$API_ID/dev/_user_request_/user"
echo "  GET  $AWS_ENDPOINT/restapis/$API_ID/dev/_user_request_/user/{id}"
echo ""
echo -e "${CYAN}🧪 Ejemplos de uso con curl:${NC}"
echo ""
echo "# Obtener info de la API"
echo "curl $AWS_ENDPOINT/restapis/$API_ID/dev/_user_request_/"
echo ""
echo "# Crear usuario"
echo "curl -X POST $AWS_ENDPOINT/restapis/$API_ID/dev/_user_request_/user \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"email\":\"test@example.com\",\"name\":\"Test User\",\"age\":30}'"
echo ""
echo "# Obtener usuario por ID"
echo "curl $AWS_ENDPOINT/restapis/$API_ID/dev/_user_request_/user/{user-id}"
echo ""
echo "=================================================="
echo ""
echo "💡 Tip: Los endpoints también están en el archivo 'requests-api-gateway.http'"

