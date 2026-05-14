# Plan de Pruebas - FinLogic

Este documento detalla la estrategia de pruebas para asegurar la estabilidad, seguridad y funcionalidad del sistema FinLogic.

## 1. Estrategia de Pruebas

Se sigue una pirámide de pruebas centrada en la fiabilidad del Backend:
- **Pruebas de Integración (API)**: Verificación de endpoints, validación de esquemas de datos y persistencia en MySQL.
- **Pruebas de Seguridad**: Verificación de middleware JWT y protección de rutas.
- **Validación de Reglas de Negocio**: Comprobación de cálculos y validaciones de entrada.

## 2. Casos de Prueba Implementados (Suite de 19 Tests)

### 2.1. Core & Health
| ID | Caso de Prueba | Resultado Esperado |
|---|---|---|
| TC-00 | Disponibilidad de la API | El endpoint `/api` responde con éxito (200 OK). |

### 2.2. Autenticación (Auth) & Registro
| ID | Caso de Prueba | Resultado Esperado |
|---|---|---|
| TC-01 | Registro de nuevo usuario | Usuario creado en DB y token JWT devuelto. |
| TC-02 | Login con contraseña incorrecta | Error 401 Unauthorized con mensaje claro. |
| TC-03 | Registro con contraseña débil | Error 400 por incumplimiento de política de seguridad. |
| TC-04 | Registro con campos faltantes | Error 400 cuando falta el email o password. |

### 2.3. Seguridad y Rutas Protegidas
| ID | Caso de Prueba | Resultado Esperado |
|---|---|---|
| TC-05 | Acceso a Perfil sin Token | Error 401 al intentar actualizar datos de usuario. |
| TC-06 | Acceso a Deudas sin Token | Error 401 al listar deudas de forma anónima. |
| TC-07 | Acceso a Inversiones sin Token | Error 401 al acceder a activos sin autenticación. |

### 2.4. Gestión de Deudas (CRUD)
| ID | Caso de Prueba | Resultado Esperado |
|---|---|---|
| TC-08 | Listado de deudas (Vacío) | El sistema devuelve un array vacío si no hay registros. |
| TC-09 | Creación de deuda válida | Inserción exitosa y retorno del ID de la deuda. |
| TC-10 | Error en deuda sin nombre | Bloqueo de creación y error 400. |
| TC-11 | Error en importe negativo | Bloqueo de importes menores a 0 (400). |
| TC-12 | Eliminación de deuda propia | Borrado exitoso y confirmación. |
| TC-13 | Error al borrar deuda inexistente | El sistema devuelve 404 Not Found. |

### 2.5. Gestión de Inversiones & Activos
| ID | Caso de Prueba | Resultado Esperado |
|---|---|---|
| TC-14 | Listado de inversiones | Se recuperan los activos del usuario autenticado. |
| TC-15 | Creación de inversión válida | Registro correcto en DB. |
| TC-16 | Error en inversión sin nombre | Bloqueo de creación (400). |
| TC-17 | Búsqueda de Activos (Search) | El buscador devuelve resultados válidos para un ticker. |
| TC-18 | Eliminación de inversión | Borrado exitoso y confirmación. |
| TC-19 | Error al borrar activo inexistente | Respuesta 404 controlada. |

## 3. Entorno de Pruebas
- **Framework**: Jest.
- **Librería de Peticiones**: Supertest.
- **Configuración**: Se utiliza un archivo `.env.test` específico para conectar a la DB local (`localhost:3307`).

## 4. Ejecución de Pruebas

Para ejecutar la suite completa desde la raíz del proyecto:
```bash
npm test
```

Para ver el detalle de los tests en la carpeta api:
```bash
cd api
npm test
```
