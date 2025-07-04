-- =====================================================
-- Procedimientos almacenados para CRUD de Usuarios
-- MySQL 8.0+
-- =====================================================

USE crud_example;

-- =====================================================
-- Procedimiento: Crear usuario
-- =====================================================
DELIMITER //
CREATE PROCEDURE CreateUser(
    IN p_username VARCHAR(50),
    IN p_email VARCHAR(100),
    IN p_password_hash VARCHAR(255),
    IN p_first_name VARCHAR(50),
    IN p_last_name VARCHAR(50),
    IN p_phone VARCHAR(20),
    IN p_date_of_birth DATE,
    IN p_role ENUM('user', 'admin', 'moderator')
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Validar que el email no exista
    IF EXISTS (SELECT 1 FROM users WHERE email = p_email AND deleted_at IS NULL) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El email ya está registrado';
    END IF;
    
    -- Validar que el username no exista
    IF EXISTS (SELECT 1 FROM users WHERE username = p_username AND deleted_at IS NULL) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El nombre de usuario ya está en uso';
    END IF;
    
    -- Insertar usuario
    INSERT INTO users (
        username, email, password_hash, first_name, last_name,
        phone, date_of_birth, role
    ) VALUES (
        p_username, p_email, p_password_hash, p_first_name, p_last_name,
        p_phone, p_date_of_birth, COALESCE(p_role, 'user')
    );
    
    -- Retornar usuario creado
    SELECT 
        id, username, email, first_name, last_name, phone, date_of_birth,
        is_active, is_verified, role, created_at, updated_at
    FROM users 
    WHERE id = LAST_INSERT_ID();
    
    COMMIT;
END //
DELIMITER ;

-- =====================================================
-- Procedimiento: Obtener usuarios con paginación y filtros
-- =====================================================
DELIMITER //
CREATE PROCEDURE GetUsers(
    IN p_page INT,
    IN p_limit INT,
    IN p_search VARCHAR(100),
    IN p_role ENUM('user', 'admin', 'moderator'),
    IN p_is_active BOOLEAN,
    IN p_sort_by VARCHAR(50),
    IN p_sort_order ENUM('ASC', 'DESC')
)
BEGIN
    DECLARE offset_val INT;
    DECLARE sort_clause VARCHAR(100);
    
    SET offset_val = (COALESCE(p_page, 1) - 1) * COALESCE(p_limit, 10);
    SET sort_clause = CONCAT(
        COALESCE(p_sort_by, 'created_at'), 
        ' ', 
        COALESCE(p_sort_order, 'DESC')
    );
    
    -- Consulta principal con filtros
    SET @sql = CONCAT('
        SELECT 
            id, username, email, first_name, last_name, phone, date_of_birth,
            is_active, is_verified, role, created_at, updated_at
        FROM users 
        WHERE deleted_at IS NULL
            AND (', COALESCE(p_search, 'NULL'), ' IS NULL OR 
                 username LIKE CONCAT(''%'', ''', p_search, ''', ''%'') OR
                 email LIKE CONCAT(''%'', ''', p_search, ''', ''%'') OR
                 first_name LIKE CONCAT(''%'', ''', p_search, ''', ''%'') OR
                 last_name LIKE CONCAT(''%'', ''', p_search, ''', ''%''))
            AND (', COALESCE(p_role, 'NULL'), ' IS NULL OR role = ''', p_role, ''')
            AND (', COALESCE(p_is_active, 'NULL'), ' IS NULL OR is_active = ', p_is_active, ')
        ORDER BY ', sort_clause, '
        LIMIT ', COALESCE(p_limit, 10), ' OFFSET ', offset_val
    );
    
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
    
    -- Contar total de registros
    SELECT COUNT(*) as total
    FROM users 
    WHERE deleted_at IS NULL
        AND (p_search IS NULL OR 
             username LIKE CONCAT('%', p_search, '%') OR
             email LIKE CONCAT('%', p_search, '%') OR
             first_name LIKE CONCAT('%', p_search, '%') OR
             last_name LIKE CONCAT('%', p_search, '%'))
        AND (p_role IS NULL OR role = p_role)
        AND (p_is_active IS NULL OR is_active = p_is_active);
END //
DELIMITER ;

-- =====================================================
-- Procedimiento: Obtener usuario por ID
-- =====================================================
DELIMITER //
CREATE PROCEDURE GetUserById(IN p_id INT)
BEGIN
    SELECT 
        id, username, email, first_name, last_name, phone, date_of_birth,
        is_active, is_verified, role, created_at, updated_at
    FROM users 
    WHERE id = p_id AND deleted_at IS NULL;
    
    IF ROW_COUNT() = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Usuario no encontrado';
    END IF;
END //
DELIMITER ;

-- =====================================================
-- Procedimiento: Obtener usuario por email
-- =====================================================
DELIMITER //
CREATE PROCEDURE GetUserByEmail(IN p_email VARCHAR(100))
BEGIN
    SELECT 
        id, username, email, first_name, last_name, phone, date_of_birth,
        password_hash, is_active, is_verified, role, created_at, updated_at
    FROM users 
    WHERE email = p_email AND deleted_at IS NULL;
END //
DELIMITER ;

-- =====================================================
-- Procedimiento: Actualizar usuario
-- =====================================================
DELIMITER //
CREATE PROCEDURE UpdateUser(
    IN p_id INT,
    IN p_username VARCHAR(50),
    IN p_email VARCHAR(100),
    IN p_first_name VARCHAR(50),
    IN p_last_name VARCHAR(50),
    IN p_phone VARCHAR(20),
    IN p_date_of_birth DATE,
    IN p_is_active BOOLEAN,
    IN p_is_verified BOOLEAN,
    IN p_role ENUM('user', 'admin', 'moderator')
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Verificar que el usuario existe
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = p_id AND deleted_at IS NULL) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Usuario no encontrado';
    END IF;
    
    -- Validar email único si se está actualizando
    IF p_email IS NOT NULL AND EXISTS (
        SELECT 1 FROM users 
        WHERE email = p_email AND id != p_id AND deleted_at IS NULL
    ) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El email ya está registrado por otro usuario';
    END IF;
    
    -- Validar username único si se está actualizando
    IF p_username IS NOT NULL AND EXISTS (
        SELECT 1 FROM users 
        WHERE username = p_username AND id != p_id AND deleted_at IS NULL
    ) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El nombre de usuario ya está en uso por otro usuario';
    END IF;
    
    -- Actualizar usuario
    UPDATE users 
    SET 
        username = COALESCE(p_username, username),
        email = COALESCE(p_email, email),
        first_name = COALESCE(p_first_name, first_name),
        last_name = COALESCE(p_last_name, last_name),
        phone = COALESCE(p_phone, phone),
        date_of_birth = COALESCE(p_date_of_birth, date_of_birth),
        is_active = COALESCE(p_is_active, is_active),
        is_verified = COALESCE(p_is_verified, is_verified),
        role = COALESCE(p_role, role),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_id AND deleted_at IS NULL;
    
    -- Retornar usuario actualizado
    SELECT 
        id, username, email, first_name, last_name, phone, date_of_birth,
        is_active, is_verified, role, created_at, updated_at
    FROM users 
    WHERE id = p_id;
    
    COMMIT;
END //
DELIMITER ;

-- =====================================================
-- Procedimiento: Actualizar contraseña
-- =====================================================
DELIMITER //
CREATE PROCEDURE UpdateUserPassword(
    IN p_id INT,
    IN p_password_hash VARCHAR(255)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Verificar que el usuario existe
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = p_id AND deleted_at IS NULL) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Usuario no encontrado';
    END IF;
    
    -- Actualizar contraseña
    UPDATE users 
    SET 
        password_hash = p_password_hash,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_id AND deleted_at IS NULL;
    
    SELECT ROW_COUNT() as updated_count;
    
    COMMIT;
END //
DELIMITER ;

-- =====================================================
-- Procedimiento: Eliminar usuario (soft delete)
-- =====================================================
DELIMITER //
CREATE PROCEDURE DeleteUser(IN p_id INT)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Verificar que el usuario existe
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = p_id AND deleted_at IS NULL) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Usuario no encontrado';
    END IF;
    
    -- Soft delete
    UPDATE users 
    SET deleted_at = CURRENT_TIMESTAMP
    WHERE id = p_id AND deleted_at IS NULL;
    
    SELECT ROW_COUNT() as deleted_count;
    
    COMMIT;
