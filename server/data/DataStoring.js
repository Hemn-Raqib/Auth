import db from '../DB/db.js';

async function storeDeviceInformation(loginId, deviceInfo, is_main_device, auth, device) {
  try {
    await db.promise().beginTransaction();
    let deviceId = null;

    if (device) {
      // Store device information
      const [deviceResult] = await db.promise().query(
        `INSERT INTO user_devices (
          login_id, device_identifier,
          browser_name, browser_version, browser_engine_name, browser_engine_version,
          device_type, device_vendor, device_model, extended_device_name,
          os_name, os_version,
          is_main_device, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved')`,
        [
          loginId,
          deviceInfo.deviceId,
          deviceInfo.browserInfo.browserName,
          deviceInfo.browserInfo.browserVersion,
          deviceInfo.browserInfo.engineName,
          deviceInfo.browserInfo.engineVersion,
          deviceInfo.deviceInfo.deviceType,
          deviceInfo.deviceInfo.deviceVendor,
          deviceInfo.deviceInfo.deviceModel,
          deviceInfo.deviceInfo.deviceName,
          deviceInfo.deviceInfo.osName,
          deviceInfo.deviceInfo.osVersion,
          is_main_device
        ]
      );
      
      deviceId = deviceResult.insertId;
    }

    if (auth) {
      if (!deviceId) {
        const [existingDevice] = await db.promise().query(
          'SELECT device_id FROM user_devices WHERE login_id = ? AND device_identifier = ?',
          [loginId, deviceInfo.deviceId]
        );
        deviceId = existingDevice[0]?.device_id;
      }
      
      await db.promise().query(
        `INSERT INTO location (
          login_id, device_id,
          country, country_code, region, city,
          latitude, longitude
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          loginId,
          deviceId,
          deviceInfo.locationInfo.country,
          deviceInfo.locationInfo.countryCode,
          deviceInfo.locationInfo.region,
          deviceInfo.locationInfo.city,
          deviceInfo.locationInfo.latitude,
          deviceInfo.locationInfo.longitude
        ]
      );
    }

    console.log(`@@@@DataStoring ✅@@@@`);
    await db.promise().commit();
    return deviceId;
  } catch (error) {
    console.log(`@@@@DataStoring ❌@@@@`);
    await db.promise().rollback();
    throw error;
  }
}

export { storeDeviceInformation };
