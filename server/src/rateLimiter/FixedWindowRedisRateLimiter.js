
import redis from "../config/redis.js";
export default class FixedWindowRedisRateLimiter {
    constructor(limit, windowTtl){
       this.limit = limit;
       this.windowTtl = windowTtl;
    
    }

    async allow(ip){
        const key = `rl:ip:${ip}`;


        const script = `
        local val = redis.call("INCR", KEYS[1])

        if val == 1 then
            redis.call("EXPIRE", KEYS[1], ARGV[1])
        end

        return val
        `;

        

        const val = await redis.eval(script, {
            keys: [key],
            arguments: [this.windowTtl.toString()]
        });
        

        // const val = await redis.incr(key);
      

        // if(val === 1){
        //     await redis.expire(key, this.windowTtl);
        // }


        
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