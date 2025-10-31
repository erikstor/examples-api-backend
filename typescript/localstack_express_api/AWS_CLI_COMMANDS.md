# 🔧 AWS CLI Commands para LocalStack DynamoDB

Esta guía contiene comandos útiles de AWS CLI para interactuar directamente con DynamoDB en LocalStack.

## 📋 Requisitos Previos

Instala AWS CLI si aún no lo tienes:

```bash
# Mac
brew install awscli

# Linux
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Windows
# Descarga e instala desde: https://awscli.amazonaws.com/AWSCLIV2.msi
```

## 🔐 Configuración

Los comandos usan estas opciones para conectarse a LocalStack:
- `--endpoint-url http://localhost:4566`
- `--region us-east-1`

## 📊 Comandos de Tabla

### Listar todas las tablas
```bash
aws dynamodb list-tables \
  --endpoint-url http://localhost:4566 \
  --region us-east-1
```

### Describir una tabla
```bash
aws dynamodb describe-table \
  --table-name Users \
  --endpoint-url http://localhost:4566 \
  --region us-east-1
```

### Crear tabla manualmente
```bash
aws dynamodb create-table \
  --table-name Users \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --endpoint-url http://localhost:4566 \
  --region us-east-1
```

### Eliminar tabla
```bash
aws dynamodb delete-table \
  --table-name Users \
  --endpoint-url http://localhost:4566 \
  --region us-east-1
```

## 📝 Operaciones CRUD

### Crear (Put Item)
```bash
aws dynamodb put-item \
  --table-name Users \
  --item '{
    "id": {"S": "test-user-1"},
    "email": {"S": "test@example.com"},
    "name": {"S": "Test User"},
    "age": {"N": "25"},
    "createdAt": {"S": "2024-01-01T00:00:00.000Z"},
    "updatedAt": {"S": "2024-01-01T00:00:00.000Z"}
  }' \
  --endpoint-url http://localhost:4566 \
  --region us-east-1
```

### Leer (Get Item)
```bash
aws dynamodb get-item \
  --table-name Users \
  --key '{"id": {"S": "test-user-1"}}' \
  --endpoint-url http://localhost:4566 \
  --region us-east-1
```

### Leer con proyección (solo campos específicos)
```bash
aws dynamodb get-item \
  --table-name Users \
  --key '{"id": {"S": "test-user-1"}}' \
  --projection-expression "id,email,#n" \
  --expression-attribute-names '{"#n": "name"}' \
  --endpoint-url http://localhost:4566 \
  --region us-east-1
```

### Actualizar (Update Item)
```bash
aws dynamodb update-item \
  --table-name Users \
  --key '{"id": {"S": "test-user-1"}}' \
  --update-expression "SET #n = :name, age = :age, updatedAt = :updated" \
  --expression-attribute-names '{"#n": "name"}' \
  --expression-attribute-values '{
    ":name": {"S": "Updated Name"},
    ":age": {"N": "26"},
    ":updated": {"S": "2024-01-02T00:00:00.000Z"}
  }' \
  --return-values ALL_NEW \
  --endpoint-url http://localhost:4566 \
  --region us-east-1
```

### Eliminar (Delete Item)
```bash
aws dynamodb delete-item \
  --table-name Users \
  --key '{"id": {"S": "test-user-1"}}' \
  --return-values ALL_OLD \
  --endpoint-url http://localhost:4566 \
  --region us-east-1
```

## 🔍 Consultas y Escaneos

### Escanear toda la tabla
```bash
aws dynamodb scan \
  --table-name Users \
  --endpoint-url http://localhost:4566 \
  --region us-east-1
```

### Escanear con filtro
```bash
aws dynamodb scan \
  --table-name Users \
  --filter-expression "age > :min_age" \
  --expression-attribute-values '{":min_age": {"N": "25"}}' \
  --endpoint-url http://localhost:4566 \
  --region us-east-1
```

### Escanear con límite
```bash
aws dynamodb scan \
  --table-name Users \
  --max-items 10 \
  --endpoint-url http://localhost:4566 \
  --region us-east-1
```

### Contar items
```bash
aws dynamodb scan \
  --table-name Users \
  --select COUNT \
  --endpoint-url http://localhost:4566 \
  --region us-east-1
```

## 🔄 Operaciones en Lote

### Batch Get (obtener múltiples items)
```bash
aws dynamodb batch-get-item \
  --request-items '{
    "Users": {
      "Keys": [
        {"id": {"S": "user-1"}},
        {"id": {"S": "user-2"}},
        {"id": {"S": "user-3"}}
      ]
    }
  }' \
  --endpoint-url http://localhost:4566 \
  --region us-east-1
```

### Batch Write (crear/actualizar múltiples items)
```bash
aws dynamodb batch-write-item \
  --request-items '{
    "Users": [
      {
        "PutRequest": {
          "Item": {
            "id": {"S": "batch-user-1"},
            "email": {"S": "batch1@example.com"},
            "name": {"S": "Batch User 1"},
            "createdAt": {"S": "2024-01-01T00:00:00.000Z"},
            "updatedAt": {"S": "2024-01-01T00:00:00.000Z"}
          }
        }
      },
      {
        "PutRequest": {
          "Item": {
            "id": {"S": "batch-user-2"},
            "email": {"S": "batch2@example.com"},
            "name": {"S": "Batch User 2"},
            "createdAt": {"S": "2024-01-01T00:00:00.000Z"},
            "updatedAt": {"S": "2024-01-01T00:00:00.000Z"}
          }
        }
      }
    ]
  }' \
  --endpoint-url http://localhost:4566 \
  --region us-east-1
```

## 🧹 Utilidades

### Vaciar toda la tabla (escanear y eliminar)
```bash
# Obtener todos los IDs
IDS=$(aws dynamodb scan \
  --table-name Users \
  --projection-expression "id" \
  --endpoint-url http://localhost:4566 \
  --region us-east-1 \
  --output json | jq -r '.Items[].id.S')

# Eliminar cada item
for ID in $IDS; do
  aws dynamodb delete-item \
    --table-name Users \
    --key "{\"id\": {\"S\": \"$ID\"}}" \
    --endpoint-url http://localhost:4566 \
    --region us-east-1
  echo "Deleted: $ID"
done
```

### Exportar datos a JSON
```bash
aws dynamodb scan \
  --table-name Users \
  --endpoint-url http://localhost:4566 \
  --region us-east-1 \
  --output json > users_backup.json
```

### Verificar conectividad con LocalStack
```bash
# Verificar que LocalStack responde
curl http://localhost:4566/_localstack/health

# Verificar servicio DynamoDB específicamente
curl http://localhost:4566/_localstack/health | jq '.services.dynamodb'
```

## 💡 Tips

### Crear un alias para simplificar comandos
Agrega esto a tu `~/.bashrc` o `~/.zshrc`:

```bash
alias awslocal="aws --endpoint-url=http://localhost:4566 --region=us-east-1"
```

Luego puedes usar:
```bash
awslocal dynamodb list-tables
awslocal dynamodb scan --table-name Users
```

### Formatear salida con jq
```bash
# Instalar jq
brew install jq  # Mac
sudo apt install jq  # Linux

# Usar con comandos
aws dynamodb scan \
  --table-name Users \
  --endpoint-url http://localhost:4566 \
  --region us-east-1 \
  --output json | jq '.Items'
```

## 📚 Referencias

- [AWS CLI DynamoDB Documentation](https://docs.aws.amazon.com/cli/latest/reference/dynamodb/)
- [LocalStack Documentation](https://docs.localstack.cloud/)
- [DynamoDB Data Types](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html)

