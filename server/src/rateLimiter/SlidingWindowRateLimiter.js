import redis from "../config/redis.js";
import { randomUUID } from "crypto";
export default class SlidingWindowRateLimiter {
    constructor(windowSize, limit){
        this.windowSize = windowSize;
        this.limit = limit;
    }

    async allow(userId) {
    const timeStamp = Date.now();
    const key = `rl:${userId}`;

    const script = `
        local key = KEYS[1]
        local minAllowed = tonumber(ARGV[1])
        local limit = tonumber(ARGV[2])
        local timestamp = tonumber(ARGV[3])
        local member = ARGV[4]
        local ttl = tonumber(ARGV[5])

        redis.call("ZREMRANGEBYSCORE", key, "-inf", minAllowed)

        local current = redis.call("ZCARD", key)
        
        if current >= limit then
            return {
                0,
                current
            }
        end

        redis.call("ZADD", key, timestamp, member)
        redis.call("EXPIRE", key, ttl)

        return {
            1,
            current + 1
        }

    `;



    const minAllowed = timeStamp - this.windowSize;

        const result = await redis.eval(script, {
        keys: [key],
        arguments: [
            minAllowed.toString(),
            this.limit.toString(),
            timeStamp.toString(),
            `${timeStamp}-${randomUUID()}`,
            Math.ceil(this.windowSize / 1000 + 1).toString()
        ]
    });


    const [allowed, current ] = result;



    return {
        allowed: allowed === 1,
        limit: this.limit,
        remaining: Math.max(0, this.limit - current),
    };
}
}