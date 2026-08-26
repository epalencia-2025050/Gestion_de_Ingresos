
INSERT INTO usuarios (nombre, email, password_hash, rol)
VALUES (
    'Administrador',
    'admin@demo.com',
    '$2b$10$h4SiOu0ilyKMPKfaWMeQ2ecoaehfdSrO7d7vIvbGgulpwxHGQwDAC',
    'admin'
)
ON CONFLICT (email) DO NOTHING;

INSERT INTO usuarios (nombre, email, password_hash, rol)
VALUES (
    'Usuario de Prueba',
    'test@demo.com',
    '$2b$10$R4iiILOqMC8OO7irfprNkuXtolKC6oFHQ99ePvpHfrmWXxe.KPw7q',
    'user'
)
ON CONFLICT (email) DO NOTHING;
