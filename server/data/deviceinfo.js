// deviceService.js
import {UAParser} from 'ua-parser-js';
import crypto from 'crypto';

const validateDeviceData = (data) => {
  // Validate browser info
  if (!data.browserInfo?.browserName || !data.browserInfo?.browserVersion) {
    throw new Error('Invalid browser information');
  }

  // Validate device info
  if (!data.deviceInfo?.deviceType || !data.deviceInfo?.osName) {
    throw new Error('Invalid device information');
  }

  // Validate capabilities
  if (!data.capabilities?.language || !data.capabilities?.platform) {
    throw new Error('Invalid capabilities information');
  }

  // Validate fingerprint
  if (!data.fingerprint || data.fingerprint.length < 32) {
    throw new Error('Invalid device fingerprint');
  }

  return true;
};

export const collectDeviceInfo = async (req) => {
  try {
    // Validate required headers
    const requiredHeaders = ['user-agent', 'accept-language', 'accept-encoding'];
    const missingHeaders = requiredHeaders.filter(header => !req.headers[header]);
    
    if (missingHeaders.length > 0) {
      throw new Error(`Missing required headers: ${missingHeaders.join(', ')}`);
    }

    const userAgent = req.headers['user-agent'];
    const acceptLanguage = req.headers['accept-language'];
    const acceptEncoding = req.headers['accept-encoding'];
    const connection = req.headers['connection'];
    const platform = req.headers['sec-ch-ua-platform'];
    const mobile = req.headers['sec-ch-ua-mobile'];
    
    // Parse user agent
    const uaParser = new UAParser(userAgent);
    const uaResult = uaParser.getResult();

    // Validate parsed UA result
    if (!uaResult.browser || !uaResult.os) {
      throw new Error('Failed to parse user agent information');
    }

    // Generate device fingerprint
    const fingerprintData = [
      userAgent,
      acceptLanguage,
      acceptEncoding,
      connection,
      platform,
      mobile,
      req.ip || req.connection?.remoteAddress
    ].join('|');
    
    const fingerprint = crypto
      .createHash('sha256')
      .update(fingerprintData)
      .digest('hex');

    const browserInfo = {
      browserName: uaResult.browser.name,
      browserVersion: uaResult.browser.version,
      engineName: uaResult.engine.name,
      engineVersion: uaResult.engine.version,
    };

    const getExtendedDeviceName = () => {
      const deviceVendor = uaResult.device.vendor || '';
      const deviceModel = uaResult.device.model || '';
      const osName = uaResult.os.name || '';
      const userAgentLower = userAgent.toLowerCase();

      const manufacturers = {
        'lenovo': /lenovo/i,
        'dell': /dell/i,
        'hp': /hp|hewlett[-\s]packard/i,
        'asus': /asus/i,
        'acer': /acer/i,
        'msi': /msi/i,
        'toshiba': /toshiba/i,
        'microsoft': /microsoft/i
      };

      if (userAgentLower.includes('macintosh') || userAgentLower.includes('mac os x')) {
        const macModels = {
          'MacBook Air': /macbook air/i,
          'MacBook Pro': /macbook pro/i,
          'iMac': /imac/i,
          'Mac Pro': /mac pro/i,
          'Mac mini': /mac mini/i
        };

        for (const [model, regex] of Object.entries(macModels)) {
          if (regex.test(userAgentLower)) return model;
        }
        return 'Mac';
      }

      for (const [manufacturer, regex] of Object.entries(manufacturers)) {
        if (regex.test(userAgentLower)) {
          return `${manufacturer.charAt(0).toUpperCase() + manufacturer.slice(1)} PC`;
        }
      }

      if (deviceVendor && deviceModel) {
        return `${deviceVendor} ${deviceModel}`.trim();
      }

      return osName ? `${osName} Device` : 'Unknown Device';
    };

    const deviceInfo = {
      deviceType: uaResult.device.type || 'desktop',
      deviceVendor: uaResult.device.vendor,
      deviceModel: uaResult.device.model,
      osName: uaResult.os.name,
      osVersion: uaResult.os.version,
      deviceName: getExtendedDeviceName()
    };

    const capabilities = {
      language: acceptLanguage?.split(',')[0],
      languages: acceptLanguage?.split(',').map(lang => lang.split(';')[0]),
      isMobile: mobile === '?1' || /mobile|android|iphone|ipad|ipod/i.test(userAgent),
      platform: platform?.replace(/"/g, '') || uaResult.os.name
    };

    if (req.headers['sec-ch-ua-platform-version']) {
      capabilities.platformVersion = req.headers['sec-ch-ua-platform-version'];
    }
    if (req.headers['sec-ch-ua-arch']) {
      capabilities.architecture = req.headers['sec-ch-ua-arch'];
    }
    if (req.headers['sec-ch-ua-bitness']) {
      capabilities.bitness = req.headers['sec-ch-ua-bitness'];
    }

    const deviceData = {
      browserInfo,
      deviceInfo,
      capabilities,
      deviceId: fingerprint,
      fingerprint,
      headers: {
        acceptLanguage,
        acceptEncoding,
        connection,
        platform,
        mobile
      },
      timestamp: new Date().toISOString()
    };

    // Validate the collected data
    validateDeviceData(deviceData);

    return deviceData;

  } catch (error) {
    console.error('Error collecting device information:', error);
    return null; // Return null to indicate failure
  }
};

export const compareDeviceFingerprints = (fingerprint1, fingerprint2) => {
  if (!fingerprint1 || !fingerprint2) return 0;
  
  let similarity = 0;
  const length = Math.min(fingerprint1.length, fingerprint2.length);
  
  for (let i = 0; i < length; i++) {
    if (fingerprint1[i] === fingerprint2[i]) {
      similarity++;
    }
  }
  
  return similarity / length;
};