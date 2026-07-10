
import redis from "../config/redis.js";
export default class FixedWindowRedisRateLimiter {
    constructor(limit, windowTtl){
       this.limit = limit;
       this.windowTtl = windowTtl;
    
    }

    async allow(ip){
        const key = `rl:ip:${ip}`;
        const val = await redis.incr(key);
      

        if(val === 1){
            await redis.expire(key, this.windowTtl);
        }

        const remaining = await this.getRemainingRequests(key);
        const retryAfter = await this.getRetryTime(key);


        if(val > this.limit){
            return {allowed : false, remaining : remaining, 
                retryAfter : retryAfter, limit : this.limit};
        }


        return {allowed : true, remaining : remaining, 
                retryAfter : retryAfter, limit : this.limit};
    }

    async getRetryTime(key){
        return await redis.ttl(key);
    }

    async getRemainingRequests(key){
        const currCnt = await redis.get(key);
        return this.limit - currCnt;
    }


}