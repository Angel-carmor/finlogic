# 🌌 FinLogic

> 📝 **[DOCUMENTACIÓN OFICIAL DE ENTREGA (HITO)](file:///home/angel/Documentos/www/proyectos/finlogic/DOCUMENTACION_ENTREGA.md)** — Consulta aquí los **Criterios de éxito**, variables de entorno `.env` e inicialización de la base de datos MySQL requerida por la evaluación.

> **Plataforma inteligente de planificación financiera personal en tiempo real.**  
> Diseñada para organizar presupuestos mensuales mediante la regla estratégica **50/30/20**, simular rentabilidad por interés compuesto a largo plazo y automatizar el plan de pago de pasivos mediante el método de **Avalancha**.

---

## 🛠️ Stack Tecnológico

![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-00758F?style=for-the-badge&logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

---

## 🎯 Criterios de Éxito del Proyecto (Métricas del MVP)

A continuación se detallan los **9 criterios de éxito clave y medibles** que guían el diseño, desarrollo e infraestructura del MVP de FinLogic. Se indica con precisión el estado de cumplimiento en este hito de entrega.

### 📊 Tabla de Cumplimiento de Hitos

| ID | Criterio de Éxito | Métrica / Evidencia de Validación | Estado |
|---|---|---|:---:|
| **1** | **Autenticación Segura (JWT)** | Registro e inicio de sesión de usuarios con contraseñas encriptadas mediante `bcrypt` (unidireccional) y generación de JSON Web Tokens persistidos en `localStorage`. | **[x] Cumplido** |
| **2** | **Onboarding Guiado** | Formulario modular de 4 pasos que recopila ingresos netos mensuales, gastos fijos, deudas totales, estabilidad laboral y fondo de emergencia, persistiendo el estado en base de datos. | **[x] Cumplido** |
| **3** | **Distribución Presupuestaria** | Cálculo inmediato y automático en el Dashboard de las recomendaciones del presupuesto estratégico **50/30/20** (Necesidades, Deseos, Ahorro/Deuda) a partir del ingreso configurado. | **[x] Cumplido** |
| **4** | **Gráfico Espejo en Tiempo Real** | Renderizado dinámico del gráfico de dona (*Mirror Chart*) en el Dashboard, comparando visualmente la distribución presupuestaria óptima vs. la real. | **[x] Cumplido** |
| **5** | **Simulador de Interés Compuesto** | Panel interactivo que proyecta el patrimonio neto acumulable a 10, 20 o 30 años en base a aportes mensuales configurables y rentabilidad esperada. | **[x] Cumplido** |
| **6** | **Gestión de Inversiones (CRUD)** | Operaciones CRUD completas para añadir, listar y eliminar activos financieros con cálculo dinámico en tiempo real de retornos ponderados y aportaciones recurrentes. | **[x] Cumplido** |
| **7** | **Planificador de Deudas (Avalancha)** | Algoritmo interactivo para calcular y visualizar el plan óptimo de amortización de deudas aplicando la estrategia de **Avalancha** (priorizando intereses más altos). | **[x] Cumplido** |
| **8** | **Optimización de API (Performance)** | Tiempo de respuesta promedio inferior a **150ms** en los endpoints principales de consulta de API ejecutados en red local de desarrollo. | **[x] Cumplido** |
| **9** | **Despliegue Portable Unificado (Docker)** | Orquestación completa de servicios (App, API, MySQL) compilables e iniciables mediante un único comando, aislando dependencias locales. | **[x] Cumplido** |

---

## ⚙️ Configuración del Entorno (`.env`)

FinLogic utiliza un sistema flexible de carga de variables de entorno con **valores preconfigurados por defecto**. Esto permite que la plataforma funcione de inmediato sin configuraciones previas, pero otorga control total para modificar credenciales o puertos si es necesario.

Para personalizar la configuración, crea un archivo `.env` en la raíz del proyecto copiando el archivo plantilla:

```bash
cp .env.example .env
```

### 📋 Variables Disponibles

| Variable | Descripción | Valor por Defecto |
|---|---|---|
| `DB_HOST` | Host para la conexión MySQL (interno en Docker o local) | `db` |
| `DB_PORT` | Puerto interno de MySQL dentro de la red del contenedor | `3306` |
| `DB_PORT_EXTERNAL` | Puerto de MySQL expuesto hacia la máquina host local | `3307` |
| `DB_USER` | Usuario estándar de la base de datos MySQL | `user` |
| `DB_PASSWORD` | Contraseña del usuario estándar de la base de datos | `TU_PASSWORD_DB` |
| `DB_NAME` | Nombre de la base de datos para la aplicación | `finlogic` |
| `DB_ROOT_PASSWORD` | Contraseña del administrador (root) de MySQL | `TU_PASSWORD_ROOT` |
| `PORT` | Puerto de escucha para la API del Backend (Express) | `3000` |
| `JWT_SECRET` | Clave de cifrado de firma de tokens JWT | `TU_SECRET_JWT` |
| `VITE_PORT` | Puerto en el que arrancará el servidor de desarrollo Vite | `8080` |
| `VITE_API_URL` | URL de la API consumida por el cliente frontend | `http://localhost:3000/api` |

---

## 🚀 Guía de Arranque Paso a Paso y Orden de Ejecución

Sigue detalladamente estos pasos en el orden indicado para clonar, configurar e iniciar el entorno reproducible de desarrollo de FinLogic.

### 📋 Prerrequisitos
Asegúrate de tener instalados en tu sistema:
- **Docker** (v20.10+)
- **Docker Compose** (v2.0+)

---

### Paso 1: Clonar el Repositorio
Abre tu terminal y ejecuta el comando de clonación:
```bash
git clone https://github.com/Angel-carmor/finlogic.git
cd finlogic
```

### Paso 2: Crear el Archivo de Configuración Local (Opcional)
Si deseas personalizar puertos o credenciales, genera tu archivo `.env` local:
```bash
cp .env.example .env
```
*(Si no creas el archivo, Docker Compose arrancará automáticamente con la configuración segura por defecto descrita en la sección anterior).*

### Paso 3: Lanzar los Contenedores de Docker (Orden de ejecución automatizado)
Inicia la orquestación de servicios en segundo plano:
```bash
docker compose -f docker/docker-compose.yml up --build -d
```
> **¿Qué hace este comando tras bambalinas en su orden correcto?**
> 1. **`db` (MySQL):** Descarga la imagen oficial de MySQL 8, expone el puerto `3307` y arranca la inicialización del motor.
> 2. **`api` (Express):** Compila el código del backend, instala dependencias de Node.js mediante su Dockerfile, y espera a que el servicio `db` esté listo (`depends_on`).
> 3. **`app` (Vue/Vite):** Compila el servidor del frontend, instala dependencias locales y expone el puerto `8080` enlazado con la API.

---

## 💾 Inicialización Automática de la Base de Datos

Uno de los puntos clave para la reproducibilidad del entorno es que **no requiere que ejecutes scripts manuales ni comandos SQL externos**. 

### ⚙️ Mecánica de Carga de Datos Automatizada
El servicio `db` en [docker-compose.yml](file:///home/angel/Documentos/www/proyectos/finlogic/docker/docker-compose.yml) incluye el siguiente montaje de volumen:
```yaml
volumes:
  - db_data:/var/lib/mysql
  - ../database/init.sql:/docker-entrypoint-initdb.d/init.sql
```
- Cuando el contenedor de MySQL se inicia por **primera vez**, el script de entrada oficial de la imagen localiza cualquier archivo `.sql` dentro de la carpeta `/docker-entrypoint-initdb.d/` y lo ejecuta en orden alfabético.
- Esto ejecuta de forma 100% automatizada el archivo [init.sql](file:///home/angel/Documentos/www/proyectos/finlogic/database/init.sql), el cual:
  1. Crea la base de datos `finlogic` (si no existe).
  2. Crea las tablas de seguridad e identidad (`users`).
  3. Estructura las tablas transaccionales (`transactions`).
  4. Crea las tablas de balance patrimonial (`user_debts` y `user_investments`).

---

## 🗄️ Conexión y Gestión de Base de Datos Manual con DBeaver

Si deseas visualizar, auditar o realizar una inicialización manual de las tablas utilizando el gestor gráfico **DBeaver**, sigue estos pasos detallados:

### ⚙️ Paso A: Configurar la Conexión en DBeaver
1. Abre **DBeaver** en tu ordenador.
2. Haz clic en el botón de **Nueva conexión de base de datos** (icono de enchufe en la esquina superior izquierda).
3. Selecciona **MySQL** de la lista y haz clic en *Siguiente*.
4. Rellena los parámetros de conexión con los valores definidos en tu archivo `.env` (o los de respaldo por defecto):
   - **Server Host:** `localhost` *(para conectar tu máquina host al contenedor de Docker)*.
   - **Port:** `3307` *(¡Atención! Usamos el puerto redirigido **3307** en local para no interferir con instalaciones nativas de MySQL en el puerto por defecto 3306)*.
   - **Database:** `finlogic` *(o el valor de `DB_NAME`)*.
   - **Username:** `user` *(o el valor de `DB_USER`)*.
   - **Password:** `TU_PASSWORD_DB` *(o el valor de `DB_PASSWORD`)*.
5. Haz clic en el botón **Probar conexión** (*Test Connection*).
   - *Si el gestor te indica que faltan los controladores (drivers) de conexión de MySQL, haz clic en **Descargar (Download)***.
6. Una vez que la prueba retorne un mensaje de éxito con un check verde, haz clic en **Finalizar (Finish)**.

### ✍️ Paso B: Inicialización y Carga de Tablas Manual
Si alguna vez necesitas reinstanciar la base de datos manualmente o estás conectando el backend a una base de datos externa administrada en la nube (como **Aiven.io** o **Clever Cloud**):
1. Haz clic derecho sobre tu conexión en DBeaver y selecciona **Editor SQL** -> **Nuevo editor SQL**.
2. Abre el archivo de estructura [init.sql](file:///home/angel/Documentos/www/proyectos/finlogic/database/init.sql) de tu proyecto.
3. Copia todo el contenido del archivo y pégalo en el editor SQL de DBeaver.
4. ⚠️ **Nota Importante para Bases de Datos de Terceros (como Aiven.io):** Borra las primeras dos líneas del código pegado para evitar conflictos de privilegios:
   ```sql
   CREATE DATABASE IF NOT EXISTS finlogic;
   USE finlogic;
   ```
   *(Hacemos esto porque los proveedores de bases de datos gratuitas en la nube te entregan un esquema ya creado de fábrica como `defaultdb` y no permiten crear esquemas secundarios con usuarios comunes).*
5. Haz clic en el botón **Ejecutar script SQL** (icono de Play con un rayo, o pulsa `Alt + X` en tu teclado) para que se creen de forma instantánea las tablas y columnas.

---

## 🔗 Puertos de Acceso e Infraestructura

Una vez levantados los servicios con éxito, puedes acceder a ellos en las siguientes direcciones:

| Servicio | Enlace de Acceso | Descripción | Credenciales de Prueba por Defecto |
|---|---|---|---|
| **Frontend (App)** | [http://localhost:8080](http://localhost:8080) | Panel de control e interfaz de usuario de FinLogic | *(Regístrate libremente en la interfaz)* |
| **Backend (API)** | [http://localhost:3000/api](http://localhost:3000/api) | Endpoint de verificación de salud de la API | N/A |
| **Base de Datos** | `localhost:3307` | Servidor MySQL (Acceso externo para depuración) | `Usuario: user` / `Password: TU_PASSWORD_DB` |

---

## 📂 Estructura del Workspace

```text
finlogic/
├── api/                    # Servidor Backend (Express)
│   ├── src/
│   │   ├── config/         # Configuración de base de datos
│   │   ├── controllers/    # Controladores de lógica del MVP
│   │   ├── routes/         # Definición de endpoints API
│   │   └── models/         # Consultas e integraciones MySQL
│   └── Dockerfile          # Definición de contenedor Node para API
├── app/                    # Aplicación Frontend (Vue.js + Vite)
│   ├── src/
│   │   ├── components/     # Componentes visuales y gráficos (Dona, Simulaciones)
│   │   ├── views/          # Vistas (Dashboard, Analytics, Profile, Onboarding)
│   │   └── services/       # Clientes de API y peticiones HTTP
│   └── Dockerfile          # Servidor de desarrollo Vite para App
├── database/
│   └── init.sql            # Script SQL de estructura inicial de base de datos
├── docker/
│   └── docker-compose.yml  # Orquestador del stack completo
├── .env.example            # Plantilla de variables de entorno
└── README.md               # Guía del proyecto
```

---

## 🛠️ Diagnóstico y Comandos de Consola Útiles

Para garantizar que mantengas un control óptimo de tus servicios, utiliza los siguientes comandos estándar de Docker ejecutados desde la raíz del proyecto:

* **Visualizar Logs en Tiempo Real (Depuración):**
  ```bash
  docker compose -f docker/docker-compose.yml logs -f
  ```
* **Reiniciar un Servicio Específico (e.g., API si hay cambios):**
  ```bash
  docker compose -f docker/docker-compose.yml restart api
  ```
* **Apagar el Entorno (Preservando Base de Datos):**
  ```bash
  docker compose -f docker/docker-compose.yml down
  ```
* **Apagar y Resetear Completo (Borra Base de Datos y Fuerza Inicialización Limpia):**
  ```bash
  docker compose -f docker/docker-compose.yml down -v
  ```