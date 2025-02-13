import db from '../DB/db.js';

class DeviceSecurityLayer {
  constructor() {
    this.deviceMatchThreshold = 0.8;
    this.locationRadius = 100;
}

  async verifyDeviceAndLocation(userId, deviceInfo, ipInfo, email) {
    try {
      const [devices] = await db.promise().query(
        'SELECT * FROM user_devices WHERE login_id = ? AND (status = "approved" OR is_main_device = TRUE)',
        [userId]
      );

      const [locationData] = await db.promise().query(
        `SELECT * FROM location 
         WHERE login_id = ? 
         ORDER BY timestamp DESC 
         LIMIT 5`,
        [userId]
      );

      let securityStatus = {
        deviceMatch: false,
        locationMatch: false,
        isMainDevice: false,
        deviceId: null,
        verificationNeeded: false,
        verificationReason: null
      };

      // First check device verification
      if (devices.length === 0) {
        securityStatus.verificationNeeded = true;
        securityStatus.verificationReason = 'no_device_found';
      } else {
        const matchingDevice = await this.findMatchingDevice(devices, deviceInfo);
        
        if (matchingDevice) {
          securityStatus.deviceMatch = true;
          securityStatus.deviceId = matchingDevice.device_id;
          securityStatus.isMainDevice = matchingDevice.is_main_device;
          
          if (!matchingDevice.is_main_device && matchingDevice.status !== 'approved') {
            securityStatus.verificationNeeded = true;
            securityStatus.verificationReason = 'device_mismatch';
          }
        } else {
          securityStatus.verificationNeeded = true;
          securityStatus.verificationReason = 'unauthorized_device';
        }
      }

      // Then check location verification
      const isLocationValid = await this.validateLocation(locationData, ipInfo);
      if (!isLocationValid) {
        if (securityStatus.verificationNeeded) {
          // If both device and location verification failed
          securityStatus.verificationReason = 'new_device_and_location';
        } else {
          securityStatus.verificationNeeded = true;
          securityStatus.verificationReason = 'suspicious_location';
        } 
      } else {
        securityStatus.locationMatch = true;
      }

      // Return final security status
      if (securityStatus.verificationNeeded) {
        return {
          isValid: false,
          error: securityStatus.verificationReason,
          reqData: securityStatus.verificationReason,
          deviceId: securityStatus.deviceId
        };
      }

      return {
        isValid: true,
        deviceId: securityStatus.deviceId,
        isMainDevice: securityStatus.isMainDevice
      };

    } catch (error) {
      console.error('Device verification error:', error);
      await reqData(deviceInfo, 'device_verification_error', 'failed_login', "", email, "");
      throw new Error('Security check failed');
    }
  }

  async validateLocation(locationData, locationInfo) {
    if (locationData.length === 0) return true;
    
    if (!locationInfo || !locationInfo.latitude || !locationInfo.longitude) {
      return false;
    }

    for (const location of locationData) {
      if (location.latitude && location.longitude) {
        const distance = this.calculateDistance(
          parseFloat(location.latitude),
          parseFloat(location.longitude),
          parseFloat(locationInfo.latitude),
          parseFloat(locationInfo.longitude)
        );
        if (distance <= this.locationRadius) return true;
      }
    }
    return false;
  }

  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  toRad(degrees) {
    return degrees * (Math.PI / 180);
  }

  async findMatchingDevice(devices, incomingDevice) {
    const flattenedDevice = {
      browser_name: incomingDevice.browserInfo?.browserName || '',
      browser_version: incomingDevice.browserInfo?.browserVersion || '',
      device_type: incomingDevice.deviceInfo?.deviceType || '',
      device_vendor: incomingDevice.deviceInfo?.deviceVendor || '',
      device_model: incomingDevice.deviceInfo?.deviceModel || '',
      extended_device_name: incomingDevice.deviceInfo?.deviceName || '',
      os_name: incomingDevice.deviceInfo?.osName || '',
      os_version: incomingDevice.deviceInfo?.osVersion || '',
      screen_width: incomingDevice.screenInfo?.screenWidth || null,
      screen_height: incomingDevice.screenInfo?.screenHeight || null,
      device_identifier: incomingDevice.deviceId || ''
    };

    let bestMatchDevice = null;
    let bestMatchScore = 0;

    for (const device of devices) {
      const matchScore = this.calculateDeviceMatchScore(device, flattenedDevice);
      
      if (device.device_identifier === flattenedDevice.device_identifier && matchScore >= this.deviceMatchThreshold) {
        if (matchScore > bestMatchScore) {
          bestMatchScore = matchScore;
          bestMatchDevice = device;
        }
      }
    }

    if (!bestMatchDevice) {
      for (const device of devices) {
        const matchScore = this.calculateDeviceMatchScore(device, flattenedDevice);
        if (matchScore >= this.deviceMatchThreshold && matchScore > bestMatchScore) {
          bestMatchScore = matchScore;
          bestMatchDevice = device;
        }
      }
    }

    return bestMatchDevice;
  }

  calculateDeviceMatchScore(storedDevice, incomingDevice) {
    let matchPoints = 0;
    let totalPoints = 0;

    const fieldsToCompare = [
      { field: 'browser_name', weight: 2 },
      { field: 'browser_version', weight: 1 },
      { field: 'device_type', weight: 2 },
      { field: 'extended_device_name', weight: 2 },
      { field: 'os_name', weight: 2 },
      { field: 'os_version', weight: 1 }
    ];

    for (const { field, weight } of fieldsToCompare) {
      const storedValue = storedDevice[field]?.toString().toLowerCase() || '';
      const incomingValue = incomingDevice[field]?.toString().toLowerCase() || '';
      
      if (storedValue && incomingValue) {
        totalPoints += weight;
        if (storedValue === incomingValue) {
          matchPoints += weight;
        }
      }
    }

    return totalPoints > 0 ? matchPoints / totalPoints : 0;
  }
}

export default new DeviceSecurityLayer();