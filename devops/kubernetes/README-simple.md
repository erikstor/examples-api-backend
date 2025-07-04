# Ejemplo Simple de Kubernetes

Este es un ejemplo básico de Kubernetes que incluye solo los recursos esenciales para desplegar una aplicación.

## Archivos

- `simple-deployment.yml` - Deployment y Service básicos

## Componentes

### 1. Deployment
- **Nombre**: `simple-api`
- **Réplicas**: 2 pods
- **Imagen**: nginx:alpine (imagen de ejemplo)
- **Puerto**: 80
- **Recursos**: Límites básicos de CPU y memoria

### 2. Service
- **Nombre**: `simple-api-service`
- **Tipo**: LoadBalancer (expone la aplicación externamente)
- **Puerto**: 80

## Cómo usar

### 1. Aplicar el deployment
```bash
kubectl apply -f simple-deployment.yml
```

### 2. Verificar el estado
```bash
kubectl get pods
kubectl get services
```

### 3. Acceder a la aplicación
```bash
kubectl get service simple-api-service
```

### 4. Eliminar el deployment
```bash
kubectl delete -f simple-deployment.yml
```

## Diferencias con el ejemplo completo

Este ejemplo simplificado omite:
- ✅ Ingress (routing avanzado)
- ✅ ConfigMaps y Secrets
- ✅ Health checks (liveness/readiness probes)
- ✅ Horizontal Pod Autoscaler
- ✅ Volúmenes y persistent storage
- ✅ Namespaces personalizados
- ✅ TLS/SSL

## Próximos pasos

Para hacer el deployment más robusto, considera agregar:
1. Health checks
2. ConfigMaps para configuración
3. Secrets para datos sensibles
4. Ingress para routing
5. Resource limits más específicos 