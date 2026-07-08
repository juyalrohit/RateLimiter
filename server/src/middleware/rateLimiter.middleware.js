import FixedWindowRateLimiter from "../rateLimiter/FixedWindowRateLimiter.js";
import MemoryStorage from "../rateLimiter/storage.js";

  const storage = new MemoryStorage();
 const rateLimiter = new FixedWindowRateLimiter(storage, 10, 10000);


export function rateLimiterMiddleware(req, res, next){
  

    try {
        const userIp  = req.ip;
        if(rateLimiter.allow(userIp)){
            next();
        }
        else{
            return res.status(429).json({message : "Too Many Requests"});
        }
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({message : "Internal Server Error"});
    }
}