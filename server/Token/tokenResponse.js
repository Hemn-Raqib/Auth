import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import db from '../DB/db.js';
import { createToken, generateUniqueRefreshToken, generateUniqueTokenName } from '../Token/Token.js';
import { store } from '../data/Data.js';
import { reqData } from '../data/req.js';

export async function generateTokenResponse(user, deviceInfo, securityVerification, ipInfo) {
  const { login_id, username, email } = user;
  const tokenPayload = { login_id, username, email };
  const accessToken = await createToken(tokenPayload, process.env.TOKEN_SECRET_KEY, '15m');
  const refreshToken = await generateUniqueRefreshToken();
  const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
  const refreshTokenName = await generateUniqueTokenName();
  const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
  const familyId = uuidv4();

  try {
    await db.promise().query('START TRANSACTION');

    // Revoke existing refresh tokens
    await db.promise().query(
      `UPDATE refresh_tokens 
       SET revoked_at = NOW(), 
           revoked_reason = 'MANUAL_LOGOUT'
       WHERE login_id = ? 
       AND revoked_at IS NULL`,
      [login_id]
    );

    // Insert new refresh token
    await db.promise().query(
      `INSERT INTO refresh_tokens 
       (login_id, token, token_name, token_hash, expires_at, 
        ip_address, device_id, family_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        login_id,
        refreshToken,
        refreshTokenName,
        tokenHash,
        expiresAt,
        ipInfo.ip,
        securityVerification.deviceId,
        familyId
      ]
    );

    await db.promise().query(
      'UPDATE login SET last_login = CURRENT_TIMESTAMP WHERE login_id = ?',
      [login_id]
    );

    await db.promise().query('COMMIT');

    await store(login_id, securityVerification.deviceId, deviceInfo, 'login', 'succeed');
    await reqData(deviceInfo, 'login', 'login', username || "", email);

    return {
      refreshToken,
      refreshTokenName,
      accessToken,
      cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.SECURITY_SAMESITE || 'Strict',
        maxAge: 14 * 24 * 60 * 60 * 1000
      }
    };
  } catch (error) {
    await db.promise().query('ROLLBACK');
    throw error;
  }
}

export async function generateRefreshTokenResponse(tokenData, deviceInfo, securityVerification, ipInfo) {
  const tokenPayload = {
    login_id: tokenData.login_id,
    username: tokenData.username,
    first_login: tokenData.first_login,
    accountType: tokenData.accountType
  };

  const newAccessToken = await createToken(tokenPayload, process.env.TOKEN_SECRET_KEY, '15m');
  const newRefreshToken = await generateUniqueRefreshToken();
  const newTokenHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex');
  const newRefreshTokenName = await generateUniqueTokenName();
  const newExpiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
  const rotationWindowEnds = new Date(Date.now() + 60 * 1000); // 1 minute window

  try {
    await db.promise().query('START TRANSACTION');

    // Mark current token as rotated
    await db.promise().query(
      `UPDATE refresh_tokens 
       SET rotation_window_ends = ?
       WHERE token_id = ?`,
      [rotationWindowEnds, tokenData.token_id]
    );

    // Insert new refresh token
    await db.promise().query(
      `INSERT INTO refresh_tokens 
       (login_id, token, token_name, token_hash, device_id, ip_address, 
        expires_at, family_id, parent_token_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        tokenData.login_id,
        newRefreshToken,
        newRefreshTokenName,
        newTokenHash,
        securityVerification.deviceId,
        ipInfo.ip,
        newExpiresAt,
        tokenData.family_id || uuidv4(),
        tokenData.token_id
      ]
    );

    await store(
      tokenData.login_id,
      securityVerification.deviceId,
      deviceInfo,
      'refresh_token',
      'succeed'
    );

    await db.promise().query('COMMIT');
    await reqData(deviceInfo, 'refresh_token', 'refresh_token', tokenData.username, tokenData.email);

    return {
      refreshToken: newRefreshToken,
      refreshTokenName: newRefreshTokenName,
      accessToken: newAccessToken,
      cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.SECURITY_SAMESITE || 'Strict',
        maxAge: 14 * 24 * 60 * 60 * 1000
      }
    };
  } catch (error) {
    await db.promise().query('ROLLBACK');
    throw error;
  }
}