# Script de PowerShell para configurar API Gateway en LocalStack

$ErrorActionPreference = "Stop"

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "🌐 Configurando API Gateway en LocalStack" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# Cargar variables de entorno
if (Test-Path .env) {
    Get-Content .env | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]+)=(.+)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            Set-Item -Path "env:$name" -Value $value
        }
    }
}

# Variables
$LAMBDA_FUNCTION_NAME = if ($env:LAMBDA_FUNCTION_NAME) { $env:LAMBDA_FUNCTION_NAME } else { "user-handler" }
$AWS_ENDPOINT = if ($env:AWS_ENDPOINT) { $env:AWS_ENDPOINT } else { "http://localhost:4566" }
$AWS_REGION = if ($env:AWS_REGION) { $env:AWS_REGION } else { "us-east-1" }
$API_NAME = "user-api"

Write-Host "📍 Lambda Function: $LAMBDA_FUNCTION_NAME"
Write-Host "📍 API Name: $API_NAME"
Write-Host "📍 Endpoint: $AWS_ENDPOINT"
Write-Host ""

# 1. Crear API REST
Write-Host "`n1. Creando API REST..." -ForegroundColor Blue
$apiResponse = aws --endpoint-url=$AWS_ENDPOINT `
    --region=$AWS_REGION `
    apigateway create-rest-api `
    --name $API_NAME `
    --description "User API for Lambda" `
    --endpoint-configuration types=REGIONAL | ConvertFrom-Json

$API_ID = $apiResponse.id
Write-Host "✅ API creada con ID: $API_ID" -ForegroundColor Green

# Guardar API_ID
"API_GATEWAY_ID=$API_ID" | Out-File -FilePath .env.api -Encoding utf8

# 2. Obtener el root resource ID
Write-Host "`n2. Obteniendo root resource..." -ForegroundColor Blue
$rootResponse = aws --endpoint-url=$AWS_ENDPOINT `
    --region=$AWS_REGION `
    apigateway get-resources `
    --rest-api-id $API_ID | ConvertFrom-Json

$ROOT_RESOURCE_ID = $rootResponse.items[0].id
Write-Host "✅ Root Resource ID: $ROOT_RESOURCE_ID" -ForegroundColor Green

# 3. Crear recurso /user
Write-Host "`n3. Creando recurso /user..." -ForegroundColor Blue
$userResource = aws --endpoint-url=$AWS_ENDPOINT `
    --region=$AWS_REGION `
    apigateway create-resource `
    --rest-api-id $API_ID `
    --parent-id $ROOT_RESOURCE_ID `
    --path-part user | ConvertFrom-Json

$USER_RESOURCE_ID = $userResource.id
Write-Host "✅ Recurso /user creado con ID: $USER_RESOURCE_ID" -ForegroundColor Green

# 4. Crear recurso /user/{id}
Write-Host "`n4. Creando recurso /user/{id}..." -ForegroundColor Blue
$userIdResource = aws --endpoint-url=$AWS_ENDPOINT `
    --region=$AWS_REGION `
    apigateway create-resource `
    --rest-api-id $API_ID `
    --parent-id $USER_RESOURCE_ID `
    --path-part '{id}' | ConvertFrom-Json

$USER_ID_RESOURCE_ID = $userIdResource.id
Write-Host "✅ Recurso /user/{id} creado con ID: $USER_ID_RESOURCE_ID" -ForegroundColor Green

# URI de la Lambda
$LAMBDA_URI = "arn:aws:apigateway:${AWS_REGION}:lambda:path/2015-03-31/functions/arn:aws:lambda:${AWS_REGION}:000000000000:function:${LAMBDA_FUNCTION_NAME}/invocations"

# Función para configurar método
function Setup-Method {
    param(
        [string]$ResourceId,
        [string]$HttpMethod,
        [string]$ResourcePath
    )
    
    Write-Host "`nConfigurando $HttpMethod $ResourcePath..." -ForegroundColor Cyan
    
    # Crear método
    aws --endpoint-url=$AWS_ENDPOINT `
        --region=$AWS_REGION `
        apigateway put-method `
        --rest-api-id $API_ID `
        --resource-id $ResourceId `
        --http-method $HttpMethod `
        --authorization-type NONE `
        --no-api-key-required | Out-Null
    
    # Configurar integración con Lambda
    aws --endpoint-url=$AWS_ENDPOINT `
        --region=$AWS_REGION `
        apigateway put-integration `
        --rest-api-id $API_ID `
        --resource-id $ResourceId `
        --http-method $HttpMethod `
        --type AWS_PROXY `
        --integration-http-method POST `
        --uri $LAMBDA_URI | Out-Null
    
    # Configurar respuesta del método
    aws --endpoint-url=$AWS_ENDPOINT `
        --region=$AWS_REGION `
        apigateway put-method-response `
        --rest-api-id $API_ID `
        --resource-id $ResourceId `
        --http-method $HttpMethod `
        --status-code 200 `
        --response-models '{\"application/json\": \"Empty\"}' | Out-Null
    
    Write-Host "  ✅ $HttpMethod $ResourcePath configurado" -ForegroundColor Green
}

