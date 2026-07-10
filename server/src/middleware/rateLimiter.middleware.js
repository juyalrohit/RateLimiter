import FixedWindowRateLimiter from "../rateLimiter/FixedWindowRateLimiter.js";
import FixedWindowRedisRateLimiter from "../rateLimiter/FixedWindowRedisRateLimiter.js";
import MemoryStorage from "../rateLimiter/storage.js";

  const storage = new MemoryStorage();
//  const rateLimiter = new FixedWindowRateLimiter(storage, 10, 10000);
  const rateLimiter = new FixedWindowRedisRateLimiter(10, 10);


export async function rateLimiterMiddleware(req, res, next){
  

    try {
        const userIp  = req.ip;


        const result = await rateLimiter.allow(userIp); 
        

        res.setHeader("X-RateLimit-Limit", result.limit);
        res.setHeader("X-RateLimit-Remaining", result.remaining);
        res.setHeader("Retry-After", result.retryAfter);

        if (!result.allowed) {
            return res.status(429).json({
                message: "Too Many Requests"
            });
        }

        next();
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({message : "Internal Server Error"});
    }
}