import { checkRateLimit } from '../redis/rateLimiter.js';

export const rateLimitMiddleware = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.ip;
    const endpoint = req.path;
    
   
    const limits = {
      '/api/book/vulnerable': { limit: 5, window: 60 }, 
      '/api/book/secure': { limit: 5, window: 60 },
      '/register': { limit: 3, window: 3600 },        
      '/login': { limit: 10, window: 60 },               
      '/api/test': { limit: 20, window: 60 }
    };
    
    const config = limits[endpoint] || { limit: 20, window: 60 };
    const rateLimitResult = await checkRateLimit(userId, config.limit, config.window);
    
    res.setHeader('X-RateLimit-Limit', config.limit);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, rateLimitResult.remaining));
    
    if (!rateLimitResult.allowed) {
      res.setHeader('Retry-After', rateLimitResult.retryAfter);
      return res.status(429).json({
        success: false,
        error: 'Too many requests',
        retryAfter: rateLimitResult.retryAfter,
        message: `Rate limit exceeded. Retry after ${rateLimitResult.retryAfter} seconds`
      });
    }
    
    next();
  } catch (error) {
    console.error('Rate limit error:', error);
    next();
  }
};
