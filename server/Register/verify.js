import express from 'express';
import bcrypt from 'bcrypt';
import db from '../DB/db.js';
import Fingerprint from 'express-fingerprint';
import deviceSecurity from './DeviceSecurityLayer.js';
import {  Validation4 } from '../formatvalidation/registerValidation.js';
import { reqData } from '../data/req.js';
import { validationResult } from 'express-validator';
import { sendVerificationSuccessEmail } from '../Register/emailService.js';
import { storeDeviceInformation } from '../data/DataStoring.js';
import { store } from '../data/Data.js';
import { verifyLoginCode} from '../Token/Token.js'
import { collectDeviceInfo } from '../data/deviceinfo.js';
import { getLocationInfo } from '../data/locationinfo.js';
import {determineActivityType} from './Login.js';

const router = express.Router();
router.use(Fingerprint());



router.post('/', Validation4, async (req, res) => {
  console.log(`✅✅✅ login authentication router ✅✅✅`);
  const { email, password, verificationCode } = req.body;
  
  const locationInfo = await getLocationInfo(req);
      const deviceInfooo = await collectDeviceInfo(req);
    
      if(!locationInfo || !deviceInfooo){
        return res.status(400).json({ 
          status: 'error',
          code: 'VALIDATION_ERROR',
          message: 'Unable to verify device information'
        });
      }
      const deviceInfo = {
        deviceId: deviceInfooo.fingerprint, 
        browserInfo: deviceInfooo.browserInfo,
        deviceInfo: deviceInfooo.deviceInfo,
        locationInfo: locationInfo 
      };
  const ipInfo = deviceInfo.locationInfo;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(`@@@@invalid data formats ❌@@@@`);
    await reqData(deviceInfo, 'validation_error', 'verification', "", email);
    return res.status(400).json({
      status: 'error',
      code: 'VALIDATION_ERROR',
      message: 'Invalid input data',
      errors: errors.array()
    });
  }

  try {
    const [users] = await db.promise().query('SELECT * FROM login WHERE email = ?', [email]);

    if (users.length === 0) {
      console.log(`@@@@email ❌@@@@`);
      await reqData(deviceInfo, 'invalid_email', 'verification', "", email);
      return res.status(401).json({
        status: 'error',
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password',
        remainingAttempts: 5 - (user.failed_attempts + 1)
      });
    }
    
    const user = users[0];
    const { login_id } = user;
    const isMatch = await bcrypt.compare(password, user.password);
    const securityVerification = await deviceSecurity.verifyDeviceAndLocation(
      user.login_id, 
      deviceInfo,
      ipInfo,
      email
    );
    
    if (!isMatch) {
      await db.promise().query(
        'UPDATE login SET failed_attempts = failed_attempts + 1 WHERE login_id = ?',
        [user.login_id]
      );
      console.log(`@@@@password ❌@@@@`);
      await reqData(deviceInfo, 'invalid_password', 'verification', "", email);
      return res.status(401).json({
        status: 'error',
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password',
        remainingAttempts: 5 - (user.failed_attempts + 1)
      });
    }

    await db.promise().query(
      'UPDATE login SET failed_attempts = 0 WHERE login_id = ?',
      [user.login_id]
    );

    const [existingDevice] = await db.promise().query(
      'SELECT device_id FROM user_devices WHERE login_id = ? AND device_identifier = ?',
      [user.login_id, deviceInfo.deviceId]
    );
    
    let deviceId = existingDevice[0]?.device_id || securityVerification.deviceId;

    const codeVerification = await verifyLoginCode(verificationCode, email);
    if (!codeVerification.isValid) {
      await reqData(deviceInfo, 'invalid_code', 'verification', "", email);
      const activityType = determineActivityType(securityVerification.reqData);
      await store(login_id, deviceId, deviceInfo, activityType, 'failed');

      return res.status(403).json({
        status: 'error',
        code: 'INVALID_VERIFICATION',
        message: codeVerification.error,
        requiresVerification: true,
        verificationReason: securityVerification.reqData
      });
    }
    if (!securityVerification.isValid) {
      const verificationNeeded = securityVerification.reqData;
      
      if (verificationNeeded === 'new_device_and_location') {
        deviceId = await storeDeviceInformation(user.login_id, deviceInfo, false, true, true);
      } else if (verificationNeeded === 'suspicious_location') {
        deviceId = await storeDeviceInformation(user.login_id, deviceInfo, false, true, false);
      }else if(verificationNeeded === 'device_mismatch' || verificationNeeded === 'no_device_found' || verificationNeeded === 'unauthorized_device'){
        deviceId = await storeDeviceInformation(user.login_id, deviceInfo, false, false, true);
      }
      
    }

    if (!deviceId) {
      throw new Error('Failed to obtain device ID');
    }


    const activityType = await determineActivityType(securityVerification.reqData);
    console.log(activityType);
  await store(login_id, deviceId, deviceInfo, activityType, 'succeed');
  await sendVerificationSuccessEmail(email, deviceInfo, activityType);

    console.log(`@@@@login authentication ✅@@@@`);
    await reqData(deviceInfo, 'verification', 'verification', "", email);
    
    return res.status(200).json({
      status: 'success',
      code: 'AUTH_VERIFIED',
      message: 'Authentication successful',
      data: {
        verified: true,
        verificationReason: securityVerification.reqData
      }
    });

  } catch (error) {
    console.log(`@@@@login_authentication_error ❌@@@@`);
    await reqData(deviceInfo, 'verification_error', 'verification', "", email, "");
    console.error('Login authentication error:', error);
    return res.status(500).json({
      status: 'error',
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;