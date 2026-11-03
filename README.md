# Restaurante API

API REST para gestionar los pedidos de un restaurante: categorías, platos del menú y pedidos por mesa. Tiene dos roles: **administrador**, que gestiona el menú, y **mesero**, que toma los pedidos.

Construida con Node.js, Express, Sequelize y PostgreSQL. Autenticación con JWT y contraseñas cifradas con bcrypt.

## Dominio elegido

Se eligió la gestión de pedidos de un restaurante porque es un caso real con roles bien diferenciados: el administrador controla qué se vende y a qué precio, y el mesero solo necesita consultar el menú y registrar lo que pide cada mesa. Eso justifica la autorización por roles y una restricción concreta: solo el administrador puede eliminar platos. El modelo de datos tiene relaciones naturales (una categoría agrupa muchos platos y un pedido contiene muchos platos con su cantidad), lo que permite aplicar asociaciones `hasMany`, `belongsTo` y `belongsToMany`. Además, el pedido guarda el precio de cada plato en el momento de la venta, para que un cambio posterior en el menú no altere pedidos ya cobrados.

## Requisitos

- Node.js 18 o superior
- Una base de datos PostgreSQL. Dos opciones:
  - **PostgreSQL instalado en la computadora** ([descarga](https://www.postgresql.org/download/)).
  - **PostgreSQL en la nube, sin instalar nada**: crear una base gratuita en [Neon](https://neon.tech) y copiar su URL de conexión en `DATABASE_URL`.

## Instalación

```bash
git clone <url-del-repositorio>
cd restaurante-api
npm install
cp .env.example .env        # en Windows: copy .env.example .env
```

Editar `.env` con los datos de la base y luego:

```bash
npm run seed    # crea las tablas y los datos de prueba
npm run dev     # inicia el servidor en http://localhost:3000
```

> `npm run seed` borra y vuelve a crear las tablas. Usarlo solo para preparar el entorno.

## Variables de entorno

| Variable | Descripción | Ejemplo |
| --- | --- | --- |
| `PORT` | Puerto del servidor | `3000` |
| `NODE_ENV` | Entorno (`development`, `test`, `production`) | `development` |
| `DATABASE_URL` | URL completa de PostgreSQL. Si existe, se usa en lugar de las variables `DB_*` | `postgresql://usuario:clave@host/restaurante?sslmode=require` |
| `DB_HOST` | Servidor de PostgreSQL | `localhost` |
| `DB_PORT` | Puerto de PostgreSQL | `5432` |
| `DB_NAME` | Nombre de la base | `restaurante` |
| `DB_USER` | Usuario | `postgres` |
| `DB_PASSWORD` | Contraseña | `postgres` |
| `JWT_SECRET` | Clave para firmar los tokens | una cadena larga y secreta |
| `JWT_EXPIRES_IN` | Duración del token | `8h` |

## Usuarios de prueba

Creados por `npm run seed`:

| Rol | Correo | Contraseña |
| --- | --- | --- |
| Administrador | `admin@restaurante.com` | `Admin123!` |
| Mesero | `mesero@restaurante.com` | `Mesero123!` |

Las cuentas creadas con `/api/auth/register` siempre son de mesero: el rol nunca se acepta desde el body.

## Endpoints

Todas las rutas de `/api`, salvo registro y login, requieren la cabecera `Authorization: Bearer <token>`.

### Salud

| Método | Ruta | Acceso | Descripción |
| --- | --- | --- | --- |
| GET | `/health` | Público | Estado del servidor |

### Autenticación

| Método | Ruta | Acceso | Descripción |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Público | Crea una cuenta de mesero y devuelve el token |
| POST | `/api/auth/login` | Público | Inicia sesión y devuelve el token |
| GET | `/api/auth/me` | Autenticado | Datos del usuario actual |

### Categorías

| Método | Ruta | Acceso | Descripción |
| --- | --- | --- | --- |
| GET | `/api/categories` | Autenticado | Lista de categorías |
| GET | `/api/categories/:id` | Autenticado | Una categoría con sus platos |
| POST | `/api/categories` | Admin | Crea una categoría |
| PUT | `/api/categories/:id` | Admin | Edita una categoría |
| DELETE | `/api/categories/:id` | Admin | Elimina una categoría sin platos |

### Platos del menú (entidad principal, CRUD completo)

| Método | Ruta | Acceso | Descripción |
| --- | --- | --- | --- |
| GET | `/api/menu-items` | Autenticado | Lista de platos. Filtros: `?categoryId=2&available=true` |
| GET | `/api/menu-items/:id` | Autenticado | Un plato con su categoría |
| POST | `/api/menu-items` | Admin | Crea un plato |
| PUT | `/api/menu-items/:id` | Admin | Edita un plato |
| DELETE | `/api/menu-items/:id` | **Solo admin** | Elimina un plato |

### Pedidos

| Método | Ruta | Acceso | Descripción |
| --- | --- | --- | --- |
| GET | `/api/orders` | Admin y mesero | El admin ve todos; el mesero, solo los suyos |
| GET | `/api/orders/:id` | Admin y mesero | Detalle con platos, cantidades y precios |
| POST | `/api/orders` | Admin y mesero | Crea un pedido y calcula el total |
| PATCH | `/api/orders/:id/status` | Admin y mesero | Cambia el estado: `pendiente`, `en_preparacion`, `servido`, `pagado`, `cancelado` |
| DELETE | `/api/orders/:id` | Admin | Elimina un pedido |

Ejemplo de cuerpo para crear un pedido:

```json
{
  "tableNumber": 4,
  "notes": "Sin cebolla",
  "items": [
    { "menuItemId": 3, "quantity": 2 },
    { "menuItemId": 6, "quantity": 2 }
  ]
}
```

### Códigos de estado

| Código | Cuándo |
| --- | --- |
| 200 | Consulta o edición correcta |
| 201 | Recurso creado |
| 204 | Recurso eliminado |
| 400 | Datos inválidos (incluye el detalle por campo) |
| 401 | Sin token, token inválido o credenciales incorrectas |
| 403 | El rol no tiene permiso |
| 404 | Recurso o ruta inexistente |
| 409 | Conflicto: correo repetido o categoría con platos |
| 429 | Demasiadas peticiones (rate limit) |

Todos los errores tienen el mismo formato:

```json
{ "status": "error", "message": "Datos inválidos", "details": [{ "campo": "price", "mensaje": "..." }] }
```

## Estructura

```
src/
  app.js            configuración de Express y middlewares
  server.js         conexión a la base e inicio del servidor
  seed.js           datos de prueba
  config/           conexión de Sequelize
  models/           User, Category, MenuItem, Order, OrderItem y asociaciones
  controllers/      lógica de cada recurso (async/await)
  routes/           definición de rutas
  validators/       reglas de express-validator
  middlewares/      verifyToken, checkRole, validate, errorHandler, notFound,
                    rateLimiters y requestTimer (middleware propio)
  utils/            AppError, asyncHandler y JWT
tests/              pruebas con Jest y Supertest
postman/            colección de Postman exportada
```

## Middleware

En orden de aplicación: `helmet` (cabeceras de seguridad), `cors`, `morgan` (registro de peticiones), `express.json`, `requestTimer` y rate limiting en todas las rutas de `/api`, con un límite más estricto en login y registro.

`requestTimer` es un middleware personalizado: mide el tiempo de cada petición y lo devuelve en la cabecera `X-Response-Time`.

## Pruebas

```bash
npm test
```

Cubren el health check, la validación del login, la respuesta 401 sin token, la respuesta 403 cuando un mesero intenta eliminar un plato y el formato del error 404. No necesitan base de datos, porque prueban las capas que responden antes de llegar a los controladores.

## Colección de Postman

Importar `postman/Restaurante-API.postman_collection.json`. Ejecutar primero **Login admin** y **Login mesero**: guardan los tokens en las variables de la colección y el resto de peticiones los usan automáticamente.
