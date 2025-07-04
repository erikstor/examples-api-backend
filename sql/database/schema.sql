-- =====================================================
-- Esquema de base de datos para CRUD Example
-- MySQL 8.0+
-- =====================================================

-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS crud_example;
USE crud_example;

-- =====================================================
-- Tabla de Categorías (debe ir primero por las FK)
-- =====================================================
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    parent_id INT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_name (name),
    INDEX idx_parent (parent_id),
    INDEX idx_active (is_active),
    INDEX idx_deleted (deleted_at)
);

-- =====================================================
-- Tabla de Usuarios
-- =====================================================
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone VARCHAR(20),
    date_of_birth DATE,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    role ENUM('user', 'admin', 'moderator') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_active (is_active),
    INDEX idx_role (role),
    INDEX idx_deleted (deleted_at),
    INDEX idx_created (created_at)
);

-- =====================================================
-- Tabla de Productos
-- =====================================================
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    cost_price DECIMAL(10,2),
    stock_quantity INT DEFAULT 0,
    min_stock_level INT DEFAULT 10,
    category_id INT,
    sku VARCHAR(50) UNIQUE,
    barcode VARCHAR(50),
    weight DECIMAL(8,2),
    dimensions VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_name (name),
    INDEX idx_category (category_id),
    INDEX idx_price (price),
    INDEX idx_sku (sku),
    INDEX idx_active (is_active),
    INDEX idx_featured (is_featured),
    INDEX idx_deleted (deleted_at),
    INDEX idx_stock (stock_quantity)
);

-- =====================================================
-- Tabla de Órdenes
-- =====================================================
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_number VARCHAR(20) UNIQUE NOT NULL,
    user_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    shipping_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded') DEFAULT 'pending',
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    shipping_address TEXT,
    billing_address TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_order_number (order_number),
    INDEX idx_user (user_id),
    INDEX idx_status (status),
    INDEX idx_payment_status (payment_status),
    INDEX idx_created (created_at),
    INDEX idx_deleted (deleted_at)
);

-- =====================================================
-- Tabla de Detalles de Órdenes
-- =====================================================
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    INDEX idx_order (order_id),
    INDEX idx_product (product_id)
);

-- =====================================================
-- Tabla de Auditoría
-- =====================================================
CREATE TABLE audit_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    table_name VARCHAR(50) NOT NULL,
    record_id INT NOT NULL,
    action ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    old_values JSON NULL,
    new_values JSON NULL,
    user_id INT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_table_record (table_name, record_id),
    INDEX idx_action (action),
    INDEX idx_user (user_id),
    INDEX idx_created (created_at),
    INDEX idx_ip (ip_address)
);

-- =====================================================
-- Tabla de Sesiones de Usuario
-- =====================================================
CREATE TABLE user_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    refresh_token VARCHAR(255) UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_token (session_token),
    INDEX idx_refresh (refresh_token),
    INDEX idx_expires (expires_at),
    INDEX idx_active (is_active)
);

-- =====================================================
-- Tabla de Configuraciones del Sistema
-- =====================================================
CREATE TABLE system_config (
    id INT PRIMARY KEY AUTO_INCREMENT,
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value TEXT,
    config_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_key (config_key),
    INDEX idx_public (is_public)
);

-- =====================================================
-- Tabla de Logs del Sistema
-- =====================================================
CREATE TABLE system_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    level ENUM('debug', 'info', 'warning', 'error', 'critical') NOT NULL,
    message TEXT NOT NULL,
    context JSON,
    user_id INT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_level (level),
    INDEX idx_user (user_id),
    INDEX idx_created (created_at),
    INDEX idx_ip (ip_address)
);

-- =====================================================
-- Insertar configuraciones por defecto
-- =====================================================
INSERT INTO system_config (config_key, config_value, config_type, description, is_public) VALUES
('app_name', 'CRUD Example API', 'string', 'Nombre de la aplicación', TRUE),
('app_version', '1.0.0', 'string', 'Versión de la aplicación', TRUE),
('maintenance_mode', 'false', 'boolean', 'Modo mantenimiento', TRUE),
('max_login_attempts', '5', 'number', 'Máximo intentos de login', FALSE),
('session_timeout', '3600', 'number', 'Tiempo de sesión en segundos', FALSE),
('password_min_length', '8', 'number', 'Longitud mínima de contraseña', TRUE),
('email_verification_required', 'true', 'boolean', 'Verificación de email requerida', TRUE),
('default_user_role', 'user', 'string', 'Rol por defecto para nuevos usuarios', FALSE),
('pagination_default_limit', '10', 'number', 'Límite por defecto para paginación', TRUE),
('max_pagination_limit', '100', 'number', 'Límite máximo para paginación', TRUE);

-- =====================================================
-- Crear índices compuestos para optimización
-- =====================================================
CREATE INDEX idx_users_email_active ON users(email, is_active);
CREATE INDEX idx_users_username_active ON users(username, is_active);
CREATE INDEX idx_products_category_active ON products(category_id, is_active);
CREATE INDEX idx_products_price_active ON products(price, is_active);
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
CREATE INDEX idx_orders_status_created ON orders(status, created_at);
CREATE INDEX idx_audit_table_action ON audit_log(table_name, action);
CREATE INDEX idx_audit_user_created ON audit_log(user_id, created_at);
CREATE INDEX idx_sessions_user_active ON user_sessions(user_id, is_active);
CREATE INDEX idx_sessions_token_active ON user_sessions(session_token, is_active);

-- =====================================================
-- Crear índices de texto completo para búsquedas
-- =====================================================
CREATE FULLTEXT INDEX idx_users_search ON users(username, first_name, last_name, email);
CREATE FULLTEXT INDEX idx_products_search ON products(name, description);
CREATE FULLTEXT INDEX idx_categories_search ON categories(name, description);

-- =====================================================
-- Comentarios de tabla para documentación
-- =====================================================
ALTER TABLE users COMMENT = 'Tabla de usuarios del sistema';
ALTER TABLE products COMMENT = 'Tabla de productos del catálogo';
ALTER TABLE categories COMMENT = 'Tabla de categorías de productos';
ALTER TABLE orders COMMENT = 'Tabla de órdenes de compra';
ALTER TABLE order_items COMMENT = 'Tabla de items de órdenes';
ALTER TABLE audit_log COMMENT = 'Tabla de auditoría de cambios';
ALTER TABLE user_sessions COMMENT = 'Tabla de sesiones de usuario';
ALTER TABLE system_config COMMENT = 'Tabla de configuración del sistema';
ALTER TABLE system_logs COMMENT = 'Tabla de logs del sistema'; 