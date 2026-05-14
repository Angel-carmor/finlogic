# Guía de Recuperación ante Desastres - FinLogic

Esta guía describe los pasos necesarios para restaurar el sistema en caso de pérdida de datos o fallo crítico de la base de datos.

## 1. Escenario: Pérdida total de datos en la DB
Si la base de datos MySQL queda corrupta o se pierden datos accidentalmente:

### Paso 1: Localizar el backup más reciente
Los archivos de backup se encuentran en el directorio `scripts/backups/`. Tienen el formato `finlogic_backup_YYYYMMDD_HHMMSS.sql`.

### Paso 2: Ejecutar el script de restauración
Desde la raíz del proyecto, ejecuta:
```bash
./scripts/db-restore.sh ./scripts/backups/finlogic_backup_XXXXXXXX_XXXXXX.sql
```

### Paso 3: Verificar la integridad
Inicia sesión en la aplicación y comprueba que las transacciones e inversiones vuelven a estar visibles.

## 2. Automatización de Backups (Opcional)
Se recomienda añadir una tarea programada (cron) para realizar backups diarios:
```bash
0 3 * * * /ruta/absoluta/a/finlogic/scripts/db-backup.sh
```
Esto ejecutará una copia de seguridad cada día a las 3:00 AM.

## 3. Contacto en caso de fallo crítico
Si la restauración falla, revise los logs de Docker:
```bash
docker logs finlogic_db
```
O consulte la `BITACORA.md` para ver si es un error ya conocido.
