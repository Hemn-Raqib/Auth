import rateLimit from 'express-rate-limit';

// Function to detect and clean IP from the request
export const getClientIp =  (req) => {
  const ip =
    req.headers['x-forwarded-for']?.split(',')[0] || // Check X-Forwarded-For header
    req.headers['cf-connecting-ip'] ||              // Cloudflare-specific header
    req.headers['x-real-ip'] ||                     // nginx or other proxies
    req.headers['x-client-ip'] ||                   // Custom client IP header
    req.socket.remoteAddress ||                     // Remote address from socket
    req.connection.remoteAddress ||                // Fallback for legacy Node.js
    '127.0.0.1';                                   // Default to localhost

  const cleanedIp = ip.replace(/^.*:/, ''); // Remove IPv6 prefix (e.g., "::ffff:")

  if (!cleanedIp || cleanedIp === '127.0.0.1') {
    throw new Error('Valid IP address not found'); // Handle invalid IPs
  }

  return cleanedIp;
};

// Factory function to create rate limiters with custom options
export const createRateLimiter =  (options = {}) => {
  const defaultOptions = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,                // Default: 100 requests per window
    standardHeaders: true,   // Add `RateLimit-*` headers in responses
    legacyHeaders: false,    // Disable deprecated `X-RateLimit-*` headers
    message: 'Too many requests, please try again later.',
    trustProxy: process.env.NODE_ENV === 'production', // Trust reverse proxies in production
    keyGenerator: (req) => getClientIp(req), // Use custom IP detection
  };

  return rateLimit({ ...defaultOptions, ...options });
};

// General limiter for all routes
export const generalLimiter = createRateLimiter({
  max: 100, // Limit each IP to 100 requests per 15 minutes
  message: 'Too many requests from this IP, please try again later.',
});

// Strict limiter for sensitive routes like login
export const strictLimiter = createRateLimiter({
  max: 5, // Limit each IP to 5 requests per 15 minutes
  message: 'Too many login attempts, please try again later.',
});

