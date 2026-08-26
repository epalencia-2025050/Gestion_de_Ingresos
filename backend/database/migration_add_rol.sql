
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'rol_usuario') THEN
        CREATE TYPE rol_usuario AS ENUM ('admin', 'user');
    END IF;
END $$;

ALTER TABLE usuarios
    ADD COLUMN IF NOT EXISTS rol rol_usuario NOT NULL DEFAULT 'user';

CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON usuarios (rol);
