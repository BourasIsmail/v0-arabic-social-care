-- Create users table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    is_active BOOLEAN DEFAULT TRUE,
    region_id BIGINT NULL,
    prefecture_id BIGINT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_role (role),
    CONSTRAINT fk_users_region FOREIGN KEY (region_id) REFERENCES regions(id),
    CONSTRAINT fk_users_prefecture FOREIGN KEY (prefecture_id) REFERENCES prefectures(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin user (password: admin123)
-- BCrypt hash for 'admin123'
INSERT INTO users (email, password, full_name, role, is_active) VALUES 
('admin@social.ma', '$2a$10$N9qo8uLOickgx2ZMRZoMy.Mrq7lMLmSlVnT5.mV5BqJh.xCKXuVsa', 'المدير العام', 'ADMIN', true);
