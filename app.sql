CREATE TABLE app.codes (
    id INT NOT NULL AUTO_INCREMENT,
    verification_code CHAR(6) NOT NULL,
    code_type ENUM('signup', 'login') NOT NULL DEFAULT 'signup', 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiry_time DATETIME NOT NULL,
    used TINYINT(1) DEFAULT 0,
    PRIMARY KEY (id),
    UNIQUE (verification_code, code_type), 
    INDEX (expiry_time), 
    INDEX (used) 
);

CREATE TABLE app.two_factor_auth (
    tfa_id INT NOT NULL AUTO_INCREMENT,
    login_id INT NOT NULL,
    email VARCHAR(255) NOT NULL,
    verification_code VARCHAR(6) NOT NULL, 
    expiry_time DATETIME NOT NULL,
    verified TINYINT(1) DEFAULT 0, -- Using TINYINT for better storage efficiency
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Column for creation date
    PRIMARY KEY (tfa_id),
    FOREIGN KEY (login_id) REFERENCES login(login_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    UNIQUE (email, verification_code) -- Prevent duplicate codes for the same email
);




-- Drop existing table if needed (backup first!)
DROP TABLE IF EXISTS `app`.`refresh_tokens`;

CREATE TABLE `app`.`refresh_tokens` (
  `token_id` INT NOT NULL AUTO_INCREMENT,
  `login_id` INT NOT NULL,
  `token_name` VARCHAR(255) NOT NULL,
  `token` VARCHAR(255) NOT NULL,
  `token_hash` VARCHAR(255) NOT NULL,
  `device_id` INT NOT NULL,
  `ip_address` VARCHAR(45) NOT NULL,
  `issued_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_used_time` TIMESTAMP NULL,
  `expires_at` DATETIME NOT NULL,
  `revoked_at` TIMESTAMP NULL,
  `revoked_reason` ENUM('MANUAL_LOGOUT', 'TOKEN_REUSE', 'SECURITY_BREACH', 'TOKEN_ROTATION', 'SUSPICIOUS_ACTIVITY') NULL,
  `family_id` CHAR(36) NOT NULL,  -- UUID for token family
  `parent_token_id` INT NULL,     -- References previous token in family
  `rotation_window_ends` TIMESTAMP NULL,
  PRIMARY KEY (`token_id`),
  FOREIGN KEY (`login_id`) REFERENCES `login`(`login_id`) ON DELETE CASCADE,
  FOREIGN KEY (`device_id`) REFERENCES `user_devices`(`device_id`) ON DELETE CASCADE,
  FOREIGN KEY (`parent_token_id`) REFERENCES `refresh_tokens`(`token_id`) ON DELETE SET NULL,
  INDEX idx_token_security (token_hash, revoked_at, expires_at),
  INDEX idx_token_family (family_id, parent_token_id)
);







CREATE TABLE app.login (
  login_id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(20) NULL,
  email VARCHAR(40) NOT NULL,
  password VARCHAR(200) NOT NULL,
  last_login TIMESTAMP NULL,
  failed_attempts INT DEFAULT 0,
  password_updated_at TIMESTAMP NULL,
  PRIMARY KEY (login_id),
  UNIQUE KEY email_unique (email)
);




CREATE TABLE app.user_devices(
  device_id INT NOT NULL AUTO_INCREMENT,
  login_id INT NOT NULL,
  device_identifier VARCHAR(255) NOT NULL,
  -- Browser Information
  browser_name VARCHAR(50) NULL,
  browser_version VARCHAR(50) NULL,
  browser_engine_name VARCHAR(50) NULL,
  browser_engine_version VARCHAR(50) NULL,
  -- Device Details
  device_type VARCHAR(50) NULL,
  device_vendor VARCHAR(100) NULL,
  device_model VARCHAR(100) NULL,
  extended_device_name VARCHAR(255) NULL,
  -- Operating System Details
  os_name VARCHAR(50) NULL,
  os_version VARCHAR(50) NULL,
  -- Screen Information
  is_main_device BOOLEAN DEFAULT FALSE,
  status ENUM('approved', 'pending', 'blocked') DEFAULT 'pending',
  last_used TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (device_id),
  FOREIGN KEY (login_id) REFERENCES login(login_id) ON DELETE CASCADE,
  UNIQUE KEY unique_device_per_user (login_id, device_identifier)
);

ALTER TABLE `app`.`auth_activity`
MODIFY   activity_type ENUM('login', 'logout', 'refresh_token', 'login_code', 'full_verification', 'device_verification', 'location_verification') NOT NULL;
CREATE TABLE app.auth_activity (
  activity_id INT NOT NULL AUTO_INCREMENT,
  login_id INT NOT NULL,
  device_id INT NULL,
  -- Location Information
  ip_address VARCHAR(45) NOT NULL,
  country VARCHAR(100) NULL,
  country_code VARCHAR(10) NULL,
  region VARCHAR(100) NULL,
  city VARCHAR(100) NULL,
  latitude DECIMAL(10, 8) NULL,
  longitude DECIMAL(11, 8) NULL,
  activity_type ENUM('login', 'logout', 'refresh_token', 'login_code', 'full_verification', 'device_verification', 'location_verification') NOT NULL,
  response ENUM('succeed', 'failed') NOT NULL, 
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  additional_info JSON NULL,
  PRIMARY KEY (activity_id),
  FOREIGN KEY (login_id) REFERENCES login(login_id) ON DELETE CASCADE,
  FOREIGN KEY (device_id) REFERENCES user_devices(device_id) ON DELETE SET NULL
);

CREATE TABLE app.location(
  id INT NOT NULL AUTO_INCREMENT,
  login_id INT NOT NULL,
  device_id INT NULL,
  country VARCHAR(100) NULL,
  country_code VARCHAR(10) NULL,
  region VARCHAR(100) NULL,
  city VARCHAR(100) NULL,
  latitude DECIMAL(10, 8) NULL,
  longitude DECIMAL(11, 8) NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (login_id) REFERENCES login(login_id) ON DELETE CASCADE,
  FOREIGN KEY (device_id) REFERENCES user_devices(device_id) ON DELETE SET NULL
);