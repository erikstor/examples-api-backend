# Ejemplos CRUD con SQL (MySQL)

Este directorio contiene ejemplos completos de operaciones CRUD usando SQL puro con MySQL, incluyendo scripts de base de datos, procedimientos almacenados, triggers y ejemplos de uso.

## 🚀 Características

- **Base de datos**: MySQL 8.0+
- **Scripts SQL**: Creación de tablas, índices, constraints
- **Procedimientos almacenados**: CRUD operations
- **Triggers**: Auditoría automática
- **Vistas**: Consultas optimizadas
- **Índices**: Optimización de consultas
- **Seguridad**: Usuarios y permisos
- **Backup**: Scripts de respaldo y restauración

## 📋 Prerrequisitos

- MySQL 8.0 o superior
- MySQL Workbench (opcional, para interfaz gráfica)
- Git

## 🛠️ Instalación

### 1. Instalar MySQL

#### Windows
```bash
# Descargar MySQL Installer desde:
# https://dev.mysql.com/downloads/installer/
```

#### macOS
```bash
brew install mysql
brew services start mysql
```

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
```

### 2. Configurar MySQL
```bash
sudo mysql_secure_installation
```

### 3. Crear base de datos
```bash
mysql -u root -p
```

```sql
CREATE DATABASE crud_example;
USE crud_example;
```

## 📁 Estructura del proyecto

```
sql/
├── README.md                    # Documentación principal
├── database/
│   ├── schema.sql              # Esquema de la base de datos
│   ├── data.sql                # Datos de ejemplo
│   └── indexes.sql             # Índices para optimización
├── procedures/
│   ├── user_crud.sql           # Procedimientos CRUD para usuarios
│   ├── product_crud.sql        # Procedimientos CRUD para productos
│   └── order_crud.sql          # Procedimientos CRUD para órdenes
├── triggers/
│   ├── audit_triggers.sql      # Triggers de auditoría
│   └── validation_triggers.sql # Triggers de validación
├── views/
│   ├── user_views.sql          # Vistas para usuarios
│   └── report_views.sql        # Vistas para reportes
├── security/
│   ├── users.sql               # Creación de usuarios
│   └── permissions.sql         # Configuración de permisos
├── backup/
│   ├── backup.sql              # Script de respaldo
│   └── restore.sql             # Script de restauración
└── examples/
    ├── basic_crud.sql          # Ejemplos básicos de CRUD
    ├── advanced_queries.sql    # Consultas avanzadas
    └── performance_tests.sql   # Tests de rendimiento
```

## 🗄️ Esquema de la base de datos

### Tabla de Usuarios
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_active (is_active)
);
```

### Tabla de Productos
```sql
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    category_id INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    INDEX idx_name (name),
    INDEX idx_category (category_id),
    INDEX idx_price (price),
    INDEX idx_active (is_active)
);
```

### Tabla de Categorías
```sql
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    parent_id INT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id),
    INDEX idx_name (name),
    INDEX idx_parent (parent_id)
);
```

### Tabla de Órdenes
```sql
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    shipping_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user (user_id),
    INDEX idx_status (status),
    INDEX idx_created (created_at)
);
```

### Tabla de Auditoría
```sql
CREATE TABLE audit_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    table_name VARCHAR(50) NOT NULL,
    record_id INT NOT NULL,
    action ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    old_values JSON NULL,
    new_values JSON NULL,
    user_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_table_record (table_name, record_id),
    INDEX idx_action (action),
    INDEX idx_created (created_at)
);
```

## 🔧 Procedimientos almacenados

### Crear usuario
```sql
DELIMITER //
CREATE PROCEDURE CreateUser(
    IN p_username VARCHAR(50),
    IN p_email VARCHAR(100),
    IN p_password_hash VARCHAR(255),
    IN p_first_name VARCHAR(50),
    IN p_last_name VARCHAR(50)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    INSERT INTO users (username, email, password_hash, first_name, last_name)
    VALUES (p_username, p_email, p_password_hash, p_first_name, p_last_name);
    
    SELECT 
        id, username, email, first_name, last_name, 
        created_at, updated_at
    FROM users 
    WHERE id = LAST_INSERT_ID();
    
    COMMIT;
END //
DELIMITER ;
```

