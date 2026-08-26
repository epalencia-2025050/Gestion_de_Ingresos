-- Semilla inicial de Ingresos y Gastos para los usuarios existentes (id 1 y 2)

-- Ingresos para Usuario 1 y 2
INSERT INTO ingresos (usuario_id, monto, descripcion, fecha, categoria, estado) VALUES
(1, 18500.00, 'Salario Mensual Principal', CURRENT_DATE - INTERVAL '1 month', 'Salario', 'completado'),
(1, 9940.75, 'Servicios Profesionales y Consultorías', CURRENT_DATE - INTERVAL '15 days', 'Servicios', 'completado'),
(1, 15000.00, 'Ingreso por Proyectos Freelance', CURRENT_DATE - INTERVAL '5 days', 'Freelance', 'completado'),
(2, 20000.00, 'Salario Base de Operaciones', CURRENT_DATE - INTERVAL '20 days', 'Salario', 'completado'),
(2, 12000.00, 'Comisiones por Ventas', CURRENT_DATE - INTERVAL '5 days', 'Comisiones', 'completado')
ON CONFLICT DO NOTHING;

-- Gastos para Usuario 1 y 2
-- Categorías: Vivienda, Alimentación, Transporte, Otros
-- Estados: pagado (cobrado) / pendiente (por cobrar)
INSERT INTO gastos (usuario_id, monto, descripcion, fecha, categoria, estado) VALUES
(1, 3860.00, 'Alquiler de Apartamento y Mantenimiento', CURRENT_DATE - INTERVAL '20 days', 'Vivienda', 'pagado'),
(1, 2450.00, 'Supermercado y Despensa Familiar', CURRENT_DATE - INTERVAL '12 days', 'Alimentación', 'pagado'),
(1, 1250.00, 'Combustible y Mantenimiento de Vehículo', CURRENT_DATE - INTERVAL '8 days', 'Transporte', 'pagado'),
(1, 800.00, 'Servicios de Internet, Streaming y Luz', CURRENT_DATE - INTERVAL '3 days', 'Otros', 'pagado'),
(1, 3860.00, 'Factura de Servicios Pendiente de Pago', CURRENT_DATE - INTERVAL '2 days', 'Vivienda', 'pendiente'),
(2, 4500.00, 'Pago de Hipoteca', CURRENT_DATE - INTERVAL '15 days', 'Vivienda', 'pagado'),
(2, 2100.00, 'Alimentación Semanal', CURRENT_DATE - INTERVAL '7 days', 'Alimentación', 'pagado'),
(2, 1100.00, 'Transporte y Gasolina', CURRENT_DATE - INTERVAL '4 days', 'Transporte', 'pendiente')
ON CONFLICT DO NOTHING;

