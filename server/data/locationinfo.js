import axios from 'axios';
import { getClientIp } from '../middleware/rateLimiter.js';
const axiosInstance = axios.create({
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

const validateIpInfoData = (data) => {
  const requiredFields = ['ip', 'city', 'region', 'loc'];
  const missingFields = requiredFields.filter(field => {
    const value = data[field];
    return !value || (typeof value === 'string' && !value.trim());
  });

  if (missingFields.length) throw new Error(`Missing data: ${missingFields.join(', ')}`);
  if (!data.loc?.includes(',')) throw new Error('Invalid coordinates format');

  const [lat, lon] = data.loc.split(',');
  if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
    throw new Error('Invalid coordinates');
  }
  return true;
};


const getDetailedLocation = async (latitude, longitude) => {
  if (!process.env.OPENCAGE_KEY) {
    throw new Error('OpenCage API key not configured');
  }

  const response = await axiosInstance.get(
    `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${process.env.OPENCAGE_KEY}`
  );

  if (!response.data?.results?.[0]?.components) {
    throw new Error('Invalid OpenCage response');
  }

  const location = response.data.results[0].components;
  return {
    country: location.country,
    countryCode: location.country_code?.toUpperCase()
  };
};

export const getLocationInfo = async (req) => {
  try {
    const clientIp = await getClientIp(req);
    console.log('Detected IP:', clientIp);
    
    if (!process.env.IPINFO_API_KEY) {
      throw new Error('IPInfo API key not configured');
    }

    // Get initial location from IPInfo
    const ipInfoResponse = await axiosInstance.get(
      `https://ipinfo.io/${clientIp}?token=${process.env.IPINFO_API_KEY}`
    );
    
    if (ipInfoResponse.status !== 200 || !ipInfoResponse.data) {
      throw new Error('Invalid IPInfo response');
    }

    validateIpInfoData(ipInfoResponse.data);
    const [latitude, longitude] = ipInfoResponse.data.loc.split(',');

    // Get detailed country info from OpenCage
    const detailedLocation = await getDetailedLocation(latitude, longitude);
    

    return {
      ip: ipInfoResponse.data.ip,
      country: detailedLocation.country,
      countryCode: detailedLocation.countryCode,
      region: ipInfoResponse.data.region,
      city: ipInfoResponse.data.city,
      latitude,
      longitude,
      source: 'ipinfo+opencage',
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Location detection failed:', error.message);
    return null;
  }
};