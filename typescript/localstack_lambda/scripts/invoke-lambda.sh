#!/bin/bash

# Script para invocar la Lambda en LocalStack

# Cargar variables de entorno
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Variables
LAMBDA_FUNCTION_NAME=${LAMBDA_FUNCTION_NAME:-user-handler}
AWS_ENDPOINT=${AWS_ENDPOINT:-http://localhost:4566}
AWS_REGION=${AWS_REGION:-us-east-1}

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo "=================================================="
echo "🧪 Invoking Lambda Function"
echo "=================================================="
echo "📍 Function: $LAMBDA_FUNCTION_NAME"
echo "📍 Endpoint: $AWS_ENDPOINT"
echo ""

# Test 1: API Info
echo -e "${CYAN}Test 1: GET / (API Info)${NC}"
PAYLOAD=$(cat <<EOF
{
  "httpMethod": "GET",
  "path": "/",
  "headers": {},
  "body": null
}
EOF
)

aws --endpoint-url=$AWS_ENDPOINT \
    --region=$AWS_REGION \
    lambda invoke \
    --function-name $LAMBDA_FUNCTION_NAME \
    --payload "$PAYLOAD" \
    --cli-binary-format raw-in-base64-out \
    output.json

echo -e "${GREEN}Response:${NC}"
cat output.json | jq '.'
echo ""

# Test 2: Create User
echo -e "${CYAN}Test 2: POST /user (Create User)${NC}"
PAYLOAD=$(cat <<EOF
{
  "httpMethod": "POST",
  "path": "/user",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": "{\"email\":\"john.doe@example.com\",\"name\":\"John Doe\",\"age\":30}"
}
EOF
)

aws --endpoint-url=$AWS_ENDPOINT \
    --region=$AWS_REGION \
    lambda invoke \
    --function-name $LAMBDA_FUNCTION_NAME \
    --payload "$PAYLOAD" \
    --cli-binary-format raw-in-base64-out \
    output.json

echo -e "${GREEN}Response:${NC}"
cat output.json | jq '.'
echo ""

# Test 3: Get or Create User (should get existing)
echo -e "${CYAN}Test 3: POST /user (Get Existing User)${NC}"
aws --endpoint-url=$AWS_ENDPOINT \
    --region=$AWS_REGION \
    lambda invoke \
    --function-name $LAMBDA_FUNCTION_NAME \
    --payload "$PAYLOAD" \
    --cli-binary-format raw-in-base64-out \
    output.json

echo -e "${GREEN}Response:${NC}"
cat output.json | jq '.'
echo ""

# Limpiar
rm output.json

echo "=================================================="
echo -e "${GREEN}✅ Tests completed${NC}"
echo "=================================================="

