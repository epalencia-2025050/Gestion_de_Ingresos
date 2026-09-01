
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'rol_usuario') THEN
        CREATE TYPE rol_usuario AS ENUM ('admin', 'user');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS usuarios (
    id                   SERIAL PRIMARY KEY,
    nombre               VARCHAR(150)  NOT NULL,
    email                VARCHAR(150)  NOT NULL UNIQUE,
    password_hash        VARCHAR(255)  NOT NULL,
    rol                  rol_usuario   NOT NULL DEFAULT 'user',
    activo               BOOLEAN       NOT NULL DEFAULT TRUE,
    fecha_creacion       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indices utiles
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios (email);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON usuarios (rol);

-- Trigger para mantener fecha_actualizacion al dia (PostgreSQL)
CREATE OR REPLACE FUNCTION set_fecha_actualizacion()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_usuarios_actualizacion ON usuarios;
CREATE TRIGGER trg_usuarios_actualizacion
BEFORE UPDATE ON usuarios
FOR EACH ROW
EXECUTE FUNCTION set_fecha_actualizacion();
