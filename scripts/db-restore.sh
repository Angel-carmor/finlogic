#!/bin/bash

# Configuración
CONTAINER_NAME="finlogic_db"
BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
  echo "Uso: $0 <ruta_al_archivo_sql>"
  exit 1
fi

if [ ! -f "$BACKUP_FILE" ]; then
  echo "❌ El archivo $BACKUP_FILE no existe."
  exit 1
fi

echo "Iniciando restauración de la base de datos desde $BACKUP_FILE..."

# Restaurar el volcado en el contenedor
cat $BACKUP_FILE | docker exec -i $CONTAINER_NAME mysql -u root -pTU_PASSWORD_ROOT finlogic

if [ $? -eq 0 ]; then
  echo "✅ Restauración completada con éxito."
else
  echo "❌ Error al restaurar la base de datos."
  exit 1
fi
