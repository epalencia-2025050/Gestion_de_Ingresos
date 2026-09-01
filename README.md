# Gestión de Ingresos

Aplicación full-stack para la gestión personal de ingresos y gastos, con autenticación segura, dashboard interactivo con gráficas, historial de transacciones y panel de administración.

## Tecnologías

## Backend
| Tecnología |
**Node.js** 
**Express** 
**TypeScript** 
**PostgreSQL** 
**jsonwebtoken** 
**bcryptjs** 
**express-validator** 

## Frontend
| Tecnología |
**Angular**
**TypeScript**
**TailwindCSS**
**Chart.js**
**Three.js**
**RxJS**

## Arquitectura del Proyecto

Gestión de Ingresos
├── backend/         
└── frontend/      

## Patrón de capas (Backend)

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

## 1. Clonar el repositorio
git clone https://github.com/tu-usuario/gestion-de-ingresos.git
cd gestion-de-ingresos

## 2. Configurar la Base de Datos

Abre **pgAdmin** o la consola de PostgreSQL y ejecuta:
-- Crear la base de datos
CREATE DATABASE gestion_ingresos;
-- Conectarse a ella
gestion_ingresos
-- Crear tablas, índices y triggers
backend/database/schema.sql
-- Insertar usuarios de prueba
backend/database/seed.sql


## 3. Configurar el Backend
cd backend
# Copiar plantilla de variables de entorno
.env
# Instalar dependencias
pnpm install
# Iniciar en modo desarrollo 
pnpm run dev

## 4. Configurar el Frontend
Abre una nueva terminal:
cd frontend
# Instalar dependencias
pnpm install
pnpm install three

# Iniciar servidor de desarrollo Angular
pnpm start

### 5. Build de Producción (Frontend)
cd frontend
pnpm run build
# Archivos generados en: dist/frontend/

## Variables de Entorno
Crea el archivo .env

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


## Base de Datos

## Diagrama de Tablas

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

## Expiración y Logout Automático
- El auth-error.interceptor.ts captura respuestas 401 del servidor y ejecuta logout() automáticamente.
- El authGuard verifica si el token está expirado antes de renderizar la ruta protegida:

## API REST — Endpoints
Base URL: http://localhost:3000/api

### Cálculo de IVA e Ingresos
IVA   = monto × 0.12     (tasa Guatemala 12%)
Neto  = monto × 0.88
Pago  → PAGO POR HORA / 40 horas semanas
Los datos provienen directamente de GET /dashboard/tendencia, sin datos aleatorios.

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
