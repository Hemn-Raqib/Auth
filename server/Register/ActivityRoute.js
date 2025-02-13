import express from 'express';
import db from '../DB/db.js';

const router = express.Router();

router.get('/:login_id', async (req, res) => {
  const { login_id } = req.params;
  
  try {
    // Get trusted devices with their locations using JOIN
    const [devicesWithLocations] = await db.promise().query(
      `SELECT 
        ud.device_id,
        ud.device_type,
        ud.extended_device_name,
        ud.browser_name,
        ud.os_name,
        ud.status,
        ud.last_used,
        l.country,
        l.city,
        l.latitude,
        l.longitude,
        l.timestamp as trusted_since
      FROM user_devices ud
      LEFT JOIN location l ON ud.device_id = l.device_id
      WHERE ud.login_id = ? 
      AND ud.status = 'approved'
      ORDER BY ud.last_used DESC`,
      [login_id]
    );

    // Get recent activity
    const [activities] = await db.promise().query(
      `SELECT 
        a.activity_id,
        a.activity_type,
        a.response,
        a.ip_address,
        a.country,
        a.city,
        a.latitude,
        a.longitude,
        a.timestamp,
        ud.device_type,
        ud.device_model
      FROM auth_activity a
      LEFT JOIN user_devices ud ON a.device_id = ud.device_id
      WHERE a.login_id = ?
      ORDER BY a.timestamp DESC
      LIMIT 20`,
      [login_id]
    );

    return res.status(200).json({
      status: 'success',
      code: 'ACTIVITY_RETRIEVED',
      data: {
        devices: devicesWithLocations.map(device => ({
          deviceId: device.device_id,
          type: device.device_type,
          name: device.extended_device_name,
          browser: device.browser_name,
          os: device.os_name,
          lastUsed: device.last_used,
          location: {
            country: device.country,
            city: device.city,
            coordinates: {
              latitude: device.latitude,
              longitude: device.longitude
            }
          },
          trustedSince: device.trusted_since
        })),
        recentActivity: activities.map(activity => ({
          id: activity.activity_id,
          type: activity.activity_type,
          status: activity.response,
          location: {
            ip: activity.ip_address,
            country: activity.country,
            city: activity.city,
            coordinates: {
              latitude: activity.latitude,
              longitude: activity.longitude
            }
          },
          deviceName: activity.device_type ? `${activity.device_type} ${activity.device_model}` : 'Unknown Device',
          timestamp: activity.timestamp
        }))
      }
    });

  } catch (error) {
    console.error('Activity retrieval error:', error);
    return res.status(500).json({
      status: 'error',
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;