import express from 'express';
import bcrypt from 'bcrypt';
import db from '../DB/db.js';
import Fingerprint from 'express-fingerprint';
import rateLimit from 'express-rate-limit';
import { Validation3 } from '../formatvalidation/registerValidation.js';
import { validationResult } from 'express-validator';
import { getLocationInfo } from '../data/locationinfo.js';
import { collectDeviceInfo } from '../data/deviceinfo.js';
import { sendLoginNotification } from './emailService.js';
import deviceSecurity from './DeviceSecurityLayer.js';
import { generateVerificationCode } from '../Token/Token.js';
import { reqData } from '../data/req.js';
import { generateTokenResponse } from '../Token/tokenResponse.js';

const router = express.Router();
router.use(Fingerprint());

export const determineActivityType = async (verificationData) => {
  if (verificationData === 'new_device_and_location') {
    return 'full_verification';
  }
  return verificationData.includes('device') ? 'device_verification' : 'location_verification';
};

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts, please try again later',
  trustProxy: process.env.NODE_ENV === 'production',
  keyGenerator: (req) => {
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || 
               req.socket.remoteAddress;
    return ip;
  }
});

router.use(loginLimiter);

router.post('/', Validation3, async (req, res) => {
  console.log(`✅✅✅ login router ✅✅✅`);

  // Set security headers
  res.set({
    'Pragma': 'no-cache',
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Expires': '0',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block'
  });

  const { email, password } = req.body;
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
    await reqData(deviceInfo, 'validation_error', 'failed_login', "", email);
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
      await reqData(deviceInfo, 'invalid_email', 'failed_login', "", email);
      return res.status(401).json({
        status: 'error',
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password'
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

      if (user.failed_attempts >= 4) {
        await db.promise().query(
          'UPDATE login SET is_locked = TRUE, locked_until = DATE_ADD(NOW(), INTERVAL 30 MINUTE) WHERE login_id = ?',
          [user.login_id]
        );
        await reqData(deviceInfo, 'account_locked', 'failed_login', "", email);
        return res.status(401).json({
          status: 'error',
          code: 'ACCOUNT_LOCKED',
          message: 'Account temporarily locked due to too many failed attempts'
        });
      }
      
      await sendLoginNotification(email, deviceInfo, false, 'password did not match');
      console.log(`@@@@password ❌@@@@`);
      await reqData(deviceInfo, 'invalid_password', 'failed_login', "", email);
      return res.status(401).json({
        status: 'error',
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password'
      });
    }

    await db.promise().query(
      'UPDATE login SET failed_attempts = 0 WHERE login_id = ?',
      [user.login_id]
    );
    
    if (!securityVerification.isValid) {
      const verificationCode = await generateVerificationCode();
      const activityType = await determineActivityType(securityVerification.error);
      
      await sendLoginNotification(email, deviceInfo, false, activityType, verificationCode);
      await reqData(deviceInfo, securityVerification.reqData, 'failed_login', "", email);

      return res.status(403).json({
        status: 'error',
        code: 'VERIFICATION_REQUIRED',
        message: securityVerification.error,
        requiresVerification: true,
        verificationReason: securityVerification.reqData
      });
    }

    const tokenResponse = await generateTokenResponse(user, deviceInfo, securityVerification, ipInfo);
    
    res.cookie(tokenResponse.refreshTokenName, tokenResponse.refreshToken, tokenResponse.cookieOptions);

    await sendLoginNotification(email, deviceInfo, true);
    console.log(`@@@@login ✅@@@@`);

    return res.status(200).json({
      status: 'success',
      code: 'LOGIN_SUCCESS',
      data: {
        requiresVerification: false,
        accessToken: tokenResponse.accessToken
      }
    });

  } catch (error) {
    console.log(`@@@@login_error ❌@@@@`);
    await reqData(deviceInfo, 'login_error', 'failed_login', "", email);
    console.error('Login error:', error);
    return res.status(500).json({
      status: 'error',
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;