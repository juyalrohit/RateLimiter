import FixedWindowRateLimiter from "../rateLimiter/FixedWindowRateLimiter.js";
import FixedWindowRedisRateLimiter from "../rateLimiter/FixedWindowRedisRateLimiter.js";
import SlidingWindowRateLimiter from "../rateLimiter/SlidingWindowRateLimiter.js";
import MemoryStorage from "../rateLimiter/storage.js";
import TokenBucketRateLimiter from "../rateLimiter/TokenBucketRateLimiter.js";

  const storage = new MemoryStorage();

//  const rateLimiter = new FixedWindowRateLimiter(storage, 10, 10000);

//   const rateLimiter = new FixedWindowRedisRateLimiter(10, 10);

// const rateLimiter = new SlidingWindowRateLimiter(10 * 1000, 10);

const rateLimiter = new TokenBucketRateLimiter(10*1000, 10);


// export async function rateLimiterMiddleware(req, res, next){
  

//     try {
//         const userIp  = req.ip;


//         // const result = await rateLimiter.allow(userIp); 
        

//         res.setHeader("X-RateLimit-Limit", result.limit);
//         res.setHeader("X-RateLimit-Remaining", result.remaining);
//         res.setHeader("Retry-After", result.retryAfter);

//         if (!result.allowed) {
//             return res.status(429).json({
//                 message: "Too Many Requests"
//             });
//         }

//         next();
        
//     } catch (error) {
//         console.log(error)
//         return res.status(500).json({message : "Internal Server Error"});
//     }
// }


export async function rateLimiterMiddleware(req, res, next) {
    try {
        const result = await rateLimiter.allow(req.ip);

        res.setHeader("X-RateLimit-Limit", result.limit);
        res.setHeader("X-RateLimit-Remaining", result.remaining);

        if (!result.allowed) {
            return res.status(429).json({
                message: "Too Many Requests",
            });
        }

        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
}