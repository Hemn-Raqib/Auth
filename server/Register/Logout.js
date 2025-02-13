import express from 'express';
import db from '../DB/db.js';
import { collectDeviceInfo } from '../data/deviceinfo.js';
import { getLocationInfo } from '../data/locationinfo.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    // 1. Get essential data
    const { login_id } = req.body;
    const locationInfo = await getLocationInfo(req);
    const deviceInfo = await collectDeviceInfo(req);

    // 2. Validate required data
    if (!login_id) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized: Missing credentials'
      });
    }

    // 3. Get actual device ID from database
    const [deviceResult] = await db.promise().query(
      `SELECT device_id 
       FROM user_devices 
       WHERE login_id = ? 
       AND device_identifier = ? 
       LIMIT 1`,
      [login_id, deviceInfo.fingerprint]
    );

    const device_id = deviceResult[0]?.device_id || null;

    // 4. Record logout activity
    await db.promise().query(
      `INSERT INTO auth_activity (
        login_id, device_id,
        ip_address, country, city, 
        latitude, longitude,
        activity_type, response
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        login_id,
        device_id,
        req.ip,
        locationInfo.country,
        locationInfo.city,
        locationInfo.latitude,
        locationInfo.longitude,
        'logout',
        'succeed'
      ]
    );

    // 5. Revoke tokens
    await db.promise().query(
      `UPDATE refresh_tokens 
       SET revoked_at = NOW(), 
           revoked_reason = 'MANUAL_LOGOUT' 
       WHERE login_id = ? 
       AND revoked_at IS NULL`,
      [login_id]
    );

    // 6. Clear cookies
    const cookieNames = Object.keys(req.cookies).filter(name => name.startsWith('rt_'));
    cookieNames.forEach(name => res.clearCookie(name));

    res.status(204).send();

  } catch (error) {
    console.error('Logout error:', error);
    
    // Attempt to record failed logout attempt
    try {
      await db.promise().query(
        `INSERT INTO auth_activity (login_id, activity_type, response)
         VALUES (?, 'logout', 'failed')`,
        [req.body.login_id]
      );
    } catch (innerError) {
      console.error('Failed to record logout failure:', innerError);
    }

    res.status(500).json({
      status: 'error',
      message: 'Logout failed. Please try again.'
    });
  }
});

export default router;