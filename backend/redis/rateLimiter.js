import redis from 'redis';

let client;

export const initRedis = async () => {
  client = redis.createClient({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
  });

  client.on('error', (err) => console.log('Redis Client Error', err));
  await client.connect();
  console.log('Redis connected for rate limiting');
  return client;
};

export const getRedisClient = () => client;

/**
 * Sliding window rate limiter
 * @param userId - User identifier
 * @param limit - Max requests allowed
 * @param window - Time window in seconds
 */
export const checkRateLimit = async (userId, limit = 10, window = 60) => {
  if (!client) {
    throw new Error('Redis client not initialized');
  }
  
  const key = `rate-limit:${userId}`;
  const now = Date.now();
  const windowStart = now - (window * 1000);
  
  try {
    // Remove old requests outside window
    await client.zRemRangeByScore(key, '-inf', windowStart);
    
    // Count requests in current window
    const requestCount = await client.zCard(key);
    
    if (requestCount >= limit) {
      const oldest = await client.zRange(key, 0, 0);
      const resetTime = oldest.length ? Math.ceil((oldest[0] + (window * 1000) - now) / 1000) : window;
      
      return {
        allowed: false,
        remaining: 0,
        retryAfter: resetTime
      };
    }
    
    // Add current request
    await client.zAdd(key, { score: now, member: `${now}-${Math.random()}` });
    await client.expire(key, window);
    
    return {
      allowed: true,
      remaining: limit - requestCount - 1,
      retryAfter: 0
    };
  } catch (error) {
    console.error('Rate limit check error:', error);
    throw error;
  }
};

export const getRateLimitKey = (userId, endpoint) => `rate-limit:${userId}:${endpoint}`;

export const resetRateLimit = async (userId, endpoint = null) => {
  if (!client) return;
  
  try {
    if (endpoint) {
      const key = getRateLimitKey(userId, endpoint);
      await client.del(key);
    } else {
      // Reset all endpoints for user
      const pattern = `rate-limit:${userId}:*`;
      const keys = await client.keys(pattern);
      if (keys.length > 0) {
        await client.del(keys);
      }
    }
  } catch (error) {
    console.error('Error resetting rate limit:', error);
  }
};