END //
DELIMITER ;

-- =====================================================
-- Procedimiento: Restaurar usuario (undelete)
-- =====================================================
DELIMITER //
CREATE PROCEDURE RestoreUser(IN p_id INT)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Verificar que el usuario existe y está eliminado
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = p_id AND deleted_at IS NOT NULL) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Usuario no encontrado o no está eliminado';
    END IF;
    
    -- Restaurar usuario
    UPDATE users 
    SET deleted_at = NULL
    WHERE id = p_id AND deleted_at IS NOT NULL;
    
    SELECT ROW_COUNT() as restored_count;
    
    COMMIT;
END //
DELIMITER ;

-- =====================================================
-- Procedimiento: Eliminar usuario permanentemente
-- =====================================================
DELIMITER //
CREATE PROCEDURE DeleteUserPermanently(IN p_id INT)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Verificar que el usuario existe
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = p_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Usuario no encontrado';
    END IF;
    
    -- Eliminar permanentemente
    DELETE FROM users WHERE id = p_id;
    
    SELECT ROW_COUNT() as deleted_count;
    
    COMMIT;
END //
DELIMITER ;

-- =====================================================
-- Procedimiento: Activar/Desactivar usuario
-- =====================================================
DELIMITER //
CREATE PROCEDURE ToggleUserStatus(IN p_id INT)
BEGIN
    DECLARE current_status BOOLEAN;
    
    -- Obtener estado actual
    SELECT is_active INTO current_status
    FROM users 
    WHERE id = p_id AND deleted_at IS NULL;
    
    IF current_status IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Usuario no encontrado';
    END IF;
    
    -- Cambiar estado
    UPDATE users 
    SET 
        is_active = NOT current_status,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_id AND deleted_at IS NULL;
    
    SELECT 
        id, username, email, is_active, updated_at
    FROM users 
    WHERE id = p_id;