# 5. Configurar métodos
Write-Host "`n5. Configurando métodos HTTP..." -ForegroundColor Blue

# GET / (root - info de la API)
Setup-Method -ResourceId $ROOT_RESOURCE_ID -HttpMethod "GET" -ResourcePath "/"

# POST /user (crear o obtener usuario)
Setup-Method -ResourceId $USER_RESOURCE_ID -HttpMethod "POST" -ResourcePath "/user"

# GET /user/{id} (obtener usuario por ID)
Setup-Method -ResourceId $USER_ID_RESOURCE_ID -HttpMethod "GET" -ResourcePath "/user/{id}"

# 6. Desplegar API
Write-Host "`n6. Desplegando API..." -ForegroundColor Blue
aws --endpoint-url=$AWS_ENDPOINT `
    --region=$AWS_REGION `
    apigateway create-deployment `
    --rest-api-id $API_ID `
    --stage-name dev `
    --stage-description "Development stage" `
    --description "Initial deployment" | Out-Null

Write-Host "✅ API desplegada en stage 'dev'" -ForegroundColor Green

# 7. Dar permisos a API Gateway para invocar Lambda
Write-Host "`n7. Configurando permisos..." -ForegroundColor Blue
try {
    aws --endpoint-url=$AWS_ENDPOINT `
        --region=$AWS_REGION `
        lambda add-permission `
        --function-name $LAMBDA_FUNCTION_NAME `
        --statement-id apigateway-invoke `
        --action lambda:InvokeFunction `
        --principal apigateway.amazonaws.com `
        --source-arn "arn:aws:execute-api:${AWS_REGION}:000000000000:${API_ID}/*/*" 2>$null
} catch {
    Write-Host "  (Permiso ya existe)" -ForegroundColor Yellow
}

Write-Host "✅ Permisos configurados" -ForegroundColor Green

# 8. Mostrar información final
Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "✅ API Gateway configurado correctamente" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Información de la API:" -ForegroundColor Cyan
Write-Host "  API ID: $API_ID"
Write-Host "  API Name: $API_NAME"
Write-Host "  Stage: dev"
Write-Host ""
Write-Host "🔗 URLs de los endpoints:" -ForegroundColor Cyan
Write-Host "  GET  $AWS_ENDPOINT/restapis/$API_ID/dev/_user_request_/"
Write-Host "  POST $AWS_ENDPOINT/restapis/$API_ID/dev/_user_request_/user"
Write-Host "  GET  $AWS_ENDPOINT/restapis/$API_ID/dev/_user_request_/user/{id}"
Write-Host ""
Write-Host "🧪 Ejemplos de uso con curl:" -ForegroundColor Cyan
Write-Host ""
Write-Host "# Obtener info de la API"
Write-Host "curl $AWS_ENDPOINT/restapis/$API_ID/dev/_user_request_/"
Write-Host ""
Write-Host "# Crear usuario"
Write-Host "curl -X POST $AWS_ENDPOINT/restapis/$API_ID/dev/_user_request_/user \"
Write-Host "  -H 'Content-Type: application/json' \"
Write-Host "  -d '{`"email`":`"test@example.com`",`"name`":`"Test User`",`"age`":30}'"
Write-Host ""
Write-Host "# Obtener usuario por ID"
Write-Host "curl $AWS_ENDPOINT/restapis/$API_ID/dev/_user_request_/user/{user-id}"
Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Tip: Los endpoints también están en el archivo 'requests-api-gateway.http'" -ForegroundColor Yellow

