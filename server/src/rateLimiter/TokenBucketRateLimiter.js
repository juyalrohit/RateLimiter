import redis from "../config/redis.js";
export default class TokenBucketRateLimiter {
    constructor(refillTime, limit){
       this.refillTime = refillTime;
       this.limit = limit;
    }

    async allow(userId){
        const key = `bucket-${userId}`

        const exists = await redis.exists(key)
        console.log("Existes", exists)
        if(!exists){
            await redis.hSet(key, {
                tokens : this.limit,
                lastRefill : Date.now()
            });
        }

        const tokens = Number(await redis.hGet(key, "tokens"));
        console.log("tokens", tokens)
        const lastRefill = Number(await redis.hGet(key, "lastRefill"));

        const now = Date.now();

        const tokensToAdd = Math.floor((now - lastRefill) / this.refillTime);

        const availableTokens = Math.min(
            this.limit,
            tokens + tokensToAdd
        );

        console.log("Available Token", availableTokens)

        if (availableTokens < 1) {
            return {
                allowed: false,
                limit: this.limit,
                remaining: 0
            };
        }

        await redis.hSet(key, {
            tokens: availableTokens - 1,
            lastRefill: now
        });
        await redis.expire(key, 3600);

        return {
            allowed: true,
            limit: this.limit,
            remaining: availableTokens - 1
        };

    }
}