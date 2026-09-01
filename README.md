# Gestión de Ingresos

Aplicación full-stack para la gestión personal de ingresos y gastos, con autenticación segura, dashboard interactivo con gráficas, historial de transacciones y panel de administración.

## Tecnologías

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

## Arquitectura del Proyecto

`
Gestión de Ingresos
├── backend/          ← API REST (Node.js + Express + TypeScript)
└── frontend/         ← SPA (Angular 18 + TailwindCSS)

### Patrón de capas (Backend)

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

## Estructura de Directorios

`
Gestion_de_Ingresos/
│
├── backend/
│   ├── src/
│   │   ├── app.ts                   
│   │   ├── server.ts                
│   │   ├── config/
│   │   │   └── env.ts               
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
│   │   │   ├── auth.middleware.ts   
│   │   │   ├── role.middleware.ts   
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
│   │   ├── types/                   
│   │   └── utils/
│   │       └── jwt.util.ts          
│   ├── database/
│   │   ├── schema.sql              
│   │   └── seed.sql                 
│   ├── .env                         
│   ├── .env.example                 
│   └── package.json
│
└── frontend/
    └── src/
        ├── app/
        │   ├── app.routes.ts        
        │   ├── app.config.ts        
        │   ├── core/
        │   │   ├── guards/
        │   │   │   ├── auth.guard.ts    
        │   │   │   └── admin.guard.ts   
        │   │   ├── interceptors/
        │   │   │   ├── jwt.interceptor.ts         
        │   │   │   └── auth-error.interceptor.ts  
        │   │   ├── services/
        │   │   │   ├── auth.service.ts
        │   │   │   └── finanzas.service.ts
        │   │   └── models/
        │   └── features/
        │       ├── auth/pages/login/
        │       ├── dashboard/pages/home/
        │       └── admin/pages/users/
        └── assets/
            └── icons/               


## Requisitos Previos

Antes de ejecutar el proyecto instala:
1. **Node.js** v20 
2. **pnpm** pnpm install
3. **PostgreSQL** v18 
4. **Angular CLI** pnpm install -g @angular/cli


## Instalación y Ejecución

### 1. Clonar el repositorio
git clone https://github.com/tu-usuario/gestion-de-ingresos.git
cd gestion-de-ingresos

### 2. Configurar la Base de Datos

Abre **pgAdmin** o la consola de PostgreSQL y ejecuta:
-- Crear la base de datos
CREATE DATABASE gestion_ingresos;
-- Conectarse a ella
gestion_ingresos
-- Crear tablas, índices y triggers
backend/database/schema.sql
-- Insertar usuarios de prueba
backend/database/seed.sql


### 3. Configurar el Backend
cd backend
# Copiar plantilla de variables de entorno
copy .env.example .env
# Editar .env con tus credenciales de PostgreSQL
# Instalar dependencias
pnpm install
# Iniciar en modo desarrollo 
pnpm run dev

### 4. Configurar el Frontend
Abre una nueva terminal:
cd frontend
# Instalar dependencias
pnpm install
pnpm install three
pnpm install --save-dev @types/three

# Iniciar servidor de desarrollo Angular
pnpm start

### 5. Build de Producción (Frontend)
cd frontend
pnpm run build
# Archivos generados en: dist/frontend/

## Variables de Entorno

Crea el archivo Backend/.env basándote en .env.example:
.env
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


## 🗄 Base de Datos

### Diagrama de Tablas

usuarios
├── id                  SERIAL PK
├── nombre              VARCHAR(150)
├── email               VARCHAR(150) UNIQUE
├── password_hash       VARCHAR(255)         
├── rol                 ENUM('admin','user')
├── activo              BOOLEAN
├── fecha_creacion      TIMESTAMP
└── fecha_actualizacion TIMESTAMP            

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

## Autenticación y JWT

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

El middleware auth.middleware.ts intercepta cada request protegido:

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
- El auth-error.interceptor.ts captura respuestas 401 del servidor y ejecuta logout() automáticamente.
- El authGuard verifica si el token está expirado antes de renderizar la ruta protegida:

`	ypescript
// auth.guard.ts
if (authService.isTokenExpired()) {
  authService.logout(true); // redirige al login
  return false;
}

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

### Gastos
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | /gastos | JWT | Listar todos los gastos del usuario |
| POST | /gastos | JWT | Registrar nuevo gasto |
| PUT | /gastos/:id | JWT | Actualizar gasto |
| DELETE | /gastos/:id | JWT | Eliminar gasto |


## 📊 Dashboard de Ingresos
El dashboard es una página única que cambia de vista mediante un signal activeView() sin recargar la página.

### Vistas disponibles
| Vista | Descripción |
|---|---|
| dashboard | Resumen general: balance, ingresos, gastos, gráfica de evolución |
| ingresos | Formulario para registrar nuevos ingresos con cálculo de IVA |
| history | Historial completo de gastos en tabla paginada |
| 
eports | Reportes y análisis de finanzas |
| config | Configuración de perfil bancario del usuario |

### Cálculo de IVA e Ingresos
IVA   = monto × 0.12     (tasa Guatemala 12%)
Neto  = monto × 0.88
Pago  → PAGO POR HORA / 40 horas semanas
Los datos provienen directamente de GET /dashboard/tendencia, sin datos aleatorios.

## Seguridad
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

## Usuarios

Después de ejecutar seed.sql tendrás disponibles:
| Rol | Email | Contraseña |
|---|---|---|
| Administrador | admin@demo.com | Admin123456 |
| Usuario | test@demo.com | Test123456 |

## Scripts Disponibles

### Backend
pnpm run dev    
pnpm run build  
pnpm run start  

### Frontend
pnpm start        
pnpm run build     
pnpm run watch    

*Desarollado por Eduardo Emilio Palencia Mejia.* 
*Desarrollado como proyecto de gestión de finanzas personales.*
