import express from 'express';
import { sendVerificationCodeforSignup, sendWelcomeEmail } from './emailService.js';
import bcrypt from 'bcrypt';
import db from '../DB/db.js';
import { validationResult } from 'express-validator';
import { Validation1, Validation2 } from '../formatvalidation/registerValidation.js';
import {storeDeviceInformation} from '../data/DataStoring.js'
import { reqData } from '../data/req.js';
import { getLocationInfo } from '../data/locationinfo.js';
import { collectDeviceInfo } from '../data/deviceinfo.js';
const router = express.Router();

async function isUsernameTaken(username) {
  const [results] = await db.promise().query(
    'SELECT COUNT(*) AS count FROM login WHERE username = ?',
    [username]
  );
  return results[0].count > 0;
}

async function isEmailTaken(email) {
  const [results] = await db.promise().query(
    'SELECT COUNT(*) AS count FROM login WHERE email = ?',
    [email]
  );
  return results[0].count > 0;
}

async function isCodeAlreadyUsed(code, codeType = 'signup') {
  const [results] = await db.promise().query(
    'SELECT COUNT(*) AS count FROM codes WHERE verification_code = ? AND code_type = ?',
    [code, codeType]
  );
  
  return results[0].count > 0;
}

async function generateUniqueVerificationCode(codeType = 'signup') {
  let isUnique = false;
  let code;
  
  while (!isUnique) {
    code = Math.floor(100000 + Math.random() * 900000).toString();
    const isUsed = await isCodeAlreadyUsed(code, codeType);
    isUnique = !isUsed;
  }
  
  return code;
}

