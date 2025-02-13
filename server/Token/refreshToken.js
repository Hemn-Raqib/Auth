import express from 'express';
import db from '../DB/db.js';
import { getLocationInfo } from '../data/locationinfo.js';
import { collectDeviceInfo } from '../data/deviceinfo.js';
import { reqData } from '../data/req.js';
import deviceSecurity from '../Register/DeviceSecurityLayer.js';
import { generateRefreshTokenResponse } from './tokenResponse.js';

const router = express.Router();

async function revokeTokenFamily(familyId, reason) {
  await db.promise().query(
    'UPDATE refresh_tokens SET revoked_at = NOW(), revoked_reason = ? WHERE family_id = ? AND revoked_at IS NULL',
    [reason, familyId]
  );
}

async function checkTokenReuse(token, familyId) {
  const [laterTokens] = await db.promise().query(
    `SELECT token_id FROM refresh_tokens 
     WHERE family_id = ? 
     AND issued_at > (SELECT issued_at FROM refresh_tokens WHERE token_id = ?)
     AND revoked_at IS NULL`,
    [familyId, token.token_id]
  );
  return laterTokens.length > 0;
}

router.post('/', async (req, res) => {
  const locationInfo = await getLocationInfo(req);
  const deviceInfooo = await collectDeviceInfo(req);
  
  if(!locationInfo || !deviceInfooo) {
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
  
  const ipInfo = deviceInfo?.locationInfo;

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

  try {
    const allCookies = req.cookies;
    let currentToken, currentTokenName, tokenData;

    // Find valid refresh token from cookies
    for (const [name, value] of Object.entries(allCookies)) {
      const [tokens] = await db.promise().query(
        `SELECT rt.*, l.username, l.email
         FROM refresh_tokens rt
         JOIN login l ON rt.login_id = l.login_id
         WHERE rt.token = ? 
         AND rt.token_name = ? 
         AND rt.revoked_at IS NULL 
         AND rt.expires_at > NOW()`,
        [value, name]
      );

      if (tokens.length > 0) {
        currentToken = value;
        currentTokenName = name;
        tokenData = tokens[0];
        break;
      }
    }

    if (!currentToken || !currentTokenName || !tokenData) {
      await reqData(deviceInfo, 'no_refresh_token', 'refresh_token_failed', "", "");
      return res.status(401).json({
        status: 'error',
        code: 'INVALID_TOKEN',
        message: 'No valid refresh token found'
      });
    }

    // Check for token reuse
    const isTokenReused = await checkTokenReuse(tokenData, tokenData.family_id);
    if (isTokenReused) {
      await revokeTokenFamily(tokenData.family_id, 'TOKEN_REUSE');
      await reqData(deviceInfo, 'token_reuse', 'refresh_token_failed', tokenData.username, tokenData.email);
      res.clearCookie(currentTokenName);
      return res.status(401).json({
        status: 'error',
        code: 'TOKEN_REUSE',
        message: 'Security breach detected. Please log in again.'
      });
    }

    // Verify device and location
    const securityVerification = await deviceSecurity.verifyDeviceAndLocation(
      tokenData.login_id,
      deviceInfo,
      ipInfo,
      tokenData.email
    );

    if (!securityVerification.isValid) {
      await reqData(deviceInfo, securityVerification.reqData, 'refresh_token_failed', tokenData.username, tokenData.email);
      return res.status(403).json({
        status: 'error',
        code: 'SECURITY_CHECK_FAILED',
        message: securityVerification.error,
        requiresVerification: true,
        verificationReason: securityVerification.reqData
      });
    }

    // Generate new tokens
    const tokenResponse = await generateRefreshTokenResponse(tokenData, deviceInfo, securityVerification, ipInfo);

    // Set new cookie and clear old one
    res.cookie(tokenResponse.refreshTokenName, tokenResponse.refreshToken, tokenResponse.cookieOptions);
    res.clearCookie(currentTokenName);

    return res.status(200).json({ 
      status: 'success',
      code: 'TOKEN_REFRESHED',
      message: 'Token successfully refreshed',
      data: {
        accessToken: tokenResponse.accessToken
      }
    });

  } catch (error) {
    console.error('Refresh token error:', error);
    await reqData(deviceInfo, 'refresh_token_error', 'refresh_token_failed', "", "");
    return res.status(500).json({
      status: 'error',
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;