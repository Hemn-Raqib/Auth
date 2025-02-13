import express from 'express';
import db from '../DB/db.js';

const router = express.Router();


// Terminate device
router.delete('/devices/:deviceId', async (req, res) => {
    const { deviceId } = req.params; 
    
    try {
      // First verify that the device belongs to the authenticated user
      const [device] = await db.promise().query(
        'SELECT login_id FROM user_devices WHERE device_id = ?',
        [deviceId]
      );
  
      if (device.length === 0) {
        return res.status(404).json({
          status: 'error',
          code: 'DEVICE_NOT_FOUND',
          message: 'Device not found'
        });
      }
  
      // Delete the device
      await db.promise().query(
        'DELETE FROM user_devices WHERE device_id = ?',
        [deviceId]
      );
  
      return res.status(200).json({
        status: 'success',
        code: 'DEVICE_TERMINATED',
        message: 'Device has been terminated successfully'
      });
  
    } catch (error) {
      console.error('Device termination error:', error);
      return res.status(500).json({
        status: 'error',
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });



  export default router;