### Obtener usuarios con paginación
```sql
DELIMITER //
CREATE PROCEDURE GetUsers(
    IN p_page INT,
    IN p_limit INT,
    IN p_search VARCHAR(100)
)
BEGIN
    DECLARE offset_val INT;
    SET offset_val = (p_page - 1) * p_limit;
    
    SELECT 
        id, username, email, first_name, last_name,
        is_active, created_at, updated_at
    FROM users 
    WHERE deleted_at IS NULL
        AND (p_search IS NULL OR 
             username LIKE CONCAT('%', p_search, '%') OR
             email LIKE CONCAT('%', p_search, '%') OR
             first_name LIKE CONCAT('%', p_search, '%') OR
             last_name LIKE CONCAT('%', p_search, '%'))
    ORDER BY created_at DESC
    LIMIT p_limit OFFSET offset_val;
    
    SELECT COUNT(*) as total
    FROM users 
    WHERE deleted_at IS NULL
        AND (p_search IS NULL OR 
             username LIKE CONCAT('%', p_search, '%') OR
             email LIKE CONCAT('%', p_search, '%') OR
             first_name LIKE CONCAT('%', p_search, '%') OR
             last_name LIKE CONCAT('%', p_search, '%'));
END //
DELIMITER ;
```

### Actualizar usuario
```sql
DELIMITER //
CREATE PROCEDURE UpdateUser(
    IN p_id INT,
    IN p_username VARCHAR(50),
    IN p_email VARCHAR(100),
    IN p_first_name VARCHAR(50),
    IN p_last_name VARCHAR(50),
    IN p_is_active BOOLEAN
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    UPDATE users 
    SET 
        username = COALESCE(p_username, username),
        email = COALESCE(p_email, email),
        first_name = COALESCE(p_first_name, first_name),
        last_name = COALESCE(p_last_name, last_name),
        is_active = COALESCE(p_is_active, is_active),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_id AND deleted_at IS NULL;
    
    SELECT 
        id, username, email, first_name, last_name,
        is_active, created_at, updated_at
    FROM users 
    WHERE id = p_id;
    
    COMMIT;
END //
DELIMITER ;
```

### Eliminar usuario (soft delete)
```sql
DELIMITER //
CREATE PROCEDURE DeleteUser(IN p_id INT)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    UPDATE users 
    SET deleted_at = CURRENT_TIMESTAMP
    WHERE id = p_id AND deleted_at IS NULL;
    
    SELECT ROW_COUNT() as deleted_count;
    
    COMMIT;
END //
DELIMITER ;
```

## 🔄 Triggers

### Trigger de auditoría para usuarios
```sql
DELIMITER //
CREATE TRIGGER users_audit_insert
AFTER INSERT ON users
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (table_name, record_id, action, new_values, user_id)
    VALUES ('users', NEW.id, 'INSERT', JSON_OBJECT(
        'username', NEW.username,
        'email', NEW.email,
        'first_name', NEW.first_name,
        'last_name', NEW.last_name,
        'is_active', NEW.is_active
    ), NEW.id);
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER users_audit_update
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (table_name, record_id, action, old_values, new_values, user_id)
    VALUES ('users', NEW.id, 'UPDATE', JSON_OBJECT(
        'username', OLD.username,
        'email', OLD.email,
        'first_name', OLD.first_name,
        'last_name', OLD.last_name,
        'is_active', OLD.is_active
    ), JSON_OBJECT(
        'username', NEW.username,
        'email', NEW.email,
        'first_name', NEW.first_name,
        'last_name', NEW.last_name,
        'is_active', NEW.is_active
    ), NEW.id);
END //
DELIMITER ;
```

## 👁️ Vistas

