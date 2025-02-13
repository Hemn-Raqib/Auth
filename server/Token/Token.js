import jwt from 'jsonwebtoken';
import db from '../DB/db.js';
import crypto from 'crypto';






export const createToken = async (payload, secret, expiresIn) => {
    return jwt.sign(payload, secret, { expiresIn });
  };
  
  
  export const generateUniqueRefreshToken = async () => {
    while (true) {
      const refreshToken = crypto.randomBytes(40).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
      
      // Check if token hash already exists
      const [existingTokens] = await db.promise().query(
        'SELECT token_id FROM refresh_tokens WHERE token_hash = ?',
        [tokenHash]
      );
      
      if (existingTokens.length === 0) {
        return  refreshToken ;
      }
    }
  };
  
  export const generateUniqueTokenName = async () => {
    while (true) {
      const tokenName = `${crypto.randomBytes(32).toString('base64url')}`;
      
      // Check if token name already exists
      const [existingNames] = await db.promise().query(
        'SELECT token_id FROM refresh_tokens WHERE token_name = ?',
        [tokenName]
      );
      
      if (existingNames.length === 0) {
        return tokenName;
      }
    }
  };
  
  
  
  
  export const generateVerificationCode = async () => {
    while (true) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const [existingCodes] = await db.promise().query(
        'SELECT id FROM codes WHERE verification_code = ? AND code_type = "login" AND used = 0',
        [code]
      );
      
      if (existingCodes.length === 0) {
        const expiryTime = new Date(Date.now() + 10 * 60 * 1000);
        await db.promise().query(
          'INSERT INTO codes (verification_code, code_type, expiry_time) VALUES (?, "login", ?)',
          [code, expiryTime]
        );
        return code;
      }
    }
  };
  
  
  
  
  export const verifyLoginCode = async (code, email) => {
    const [codes] = await db.promise().query(
      `SELECT * FROM codes 
       WHERE verification_code = ? 
       AND code_type = "login" 
       AND used = 0 
       AND expiry_time > CURRENT_TIMESTAMP`,
      [code]
    );
  
    if (codes.length === 0) {
      return { isValid: false, error: 'Invalid or expired verification code' };
    }
  
    await db.promise().query(
      'UPDATE codes SET used = 1 WHERE id = ?',
      [codes[0].id]
    );
  
    return { isValid: true };
  };
  