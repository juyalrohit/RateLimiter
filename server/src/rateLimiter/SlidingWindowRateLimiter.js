import redis from "../config/redis.js";
import { randomUUID } from "crypto";
export default class SlidingWindowRateLimiter {
    constructor(windowSize, limit){
        this.windowSize = windowSize;
        this.limit = limit;
    }

    async allow(userId) {
    const timeStamp = Date.now();
    const key = `RateLimiter:${userId}`;

    const minAllowed = timeStamp - this.windowSize;

    await redis.zRemRangeByScore(key, "-inf", minAllowed);

    const current = await redis.zCard(key);

    if (current >= this.limit) {
        return {
            allowed: false,
            limit: this.limit,
            remaining: 0,
        };
    }

    await redis.zAdd(key, {
        score: timeStamp,
        value: `${timeStamp}-${Math.random()}`,
    });

    return {
        allowed: true,
        limit: this.limit,
        remaining: this.limit - current - 1,
    };
}
}