CREATE DATABASE IF NOT EXISTS finlogic;
USE finlogic;

-- Tabla de usuarios (Auth)
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  net_monthly_income DECIMAL(10, 2) DEFAULT 0,
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