### Vista de usuarios activos
```sql
CREATE VIEW active_users AS
SELECT 
    id, username, email, first_name, last_name,
    created_at, updated_at
FROM users 
WHERE is_active = TRUE AND deleted_at IS NULL;
```

### Vista de productos con categorías
```sql
CREATE VIEW products_with_categories AS
SELECT 
    p.id, p.name, p.description, p.price, p.stock_quantity,
    c.name as category_name, c.description as category_description,
    p.is_active, p.created_at, p.updated_at
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.deleted_at IS NULL;
```

### Vista de órdenes con detalles
```sql
CREATE VIEW orders_with_users AS
SELECT 
    o.id, o.total_amount, o.status, o.shipping_address,
    u.username, u.email, u.first_name, u.last_name,
    o.created_at, o.updated_at
FROM orders o
JOIN users u ON o.user_id = u.id
WHERE u.deleted_at IS NULL;
```

## 🔒 Seguridad

### Crear usuario de aplicación
```sql
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON crud_example.* TO 'app_user'@'localhost';
GRANT EXECUTE ON PROCEDURE crud_example.* TO 'app_user'@'localhost';
FLUSH PRIVILEGES;
```

### Crear usuario de solo lectura
```sql
CREATE USER 'readonly_user'@'localhost' IDENTIFIED BY 'readonly_password';
GRANT SELECT ON crud_example.* TO 'readonly_user'@'localhost';
FLUSH PRIVILEGES;
```

## 📊 Ejemplos de uso

### Ejemplo básico de CRUD
```sql
-- Crear usuario
CALL CreateUser('johndoe', 'john@example.com', 'hashed_password', 'John', 'Doe');

-- Obtener usuarios
CALL GetUsers(1, 10, NULL);

-- Actualizar usuario
CALL UpdateUser(1, 'johnupdated', 'john.updated@example.com', 'John', 'Updated', TRUE);

-- Eliminar usuario
CALL DeleteUser(1);
```

### Consultas avanzadas
```sql
-- Usuarios más activos (con más órdenes)
SELECT 
    u.username, u.email, COUNT(o.id) as order_count, SUM(o.total_amount) as total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.deleted_at IS NULL
GROUP BY u.id, u.username, u.email
ORDER BY order_count DESC, total_spent DESC;

-- Productos por categoría con stock bajo
SELECT 
    c.name as category_name,
    COUNT(p.id) as product_count,
    AVG(p.price) as avg_price,
    SUM(p.stock_quantity) as total_stock
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
WHERE c.is_active = TRUE AND p.deleted_at IS NULL
GROUP BY c.id, c.name
HAVING total_stock < 100
ORDER BY total_stock ASC;

-- Órdenes por mes
SELECT 
    YEAR(created_at) as year,
    MONTH(created_at) as month,
    COUNT(*) as order_count,
    SUM(total_amount) as total_revenue,
    AVG(total_amount) as avg_order_value
FROM orders
GROUP BY YEAR(created_at), MONTH(created_at)
ORDER BY year DESC, month DESC;
```

## 💾 Backup y Restauración

### Script de respaldo
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="crud_example"

# Crear directorio de respaldo si no existe
mkdir -p $BACKUP_DIR

# Respaldo completo
mysqldump -u root -p --single-transaction --routines --triggers $DB_NAME > $BACKUP_DIR/${DB_NAME}_${DATE}.sql

# Comprimir respaldo
gzip $BACKUP_DIR/${DB_NAME}_${DATE}.sql

# Eliminar respaldos antiguos (más de 30 días)
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "Backup completado: ${DB_NAME}_${DATE}.sql.gz"
```

### Script de restauración
```bash
#!/bin/bash
BACKUP_FILE=$1
DB_NAME="crud_example"

if [ -z "$BACKUP_FILE" ]; then
    echo "Uso: $0 <archivo_backup>"
    exit 1
fi

# Descomprimir si es necesario
if [[ $BACKUP_FILE == *.gz ]]; then
    gunzip -c $BACKUP_FILE | mysql -u root -p $DB_NAME
