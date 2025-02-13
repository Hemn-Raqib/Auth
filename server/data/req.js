import db from '../DB/db.js';


// In req.js
async function reqData(
  deviceInfo,
  activity_TYPE,
  response_out,
  username,
  email
) {
  try {
    // Start transaction
    await db.promise().beginTransaction();

    // Ensure deviceId is never null
    if (!deviceInfo.deviceId) {
      throw new Error('Device identifier cannot be null');
    }

    const query = `
      INSERT INTO incoming_req_data (
        username, email, device_identifier,
        browser_name, browser_version, browser_engine_name, browser_engine_version,
        device_type, device_vendor, device_model, extended_device_name,
        os_name, os_version,
        ip_address, country, country_code, region, city,
        latitude, longitude,
        activity_type, response_out,
        last_used
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      username || null,
      email,
      deviceInfo.deviceId, // This is now guaranteed to exist
      deviceInfo.browserInfo?.browserName || null,
      deviceInfo.browserInfo?.browserVersion || null,
      deviceInfo.browserInfo?.engineName || null,
      deviceInfo.browserInfo?.engineVersion || null,
      deviceInfo.deviceInfo?.deviceType || null,
      deviceInfo.deviceInfo?.deviceVendor || null,
      deviceInfo.deviceInfo?.deviceModel || null,
      deviceInfo.deviceInfo?.deviceName || null,
      deviceInfo.deviceInfo?.osName || null,
      deviceInfo.deviceInfo?.osVersion || null,
      deviceInfo.locationInfo?.ip || null,
      deviceInfo.locationInfo?.country || null,
      deviceInfo.locationInfo?.countryCode || null,
      deviceInfo.locationInfo?.region || null,
      deviceInfo.locationInfo?.city || null,
      deviceInfo.locationInfo?.latitude || null,
      deviceInfo.locationInfo?.longitude || null,
      activity_TYPE,
      response_out,
      new Date(),
    ];

    const [result] = await db.promise().query(query, values);
    console.log(`@@@@req.js ✅ Data inserted successfully@@@@`);
    await db.promise().commit();
    return result.insertId;
  } catch (error) {
    console.log(`@@@@req.js ❌ Error occurred@@@@`);
    await db.promise().rollback();
    throw error;
  }
}
export { reqData };