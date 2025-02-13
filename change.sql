SELECT * FROM app.login;
SELECT * FROM `app`.`login` ORDER BY `login_id` DESC LIMIT 2;
DELETE FROM app.login WHERE `login_id` = 9;
SELECT * FROM app.auth_activity;
SELECT * FROM app.location WHERE login_id = 10;
SELECT * FROM app.user_devices  WHERE login_id = 10;
SELECT * FROM app.user_devices;
DELETE FROM app.user_devices WHERE device_id = 13;
DELETE FROM app.location WHERE id = 9;
SELECT * FROM `app`.`refresh_tokens`;
DELETE FROM `app`.`refresh_tokens`;
DROP TABLE `app`.`refresh_tokens`;
DROP TABLE  app.auth_activity;

UPDATE `app`.`user_devices`
SET `device_type` = 'mobile', `extended_device_name` = 'mobile phone', `os_version` = 12, `os_name` = 'IOS', `is_main_device` = 1, `device_identifier` = 'ujuhyfrbcg6849hnrr'
WHERE `device_id` = 10;

UPDATE `app`.`user_devices`
SET `device_type` = 'desktop', `extended_device_name` = 'Windows PC', `os_version` = 10, `os_name` = 'Windows', `is_main_device` = 1
WHERE `login_id` = 53;

UPDATE `app`.`auth_activity`
SET `country` = 'Iran', `country_code` = 'IR', `region` = 'Tehran', `latitude` = 35.6879, `longitude` = 51.9414, `city` = 'Tehran'
WHERE `login_id` = 46;


-- 50 kilometers away
UPDATE `app`.`auth_activity`
SET `country` = 'Iraq', `country_code` = 'IQ', `region` = 'Erbil', `latitude` = 36.6394, `longitude` = 44.0157, `city` = 'Erbil'
WHERE `login_id` = 45;

-- 110 kilometers away
UPDATE `app`.`location`
SET `country` = 'Iraq', `country_code` = 'IQ', `region` = 'Erbil', `latitude` = 37.1789, `longitude` = 44.0157, `city` = 'Erbil'
WHERE `id` = 8;

UPDATE `app`.`auth_activity`
SET `ip_address` = '185.240.17.70',`country` = 'Iraq', `country_code` = 'IQ', `region` = 'Erbil', `latitude` = 36.18980000, `longitude` = 44.01570000, `city` = 'Erbil'
WHERE `login_id` = 45;