else
    mysql -u root -p $DB_NAME < $BACKUP_FILE
fi

echo "Restauración completada"
```

## 🧪 Tests de rendimiento

### Test de consultas
```sql
-- Habilitar profiling
SET profiling = 1;

-- Ejecutar consulta
SELECT * FROM users WHERE email = 'test@example.com';

-- Ver resultados del profiling
SHOW PROFILES;
SHOW PROFILE FOR QUERY 1;

-- Deshabilitar profiling
SET profiling = 0;
```

### Test de índices
```sql
-- Verificar uso de índices
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';

-- Analizar tabla
ANALYZE TABLE users;

-- Ver estadísticas de tabla
SHOW TABLE STATUS LIKE 'users';
```

## 📈 Optimización

### Índices recomendados
```sql
-- Índices compuestos
CREATE INDEX idx_users_email_active ON users(email, is_active);
CREATE INDEX idx_products_category_price ON products(category_id, price);
CREATE INDEX idx_orders_user_status ON orders(user_id, status);

-- Índices de texto completo
CREATE FULLTEXT INDEX idx_products_search ON products(name, description);
CREATE FULLTEXT INDEX idx_users_search ON users(username, first_name, last_name);
```

### Configuración de MySQL
```ini
[mysqld]
# Configuración de rendimiento
innodb_buffer_pool_size = 1G
innodb_log_file_size = 256M
innodb_flush_log_at_trx_commit = 2
innodb_flush_method = O_DIRECT

# Configuración de consultas
query_cache_type = 1
query_cache_size = 64M
max_connections = 200

# Configuración de logs
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow.log
long_query_time = 2
```

## 🔍 Monitoreo

### Consultas lentas
```sql
-- Ver consultas lentas
SELECT 
    sql_text,
    exec_count,
    avg_timer_wait/1000000000 as avg_time_sec,
    sum_timer_wait/1000000000 as total_time_sec
FROM performance_schema.events_statements_summary_by_digest
WHERE avg_timer_wait > 1000000000
ORDER BY avg_timer_wait DESC;
```

### Estadísticas de tabla
```sql
-- Ver estadísticas de uso
SELECT 
    table_name,
    table_rows,
    data_length,
    index_length,
    (data_length + index_length) as total_size
FROM information_schema.tables
WHERE table_schema = 'crud_example'
ORDER BY total_size DESC;
```

## 🚀 Despliegue

### Script de instalación completa
```bash
#!/bin/bash

# Variables
DB_NAME="crud_example"
DB_USER="app_user"
DB_PASSWORD="secure_password"

echo "Instalando base de datos CRUD..."

# Crear base de datos
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;"

# Ejecutar scripts en orden
mysql -u root -p $DB_NAME < database/schema.sql
mysql -u root -p $DB_NAME < database/indexes.sql
mysql -u root -p $DB_NAME < procedures/user_crud.sql
mysql -u root -p $DB_NAME < procedures/product_crud.sql
mysql -u root -p $DB_NAME < procedures/order_crud.sql
mysql -u root -p $DB_NAME < triggers/audit_triggers.sql
mysql -u root -p $DB_NAME < triggers/validation_triggers.sql
mysql -u root -p $DB_NAME < views/user_views.sql
mysql -u root -p $DB_NAME < views/report_views.sql
mysql -u root -p $DB_NAME < database/data.sql

# Crear usuarios y permisos
mysql -u root -p < security/users.sql
mysql -u root -p < security/permissions.sql

echo "Instalación completada!"
```

## 📚 Recursos adicionales

- [MySQL Documentation](https://dev.mysql.com/doc/)
- [MySQL Performance Tuning](https://dev.mysql.com/doc/refman/8.0/en/optimization.html)
- [MySQL Security](https://dev.mysql.com/doc/refman/8.0/en/security.html)
- [MySQL Backup](https://dev.mysql.com/doc/refman/8.0/en/backup-methods.html)

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. 