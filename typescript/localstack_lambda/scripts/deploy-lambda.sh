#!/bin/bash

# Script para desplegar la Lambda en LocalStack

set -e

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "=================================================="
echo "🚀 Deploying Lambda to LocalStack"
echo "=================================================="

# Cargar variables de entorno
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Variables
LAMBDA_FUNCTION_NAME=${LAMBDA_FUNCTION_NAME:-user-handler}
LAMBDA_ROLE_ARN=${LAMBDA_ROLE_ARN:-arn:aws:iam::000000000000:role/lambda-role}
AWS_ENDPOINT=${AWS_ENDPOINT:-http://localhost:4566}
AWS_REGION=${AWS_REGION:-us-east-1}

echo "📍 Function Name: $LAMBDA_FUNCTION_NAME"
echo "📍 Endpoint: $AWS_ENDPOINT"
echo "📍 Region: $AWS_REGION"
echo ""

# Verificar que el archivo de distribución existe
if [ ! -f dist/index.js ]; then
    echo -e "${RED}❌ Error: dist/index.js not found. Run 'npm run build' first${NC}"
    exit 1
fi

# Crear archivo ZIP
echo "📦 Creating deployment package..."
cd dist
zip -q -r function.zip index.js index.js.map
cd ..

# Crear rol IAM si no existe (LocalStack)
echo "🔐 Creating IAM role..."
aws --endpoint-url=$AWS_ENDPOINT \
    --region=$AWS_REGION \
    iam create-role \
    --role-name lambda-role \
    --assume-role-policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"lambda.amazonaws.com"},"Action":"sts:AssumeRole"}]}' \
    2>/dev/null || echo "   Role already exists"

# Verificar si la función Lambda ya existe
FUNCTION_EXISTS=$(aws --endpoint-url=$AWS_ENDPOINT \
    --region=$AWS_REGION \
    lambda get-function \
    --function-name $LAMBDA_FUNCTION_NAME \
    2>/dev/null || echo "")

if [ -z "$FUNCTION_EXISTS" ]; then
    # Crear nueva función Lambda
    echo "📝 Creating Lambda function..."
    aws --endpoint-url=$AWS_ENDPOINT \
        --region=$AWS_REGION \
        lambda create-function \
        --function-name $LAMBDA_FUNCTION_NAME \
        --runtime nodejs18.x \
        --handler index.handler \
        --role $LAMBDA_ROLE_ARN \
        --zip-file fileb://dist/function.zip \
        --environment Variables="{AWS_ENDPOINT=$AWS_ENDPOINT,DYNAMODB_TABLE_NAME=${DYNAMODB_TABLE_NAME:-Users},AWS_REGION=$AWS_REGION}" \
        --timeout 30 \
        --memory-size 256
    
    echo -e "${GREEN}✅ Lambda function created successfully${NC}"
else
    # Actualizar función Lambda existente
    echo "🔄 Updating Lambda function..."
    aws --endpoint-url=$AWS_ENDPOINT \
        --region=$AWS_REGION \
        lambda update-function-code \
        --function-name $LAMBDA_FUNCTION_NAME \
        --zip-file fileb://dist/function.zip
    
    echo -e "${GREEN}✅ Lambda function updated successfully${NC}"
fi

# Limpiar
rm dist/function.zip

echo ""
echo "=================================================="
echo -e "${GREEN}✅ Deployment completed${NC}"
echo "=================================================="
echo ""
echo "To invoke the Lambda, run:"
echo "  npm run invoke"
echo ""
echo "Or manually:"
echo "  aws --endpoint-url=$AWS_ENDPOINT lambda invoke --function-name $LAMBDA_FUNCTION_NAME --payload '{...}' output.json"