router.post('/', Validation1, async (req, res) => {
  console.log(`✅✅✅ signup router ✅✅✅`);
  const { email, username, password } = req.body;

  
  
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

  console.log(locationInfo);
  

  try {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(`@@@@invalid data formats ❌@@@@`);
      await reqData(deviceInfo, 'error', 'signup_code', username, email);
      return res.status(400).json({ 
        status: 'error',
        message: 'Validation failed',
        details: errors.array(),
        code: 'VALIDATION_ERROR'
      });
    }
    console.log(`@@@@valid data formats ✅@@@@`);

    

    try {
      const [emailExists, usernameExists] = await Promise.all([
        isEmailTaken(email),
        isUsernameTaken(username)
      ]);

      if (emailExists) {
        console.log(`@@@@email ❌@@@@`);
        await reqData(deviceInfo, 'email_exist', 'signup_code', username, email);
        await db.promise().rollback();
        return res.status(409).json({ 
          status: 'error',
          message: 'Email already exists',
          code: 'EMAIL_EXISTS'
        });
      }
      console.log(`@@@@email ✅@@@@`);

      if (usernameExists) {
        console.log(`@@@@username ❌@@@@`);
        await reqData(deviceInfo, 'username_exist', 'signup_code', username, email);
        await db.promise().rollback();
        return res.status(409).json({ 
          status: 'error',
          message: 'Username already exists',
          code: 'USERNAME_EXISTS'
        });
      }
      console.log(`@@@@username ✅@@@@`);





      const code = await generateUniqueVerificationCode('signup');
      const expiryTime = new Date(Date.now() + 10 * 60000); // 10 minutes

      // Only store in codes table initially
      await db.promise().query(
        'INSERT INTO codes (verification_code, code_type, expiry_time) VALUES (?, ?, ?)',
        [code, 'signup', expiryTime]
      );

     await reqData(deviceInfo, 'signup_code', 'signup_code', username, email);
      await sendVerificationCodeforSignup(email, code);
      await db.promise().commit();
      console.log(`@@@@send-code ✅@@@@`);
      res.status(200).json({ 
        status: 'success',
        message: 'Verification code sent successfully',
        code: 'CODE_SENT'
      });

    } catch (error) {
      await db.promise().rollback();
      throw error;
    }
  } catch (error) {
    console.log(`@@@@send-code-error ❌@@@@`);
    console.error('Error in send-code:', error);
    await reqData(deviceInfo, 'signup_code_error', 'signup_code', username, email);
    res.status(500).json({ 
      status: 'error',
      message: 'Internal server error',
      code: 'INTERNAL_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

















router.post('/verify', Validation2, async (req, res) => {
  console.log(`✅✅✅ send-verify router ✅✅✅`);

const { username, email, password, verificationCode } = req.body;
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
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(`@@@@invalid data formats ❌@@@@`);
      await reqData(deviceInfo, 'error', 'signup', username, email);
      return res.status(400).json({ 
        status: 'error',
        message: 'Validation failed',
        details: errors.array(),
        code: 'VALIDATION_ERROR'
      });
    }
    console.log(`@@@@valid data formats ✅@@@@`);


    await db.promise().beginTransaction();

    try {
      const [emailExists, usernameExists] = await Promise.all([
        isEmailTaken(email),
        isUsernameTaken(username)
      ]);

      if (emailExists) {
        console.log(`@@@@email ❌@@@@`);
        await db.promise().rollback();
        await reqData(deviceInfo, 'email_exist', 'signup', username, email);
        return res.status(409).json({ 
          status: 'error',
          message: 'Email already exists',
          code: 'EMAIL_EXISTS'
        });
      }
      console.log(`@@@@email ✅@@@@`);

      if (usernameExists) {
        console.log(`@@@@username ❌@@@@`);
        await db.promise().rollback();
        await reqData(deviceInfo, 'username_exist', 'signup', username, email);
        return res.status(409).json({ 
          status: 'error',
          message: 'Username already exists',
          code: 'USERNAME_EXISTS'
        });
      }
      console.log(`@@@@username ✅@@@@`);

      // Check if code exists and is valid in codes table
      const [codeResult] = await db.promise().query(
        'SELECT * FROM codes WHERE verification_code = ? AND code_type = ? AND expiry_time > NOW() AND used = FALSE',
        [verificationCode, 'signup']
      );

      if (codeResult.length === 0) {
        console.log(`@@@@code-invalid ❌@@@@`);
        await db.promise().rollback();
        await reqData(deviceInfo, 'invalid_code', 'signup', username, email);
        return res.status(400).json({ 
          status: 'error',
          message: 'Invalid or expired verification code',
          code: 'INVALID_CODE'
        });
      }
      console.log(`@@@@code-valid ✅@@@@`);

      const hashedPassword = await bcrypt.hash(password.toString(), 10);

      // Insert new user
      const [userResult] = await db.promise().query(
        'INSERT INTO login (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword]
      );

      // Now store in two_factor_auth and mark code as used
      await Promise.all([
        db.promise().query(
          'INSERT INTO two_factor_auth (login_id, email, verification_code, expiry_time, verified) VALUES (?, ?, ?, ?, TRUE)',
          [userResult.insertId, email, verificationCode, codeResult[0].expiry_time]
        ),
        db.promise().query(
          'UPDATE codes SET used = TRUE WHERE verification_code = ? AND code_type = ?',
          [verificationCode, 'signup']
        )
      ]);


      await storeDeviceInformation(userResult.insertId, deviceInfo, 1, true, true);
      await reqData(deviceInfo, 'signup', 'signup', username, email);
      await db.promise().commit();
      sendWelcomeEmail(email, username);
      console.log(`@@@@verify ✅@@@@`);
      res.status(201).json({ 
        status: 'success',
        message: 'Registration completed successfully',
        code: 'REGISTRATION_SUCCESS'
      });

    } catch (error) {
      await db.promise().rollback();
      throw error; 
    }
  } catch (error) {
    console.log(`@@@@verify-error ❌@@@@`);
    console.error('Error in verify:', error);
    await reqData(deviceInfo, 'signup_error', 'signup', username, email);
    res.status(500).json({ 
      status: 'error',
      message: 'Internal server error',
      code: 'INTERNAL_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;