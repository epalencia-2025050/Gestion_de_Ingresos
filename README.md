# 💰 Gestión de Ingresos

Aplicación full-stack para la gestión personal de ingresos y gastos, con autenticación segura, dashboard interactivo con gráficas, historial de transacciones y panel de administración.

---

## 📋 Tabla de Contenidos

- [Tecnologías](#-tecnologías)
- [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
- [Estructura de Directorios](#-estructura-de-directorios)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación y Ejecución](#-instalación-y-ejecución)
- [Variables de Entorno](#-variables-de-entorno)
- [Base de Datos](#-base-de-datos)
- [Autenticación y JWT](#-autenticación-y-jwt)
- [API REST — Endpoints](#-api-rest--endpoints)
- [Dashboard de Ingresos](#-dashboard-de-ingresos)
- [Seguridad](#-seguridad)
- [Usuarios de Prueba](#-usuarios-de-prueba)

---

## 🛠 Tecnologías

### Backend
| Tecnología | Versión | Propósito |
|---|---|---|
| **Node.js** | ≥ 20 | Entorno de ejecución |
| **Express** | ^4.19 | Framework HTTP |
| **TypeScript** | ^5.4 | Tipado estático |
| **PostgreSQL** | ≥ 14 | Base de datos relacional |
| **jsonwebtoken** | ^9.0 | Emisión y verificación de JWT |
| **bcryptjs** | ^2.4 | Hash de contraseñas |
| **express-validator** | ^7.1 | Validación de entradas |
| **helmet** | ^7.1 | Headers HTTP de seguridad |
| **cors** | ^2.8 | Control de acceso cruzado |
| **dotenv** | ^16.4 | Carga de variables de entorno |
| **ts-node / nodemon** | — | Desarrollo con recarga automática |

### Frontend
| Tecnología | Versión | Propósito |
|---|---|---|
| **Angular** | ^18.2 | Framework SPA |
| **TypeScript** | ^5.5 | Tipado estático |
| **TailwindCSS** | ^3.4 | Estilos utilitarios |
| **Chart.js** | ^4.5 | Gráficas interactivas |
| **Three.js** | ^0.185 | Animación 3D en login |
| **RxJS** | ^7.8 | Programación reactiva |

---

## 🏗 Arquitectura del Proyecto

`
Gestión de Ingresos
├── backend/          ← API REST (Node.js + Express + TypeScript)
└── frontend/         ← SPA (Angular 18 + TailwindCSS)
`

### Patrón de capas (Backend)

`
HTTP Request
    │
    ▼
[ Routes ]         ← Definición de endpoints y validaciones
    │
    ▼
[ Middlewares ]    ← auth, role, validate, error
    │
    ▼
[ Controllers ]    ← Manejo de request/response
    │
    ▼
[ Services ]       ← Lógica de negocio
    │
    ▼
[ Repositories ]   ← Acceso a datos (SQL puro con pg)
    │
    ▼
[ PostgreSQL ]
`

---

## 📁 Estructura de Directorios

`
Gestion_de_Ingresos/
│
├── backend/
│   ├── src/
│   │   ├── app.ts                   ← Instancia Express + middlewares globales
│   │   ├── server.ts                ← Arranque del servidor HTTP
│   │   ├── config/
│   │   │   └── env.ts               ← Carga y tipado de variables de entorno
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── dashboard.controller.ts
│   │   │   ├── ingreso.controller.ts
│   │   │   └── gasto.controller.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── dashboard.service.ts
│   │   │   ├── ingreso.service.ts
│   │   │   └── gasto.service.ts
│   │   ├── repositories/
│   │   │   ├── ingreso.repository.ts
│   │   │   └── gasto.repository.ts
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.ts   ← Verificación JWT
│   │   │   ├── role.middleware.ts   ← Control de roles (admin/user)
│   │   │   ├── validate.middleware.ts
│   │   │   └── error.middleware.ts
│   │   ├── routes/
│   │   │   ├── index.routes.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── dashboard.routes.ts
│   │   │   ├── ingreso.routes.ts
│   │   │   └── gasto.routes.ts
│   │   ├── models/
│   │   │   └── user.model.ts
│   │   ├── types/                   ← Extensiones de tipos Express
│   │   └── utils/
│   │       └── jwt.util.ts          ← Sign / Verify JWT
│   ├── database/
│   │   ├── schema.sql               ← DDL: tablas, índices, triggers
│   │   └── seed.sql                 ← Datos de prueba iniciales
│   ├── .env                         ← Variables de entorno (NO subir a git)
│   ├── .env.example                 ← Plantilla de variables de entorno
│   └── package.json
│
└── frontend/
    └── src/
        ├── app/
        │   ├── app.routes.ts        ← Rutas lazy-loaded con guards
        │   ├── app.config.ts        ← Providers globales (HTTP, interceptors)
        │   ├── core/
        │   │   ├── guards/
        │   │   │   ├── auth.guard.ts    ← Protege rutas autenticadas
        │   │   │   └── admin.guard.ts   ← Protege rutas de administrador
        │   │   ├── interceptors/
        │   │   │   ├── jwt.interceptor.ts         ← Adjunta token a requests
        │   │   │   └── auth-error.interceptor.ts  ← Maneja 401 globalmente
        │   │   ├── services/
        │   │   │   ├── auth.service.ts
        │   │   │   └── finanzas.service.ts
        │   │   └── models/
        │   └── features/
        │       ├── auth/pages/login/
        │       ├── dashboard/pages/home/
        │       └── admin/pages/users/
        └── assets/
            └── icons/               ← Iconos PNG de la barra lateral
`

---

## ✅ Requisitos Previos

Antes de ejecutar el proyecto instala:

1. **Node.js** v20 o superior → https://nodejs.org
2. **pnpm** → 
pm install -g pnpm
3. **PostgreSQL** v14 o superior → https://www.postgresql.org
4. **Angular CLI** → 
pm install -g @angular/cli

---

## 🚀 Instalación y Ejecución

### 1. Clonar el repositorio

`ash
git clone https://github.com/tu-usuario/gestion-de-ingresos.git
cd gestion-de-ingresos
`

### 2. Configurar la Base de Datos

Abre **pgAdmin** o la consola de PostgreSQL y ejecuta:

`sql
-- Crear la base de datos
CREATE DATABASE gestion_ingresos;

-- Conectarse a ella
\c gestion_ingresos

-- Crear tablas, índices y triggers
\i backend/database/schema.sql

-- Insertar usuarios de prueba
\i backend/database/seed.sql
`

### 3. Configurar el Backend

`ash
cd backend

# Copiar plantilla de variables de entorno
copy .env.example .env
# Editar .env con tus credenciales de PostgreSQL

# Instalar dependencias
pnpm install

# Iniciar en modo desarrollo (con recarga automática)
pnpm run dev
`

> El servidor arranca en http://localhost:3000

### 4. Configurar el Frontend

Abre una nueva terminal:

`ash
cd frontend

# Instalar dependencias
pnpm install
pnpm install three
pnpm install --save-dev @types/three

# Iniciar servidor de desarrollo Angular
pnpm start
`

> La aplicación abre en http://localhost:4200

### 5. Build de Producción (Frontend)

`ash
cd frontend
pnpm run build
# Archivos generados en: dist/frontend/
`

---

## 🔧 Variables de Entorno

Crea el archivo ackend/.env basándote en .env.example:

`env
# Servidor
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=cambia_esta_clave_por_una_larga_y_aleatoria
JWT_EXPIRES_IN=24h

# Base de datos (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_contraseña
DB_NAME=gestion_ingresos

# CORS
CORS_ORIGIN=http://localhost:4200
`

> ⚠️ NUNCA subas .env al repositorio. Está incluido en .gitignore.

---

## 🗄 Base de Datos

### Diagrama de Tablas

`
usuarios
├── id                  SERIAL PK
├── nombre              VARCHAR(150)
├── email               VARCHAR(150) UNIQUE
├── password_hash       VARCHAR(255)         ← bcrypt hash
├── rol                 ENUM('admin','user')
├── activo              BOOLEAN
├── fecha_creacion      TIMESTAMP
└── fecha_actualizacion TIMESTAMP            ← Auto-actualizado por trigger

ingresos
├── id          SERIAL PK
├── usuario_id  FK → usuarios.id
├── monto       NUMERIC
├── descripcion TEXT
├── categoria   VARCHAR
├── estado      VARCHAR
└── fecha       TIMESTAMP

gastos
├── id          SERIAL PK
├── usuario_id  FK → usuarios.id
├── monto       NUMERIC
├── descripcion TEXT
├── categoria   VARCHAR
└── fecha       TIMESTAMP
`

### Características del Schema

- **Trigger automático**: 	rg_usuarios_actualizacion actualiza echa_actualizacion en cada UPDATE de la tabla usuarios.
- **Índices**: en email y ol para búsquedas eficientes.
- **ENUM de roles**: ol_usuario con valores dmin y user.

---

## 🔐 Autenticación y JWT

### Flujo de Autenticación

`
[Usuario] → POST /api/auth/login { email, password }
                │
                ▼
        [auth.service]
            verifica email en BD
            bcrypt.compare(password, hash)
                │
                ▼
        [jwt.util] → jwt.sign({ sub, email, rol }, JWT_SECRET, { expiresIn })
                │
                ▼
        Respuesta: { token: eyJhbGci... }
                │
                ▼
[Frontend] guarda token en localStorage
`

### Estructura del JWT Payload

`json
{
  sub: 1,
  email: usuario@ejemplo.com,
  rol: user,
  iat: 1700000000,
  exp: 1700086400
}
`

### Verificación del Token (Backend)

El middleware uth.middleware.ts intercepta cada request protegido:

`	ypescript
export function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  const payload = verifyAccessToken(token);      // jwt.verify()
  req.userId    = payload.sub;
  req.userEmail = payload.email;
  req.userRole  = payload.rol;
  next();
  // Si falla → 401 Token invalido o expirado
}
`

### Envío Automático del Token (Frontend)

El JwtInterceptor adjunta automáticamente el token a todas las requests HTTP:

`	ypescript
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const token = authService.getToken(); // lee desde localStorage
  const authReq = req.clone({
    setHeaders: { Authorization: Bearer  },
  });
  return next(authReq);
};
`

### Expiración y Logout Automático

- El uth-error.interceptor.ts captura respuestas 401 del servidor y ejecuta logout() automáticamente.
- El uthGuard verifica si el token está expirado antes de renderizar la ruta protegida:

`	ypescript
// auth.guard.ts
if (authService.isTokenExpired()) {
  authService.logout(true); // redirige al login
  return false;
}
`

### Control de Roles

- **Backend**: oleMiddleware verifica eq.userRole contra los roles permitidos.
- **Frontend**: dminGuard comprueba el rol del usuario decodificando el token antes de permitir acceso a /admin/users.

---

## 📡 API REST — Endpoints

Base URL: http://localhost:3000/api

### Autenticación

| Método | Ruta | Cuerpo | Auth | Descripción |
|---|---|---|---|---|
| POST | /auth/login | { email, password } | No | Iniciar sesión, devuelve JWT |
| POST | /auth/register | { nombre, email, password } | No | Registrar nuevo usuario |
| GET | /auth/me | — | JWT | Perfil del usuario autenticado |
| GET | /auth/users | — | Admin | Listar todos los usuarios |

### Dashboard

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | /dashboard/resumen | JWT | Totales de ingresos, gastos y balance |
| GET | /dashboard/categorias | JWT | Gastos agrupados por categoría |
| GET | /dashboard/tendencia?months=6 | JWT | Evolución mensual de ingresos |

### Ingresos

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | /ingresos | JWT | Listar todos los ingresos del usuario |
| GET | /ingresos/:id | JWT | Obtener un ingreso por ID |
| POST | /ingresos | JWT | Crear nuevo ingreso |
| PUT | /ingresos/:id | JWT | Actualizar ingreso existente |
| DELETE | /ingresos/:id | JWT | Eliminar ingreso |

**Body para crear/actualizar ingreso:**
`json
{
  monto: 1500.00,
  descripcion: Salario quincena,
  fecha: 2026-08-01,
  categoria: Salario,
  estado: recibido
}
`

### Gastos

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | /gastos | JWT | Listar todos los gastos del usuario |
| POST | /gastos | JWT | Registrar nuevo gasto |
| PUT | /gastos/:id | JWT | Actualizar gasto |
| DELETE | /gastos/:id | JWT | Eliminar gasto |

---

## 📊 Dashboard de Ingresos

El dashboard es una SPA interna de página única que cambia de vista mediante un signal ctiveView() sin recargar la página.

### Vistas disponibles

| Vista | Descripción |
|---|---|
| dashboard | Resumen general: balance, ingresos, gastos, gráfica de evolución |
| ingresos | Formulario para registrar nuevos ingresos con cálculo de IVA |
| history | Historial completo de gastos en tabla paginada |
| eports | Reportes y análisis de finanzas |
| config | Configuración de perfil bancario del usuario |

### Cálculo de IVA e Ingresos

`
IVA   = monto × 0.12     (tasa Guatemala 12%)
Neto  = monto × 0.88
Pago  → PAGO POR HORA / 40 horas semanas
`

### Gráfica de Evolución (Chart.js)

Usa @ViewChild con setter para garantizar que el canvas esté disponible antes de inicializar Chart.js:

`	ypescript
@ViewChild('evolutionCanvas')
set evolutionCanvas(el: ElementRef<HTMLCanvasElement>) {
  if (el) {
    this._evolutionCanvas = el;
    this.initChart(); // inicializa solo cuando el DOM está listo
  }
}
`

Los datos provienen directamente de GET /dashboard/tendencia, sin datos aleatorios.

---

## 🔒 Seguridad

| Medida | Implementación |
|---|---|
| Hash de contraseñas | bcryptjs con salt automático (factor 10) |
| Tokens JWT | Firmados con HS256, expiran en 24 horas |
| Headers seguros | helmet configura CSP, X-Frame-Options, etc. |
| CORS restringido | Solo permite origen http://localhost:4200 |
| Validación de entradas | express-validator en cada endpoint |
| Control de roles | Middleware roleMiddleware en rutas de admin |
| Guard en frontend | authGuard y adminGuard protegen rutas SPA |
| Interceptor 401 | auth-error.interceptor hace logout automático |

---

## 👤 Usuarios de Prueba

Después de ejecutar seed.sql tendrás disponibles:

| Rol | Email | Contraseña |
|---|---|---|
| Administrador | admin@demo.com | Admin123456 |
| Usuario | test@demo.com | Test123456 |

> Las contraseñas están almacenadas como hash bcrypt en la base de datos.

---

## 🧪 Scripts Disponibles

### Backend

`ash
pnpm run dev    # Desarrollo con nodemon + ts-node
pnpm run build  # Compila TypeScript a dist/
pnpm run start  # Ejecuta la versión compilada
`

### Frontend

`ash
pnpm start         # Servidor de desarrollo → localhost:4200
pnpm run build     # Build de producción → dist/frontend/
pnpm run watch     # Build con recarga automática
`

---

## 📌 Notas de Desarrollo

- El backend usa SQL puro con el driver pg sin ORM.
- El frontend usa Angular 18 Standalone Components con carga perezosa (loadComponent).
- Los signals de Angular (signal(), computed()) manejan el estado reactivo del dashboard.
- El token JWT se almacena en localStorage.

---

*Desarrollado como proyecto de gestión de finanzas personales.*
