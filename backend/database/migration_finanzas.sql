-- Tablas de Ingresos y Gastos para Gestion de Ingresos

CREATE TABLE IF NOT EXISTS ingresos (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    monto NUMERIC(12, 2) NOT NULL CHECK (monto >= 0),
    descripcion VARCHAR(255) NOT NULL,
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    categoria VARCHAR(100) NOT NULL DEFAULT 'Otros',
    estado VARCHAR(50) NOT NULL DEFAULT 'completado',
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gastos (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    monto NUMERIC(12, 2) NOT NULL CHECK (monto >= 0),
    descripcion VARCHAR(255) NOT NULL,
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    categoria VARCHAR(100) NOT NULL,
    estado VARCHAR(50) NOT NULL DEFAULT 'pagado', -- 'pagado' (cobrado) / 'pendiente' (por cobrar)
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indices para optimizar consultas por usuario y fechas
CREATE INDEX IF NOT EXISTS idx_ingresos_usuario_id ON ingresos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_ingresos_fecha ON ingresos(fecha);
CREATE INDEX IF NOT EXISTS idx_gastos_usuario_id ON gastos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_gastos_fecha ON gastos(fecha);
CREATE INDEX IF NOT EXISTS idx_gastos_categoria ON gastos(categoria);
CREATE INDEX IF NOT EXISTS idx_gastos_estado ON gastos(estado);

-- Triggers para fecha_actualizacion
DROP TRIGGER IF EXISTS trg_ingresos_actualizacion ON ingresos;
CREATE TRIGGER trg_ingresos_actualizacion
BEFORE UPDATE ON ingresos
FOR EACH ROW
EXECUTE FUNCTION set_fecha_actualizacion();

DROP TRIGGER IF EXISTS trg_gastos_actualizacion ON gastos;
CREATE TRIGGER trg_gastos_actualizacion
BEFORE UPDATE ON gastos
FOR EACH ROW
EXECUTE FUNCTION set_fecha_actualizacion();