END //
DELIMITER ;

-- =====================================================
-- Procedimiento: Verificar email
-- =====================================================
DELIMITER //
CREATE PROCEDURE VerifyUserEmail(IN p_id INT)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Verificar que el usuario existe
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = p_id AND deleted_at IS NULL) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Usuario no encontrado';
    END IF;
    
    -- Marcar como verificado
    UPDATE users 
    SET 
        is_verified = TRUE,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_id AND deleted_at IS NULL;
    
    SELECT ROW_COUNT() as verified_count;
    
    COMMIT;
END //
DELIMITER ;

-- =====================================================
-- Procedimiento: Obtener estadísticas de usuarios
-- =====================================================
DELIMITER //
CREATE PROCEDURE GetUserStats()
BEGIN
    SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN is_active = TRUE THEN 1 END) as active_users,
        COUNT(CASE WHEN is_verified = TRUE THEN 1 END) as verified_users,
        COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_users,
        COUNT(CASE WHEN role = 'moderator' THEN 1 END) as moderator_users,
        COUNT(CASE WHEN role = 'user' THEN 1 END) as regular_users,
        COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as new_users_30_days,
        COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as new_users_7_days,
        COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 1 DAY) THEN 1 END) as new_users_today
    FROM users 
    WHERE deleted_at IS NULL;
END //
DELIMITER ; 