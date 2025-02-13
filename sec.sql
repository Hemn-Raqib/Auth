CREATE TABLE `app`.`incoming_req_data`(
  id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(100) NULL,
  email VARCHAR(100),
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
  ip_address VARCHAR(45) NOT NULL,
  country VARCHAR(100) NULL,
  country_code VARCHAR(10) NULL,
  region VARCHAR(100) NULL,
  city VARCHAR(100) NULL,
  latitude DECIMAL(10, 8) NULL,
  longitude DECIMAL(11, 8) NULL,
  activity_type  ENUM('error', 'email_exist', 'username_exist', 'signup_code', 
  'invalid_code', 'signup', 'signup_error', 'validation_error', 'invalid_email', 'invalid_password', 'login', 'login_error',
  'signup_code_error', 'account_locked', 'no_device_found', 'device_mismatch', 
  'unauthorized_device', 'new_device_and_location', 'suspicious_location', 'device_verification_error'
  , 'verification', 'verification_error', 'no_refresh_token', 'refresh_token', 'refresh_token_error', 'token_reuse') NOT NULL,
  response_out  ENUM('signup_code', 'signup', 'login', 'failed_login', 'verification', 'refresh_token_failed', 'refresh_token') NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_used TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

