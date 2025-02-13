import rateLimit from 'express-rate-limit';

export const getClientIp =  (req) => {
  const ip =
    req.headers['x-forwarded-for']?.split(',')[0] || 
    req.headers['cf-connecting-ip'] ||              
    req.headers['x-real-ip'] ||                     
    req.headers['x-client-ip'] ||                   
    req.socket.remoteAddress ||                     
    req.connection.remoteAddress ||                
    '127.0.0.1';                                   

  const cleanedIp = ip.replace(/^.*:/, ''); 

  if (!cleanedIp || cleanedIp === '127.0.0.1') {
    throw new Error('Valid IP address not found'); 
  }

  return cleanedIp;
};


export const createRateLimiter =  (options = {}) => {
  const defaultOptions = {
    windowMs: 15 * 60 * 1000, 
    max: 100,                
    standardHeaders: true,   
    legacyHeaders: false,    
    message: 'Too many requests, please try again later.',
    trustProxy: process.env.NODE_ENV === 'production', 
    keyGenerator: (req) => getClientIp(req), 
  };

  return rateLimit({ ...defaultOptions, ...options });
};


export const generalLimiter = createRateLimiter({
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});


export const strictLimiter = createRateLimiter({
  max: 5, 
  message: 'Too many login attempts, please try again later.',
});

