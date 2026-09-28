CREATE DATABASE IF NOT EXISTS derivacion_emap
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE derivacion_emap;

CREATE TABLE IF NOT EXISTS usuarios (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre        VARCHAR(100)  NOT NULL,
  email         VARCHAR(150)  NOT NULL UNIQUE,
  password_hash VARCHAR(255)  NOT NULL,
  rol           VARCHAR(30)   NOT NULL DEFAULT 'usuario',
  creado_en     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB;

-- Usuario inicial: admin@emap.local / admin123
INSERT INTO usuarios (nombre, email, password_hash, rol)
VALUES (
  'Administrador',
  'admin@emap.local',
  '$2b$10$FWi5nGz5Xa6PoudBMQ4Xy.FxnpKN47CSt7gpFxfR4nUzmjpW3Uap6',
  'admin'
)
ON DUPLICATE KEY UPDATE email = email;