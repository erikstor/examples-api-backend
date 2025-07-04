# DevOps - Ejemplos de CI/CD

Esta sección contiene ejemplos de pipelines de CI/CD para las diferentes tecnologías del proyecto.

## Tecnologías Cubiertas

- **Node.js/TypeScript**: GitHub Actions y GitLab CI
- **Python**: GitHub Actions y GitLab CI  
- **Golang**: GitHub Actions y GitLab CI

## Estructura

```
devops/
├── nodejs/
│   ├── github-actions.yml
│   └── gitlab-ci.yml
├── python/
│   ├── github-actions.yml
│   └── gitlab-ci.yml
├── golang/
│   ├── github-actions.yml
│   └── gitlab-ci.yml
└── docker/
    ├── docker-compose.prod.yml
    └── docker-compose.dev.yml
```

## Características de los Pipelines

### GitHub Actions
- Tests unitarios y de integración
- Análisis de código (linting)
- Construcción de imágenes Docker
- Despliegue automático
- Notificaciones

### GitLab CI
- Stages de build, test y deploy
- Cache de dependencias
- Artefactos
- Variables de entorno
- Despliegue a diferentes entornos

### Docker
- Configuraciones para desarrollo y producción
- Optimización de imágenes
- Variables de entorno
- Networking 