import db from '../DB/db.js';


export const store = async (login_id, deviceId, deviceInfo, activity_type, response) => {
  await db.promise().query(
    `INSERT INTO auth_activity (
      login_id, device_id,
      ip_address, country, country_code, region, city,
      latitude, longitude,
      activity_type,
      response
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      login_id,
      deviceId,
      deviceInfo.locationInfo.ip,
      deviceInfo.locationInfo.country,
      deviceInfo.locationInfo.countryCode,
      deviceInfo.locationInfo.region,
      deviceInfo.locationInfo.city,
      deviceInfo.locationInfo.latitude,
      deviceInfo.locationInfo.longitude,
      activity_type,
      response
    ]
  );
};