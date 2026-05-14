#!/bin/bash

# Configuración
BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/finlogic_backup_$TIMESTAMP.sql"
CONTAINER_NAME="finlogic_db"

# Crear directorio de backups si no existe
mkdir -p $BACKUP_DIR

echo "Iniciando copia de seguridad de la base de datos..."

# Ejecutar mysqldump dentro del contenedor
docker exec $CONTAINER_NAME mysqldump -u root -pTU_PASSWORD_ROOT finlogic > $BACKUP_FILE

if [ $? -eq 0 ]; then
  echo "✅ Copia de seguridad completada con éxito: $BACKUP_FILE"
  # Mantener solo los últimos 30 días de backups (1 mes)
  find $BACKUP_DIR -type f -name "*.sql" -mtime +30 -delete
else
  echo "❌ Error al realizar la copia de seguridad."
  exit 1
fi
