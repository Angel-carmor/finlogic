CREATE DATABASE IF NOT EXISTS finlogic;
USE finlogic;

-- Tabla de usuarios (Auth)
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) DEFAULT NULL,
  net_monthly_income DECIMAL(10, 2) DEFAULT 0,
  extra_income DECIMAL(10, 2) DEFAULT 0,
  fixed_loads DECIMAL(10, 2) DEFAULT 0,
  housing DECIMAL(10, 2) DEFAULT 0,
  utilities DECIMAL(10, 2) DEFAULT 0,
  total_debt DECIMAL(10, 2) DEFAULT 0,
  has_emergency_fund BOOLEAN DEFAULT FALSE,
  stable_job BOOLEAN DEFAULT FALSE,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  planning_model VARCHAR(50) DEFAULT NULL,
  debt_strategy VARCHAR(50) DEFAULT 'avalanche',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de transacciones
CREATE TABLE IF NOT EXISTS transactions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  type ENUM('income', 'expense') NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  description VARCHAR(255),
  category VARCHAR(100),
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de deudas del usuario
CREATE TABLE IF NOT EXISTS user_debts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  interest_rate DECIMAL(5, 2) DEFAULT 0.00,
  monthly_payment DECIMAL(10, 2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de inversiones del usuario
CREATE TABLE IF NOT EXISTS user_investments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  ticker VARCHAR(50) DEFAULT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  annual_return DECIMAL(5, 2) DEFAULT 0.00,
  monthly_contribution DECIMAL(10, 2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de snapshots de presupuesto mensual
CREATE TABLE IF NOT EXISTS monthly_budget_snapshots (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  year INT NOT NULL,
  month INT NOT NULL,
  category VARCHAR(100) NOT NULL,
  budget_limit DECIMAL(10, 2) NOT NULL,
  category_type ENUM('necesidad', 'deseo') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_snapshot (user_id, year, month, category),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =========================================================================
-- VOLCADO DE DATOS SEMILLA (SEED DATA) PARA PRUEBAS Y EVALUACIÓN
-- =========================================================================

-- 1. Inserción de Usuario Demo (Email: admin@finlogic.com | Contraseña: SecurityPass123!)
-- Hash Bcrypt precalculado para SecurityPass123!: $2a$10$bJWlegIDIlfoIzgxu9oXduFsTKNKWQh/ULEEZvdUPWU.xbQNgB4DW
INSERT INTO users (id, email, password_hash, name, net_monthly_income, fixed_loads, housing, utilities, total_debt, onboarding_completed, planning_model, debt_strategy)
VALUES (1, 'admin@finlogic.com', '$2a$10$bJWlegIDIlfoIzgxu9oXduFsTKNKWQh/ULEEZvdUPWU.xbQNgB4DW', 'Administrador', 3000.00, 12000.00, 800.00, 200.00, 14500.00, TRUE, '50/30/20', 'avalanche')
ON DUPLICATE KEY UPDATE id=id;

-- 2. Inserción de Deudas Semilla para el Usuario Demo (id: 1)
INSERT INTO user_debts (id, user_id, name, amount, interest_rate, monthly_payment)
VALUES 
  (1, 1, 'Préstamo Coche', 12000.00, 5.50, 250.00),
  (2, 1, 'Tarjeta de Crédito', 2500.00, 15.00, 100.00)
ON DUPLICATE KEY UPDATE id=id;

-- 3. Inserción de Transacciones Semilla para el Usuario Demo (id: 1)
INSERT INTO transactions (id, user_id, type, amount, description, category, date)
VALUES 
  -- Mayo 2026
  (1, 1, 'income',  3000.00, 'Nómina Mensual',          'Salary',    '2026-05-01'),
  (2, 1, 'expense',  800.00, 'Alquiler Piso',            'Housing',   '2026-05-02'),
  (3, 1, 'expense',  180.00, 'Supermercado Semanal',     'Food',      '2026-05-03'),
  (4, 1, 'expense',   50.00, 'Factura de Luz',           'Utilities', '2026-05-04'),
  (5, 1, 'expense',   60.00, 'Abono Transporte',         'Transport', '2026-05-05'),
  (6, 1, 'expense',   95.00, 'Cena Restaurante',         'Leisure',   '2026-05-10'),
  (7, 1, 'expense',  120.00, 'Supermercado Semanal 2',   'Food',      '2026-05-14'),
  -- Abril 2026
  (8, 1, 'income',  3000.00, 'Nómina Mensual Abril',     'Salary',    '2026-04-01'),
  (9, 1, 'expense',  800.00, 'Alquiler Piso Abril',      'Housing',   '2026-04-02'),
  (10,1, 'expense',  310.00, 'Supermercado Abril',       'Food',      '2026-04-05'),
  (11,1, 'expense',  200.00, 'Suministros Abril',        'Utilities', '2026-04-06'),
  (12,1, 'expense',   90.00, 'Transporte Abril',         'Transport', '2026-04-07'),
  (13,1, 'expense',  185.00, 'Ocio Abril',               'Leisure',   '2026-04-15')
ON DUPLICATE KEY UPDATE id=id;

-- 4. Inserción de Inversiones Semilla para el Usuario Demo (id: 1)
INSERT INTO user_investments (id, user_id, name, ticker, amount, annual_return, monthly_contribution)
VALUES 
  (1, 1, 'Apple Inc.', 'AAPL', 1750.00, 8.50, 100.00),
  (2, 1, 'Bitcoin', 'BTC-USD', 3200.00, 12.00, 50.00)
ON DUPLICATE KEY UPDATE id=id;

