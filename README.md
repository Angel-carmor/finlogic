# FinLogic

Plataforma web de planificación financiera personal.
Objetivo: Organizar tu presupuesto mensual de forma estratégica mediante recomendaciones (50/30/20), simulaciones e índices de equilibrio.

## Tecnologías
- **App**: Vue.js
- **API**: Node.js + Express
- **Base de Datos**: MySQL
- **Docker**: Entorno en contenedores (docker-compose)

## Estructura
- `/app`: Frontend de la aplicación.
- `/api`: Backend y motor de reglas.
- `/database`: Scripts de inicialización MySQL.

## Levantamiento
Para levantar los contenedores de desarrollo:
```bash
docker-compose -f docker/docker-compose.yml up --build
```
