-- ============================================================
-- Visitor Management System - PostgreSQL Schema (Supabase)
-- ============================================================

-- Companies
CREATE TABLE IF NOT EXISTS companies (
  id SERIAL PRIMARY KEY,
  company_name VARCHAR(150) NOT NULL,
  company_code VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(150),
  mobile VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100),
  pincode VARCHAR(20),
  website VARCHAR(200),
  logo TEXT,
  status VARCHAR(10) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Roles
CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  role_name VARCHAR(100) NOT NULL UNIQUE,
  status VARCHAR(10) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  company_id INTEGER REFERENCES companies(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  full_name VARCHAR(100) NOT NULL,
  employee_code VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(150) NOT NULL UNIQUE,
  mobile VARCHAR(20) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'Admin',
  status VARCHAR(10) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ,
  profile_photo VARCHAR(255),
  updated_at TIMESTAMPTZ,
  username VARCHAR(100) UNIQUE,
  role_id INTEGER
);

-- Departments
CREATE TABLE IF NOT EXISTS departments (
  id SERIAL PRIMARY KEY,
  department_name VARCHAR(150)
);

-- Employees
CREATE TABLE IF NOT EXISTS employees (
  id SERIAL PRIMARY KEY,
  company_id INTEGER REFERENCES companies(id) ON DELETE SET NULL,
  employee_code VARCHAR(50) NOT NULL UNIQUE,
  employee_name VARCHAR(100) NOT NULL,
  department VARCHAR(100),
  designation VARCHAR(100),
  email VARCHAR(100),
  mobile VARCHAR(20),
  warehouse VARCHAR(100),
  status VARCHAR(10) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  username VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  role_id INTEGER,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

-- Permissions
CREATE TABLE IF NOT EXISTS permissions (
  id SERIAL PRIMARY KEY,
  permission_name VARCHAR(100) NOT NULL UNIQUE
);

-- Role Permissions
CREATE TABLE IF NOT EXISTS role_permissions (
  id SERIAL PRIMARY KEY,
  role_id INTEGER,
  module_name VARCHAR(100),
  can_create SMALLINT DEFAULT 0,
  can_read SMALLINT DEFAULT 0,
  can_update SMALLINT DEFAULT 0,
  can_delete SMALLINT DEFAULT 0
);

-- Visitors
CREATE TABLE IF NOT EXISTS visitors (
  id SERIAL PRIMARY KEY,
  company_id INTEGER NOT NULL,
  visitor_name VARCHAR(100),
  mobile VARCHAR(20),
  email VARCHAR(100),
  company_name VARCHAR(100),
  visitor_type VARCHAR(50) NOT NULL,
  has_companion SMALLINT DEFAULT 0,
  companion_name VARCHAR(100),
  companion_mobile VARCHAR(20),
  companion_relationship VARCHAR(100),
  has_vehicle SMALLINT DEFAULT 0,
  vehicle_type VARCHAR(50),
  vehicle_number VARCHAR(30),
  driver_name VARCHAR(100),
  has_asset SMALLINT DEFAULT 0,
  purpose VARCHAR(100),
  person_to_meet VARCHAR(100),
  visit_date DATE,
  check_in TIME,
  check_out TIME,
  check_in_at TIMESTAMPTZ,
  check_out_at TIMESTAMPTZ,
  status VARCHAR(20) DEFAULT 'PENDING',
  remarks TEXT,
  id_proof VARCHAR(100),
  id_proof_number VARCHAR(100),
  visitor_photo TEXT,
  signature TEXT,
  live_photo TEXT,
  live_photo_captured_at TIMESTAMPTZ,
  asset_verified SMALLINT DEFAULT 0,
  checked_in_by VARCHAR(100),
  checked_out_by VARCHAR(100),
  security_notes TEXT,
  employee_id INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Visitor Assets
CREATE TABLE IF NOT EXISTS visitor_assets (
  id SERIAL PRIMARY KEY,
  visitor_id INTEGER NOT NULL REFERENCES visitors(id) ON DELETE CASCADE,
  asset_type VARCHAR(100) NOT NULL,
  asset_name VARCHAR(150),
  brand VARCHAR(100),
  model VARCHAR(100),
  serial_number VARCHAR(100),
  quantity INTEGER DEFAULT 1,
  remarks TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  asset_photo TEXT,
  verified SMALLINT DEFAULT 0
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  message TEXT,
  type VARCHAR(50),
  user_id INTEGER,
  is_read SMALLINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  visitor_id INTEGER
);

-- Company Settings
CREATE TABLE IF NOT EXISTS company_settings (
  id SERIAL PRIMARY KEY,
  company_id INTEGER,
  company_name VARCHAR(255),
  company_logo TEXT,
  address TEXT,
  email VARCHAR(255),
  mobile VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Password Resets
CREATE TABLE IF NOT EXISTS password_resets (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  otp VARCHAR(10) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Password Reset OTP
CREATE TABLE IF NOT EXISTS password_reset_otp (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255),
  otp VARCHAR(10),
  expiry_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_company_id ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_employees_company_id ON employees(company_id);
CREATE INDEX IF NOT EXISTS idx_visitors_company_id ON visitors(company_id);
CREATE INDEX IF NOT EXISTS idx_visitor_assets_visitor_id ON visitor_assets(visitor_id);
CREATE INDEX IF NOT EXISTS idx_company_settings_company_id ON company_settings(company_id);

-- Seed Data
INSERT INTO companies (id, company_name, company_code, email, mobile, address, city, state, country, pincode, status)
VALUES (1, 'CCT Pvt.Ltd', 'CCT', 'admin@cct.com', '9898989898', 'Pune, Maharashtra', 'Pune', 'Maharashtra', 'India', '411001', 'ACTIVE')
ON CONFLICT (company_code) DO NOTHING;

INSERT INTO roles (id, role_name, status) VALUES
  (1, 'Admin', 'Active'),
  (3, 'Unit Manager', 'Active'),
  (4, 'Regional Manager', 'Active'),
  (5, 'StoreKeeper', 'Active'),
  (6, 'Employee', 'Active')
ON CONFLICT (role_name) DO NOTHING;

INSERT INTO permissions (id, permission_name) VALUES
  (1, 'Dashboard View'),
  (2, 'Employee View'),
  (3, 'Employee Add'),
  (4, 'Employee Edit'),
  (5, 'Employee Delete'),
  (6, 'Role View'),
  (7, 'Role Add'),
  (8, 'Role Edit'),
  (9, 'Role Delete'),
  (10, 'Visitor View'),
  (11, 'Visitor Add'),
  (12, 'Visitor Edit'),
  (13, 'Visitor Delete'),
  (14, 'Reports View'),
  (15, 'Settings View')
ON CONFLICT (permission_name) DO NOTHING;

-- Adjust sequences after seed data
SELECT setval('companies_id_seq', (SELECT MAX(id) FROM companies));
SELECT setval('roles_id_seq', (SELECT MAX(id) FROM roles));
SELECT setval('permissions_id_seq', (SELECT MAX(id) FROM permissions));
