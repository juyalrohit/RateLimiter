import redis from "../config/redis";

export default class RedisStorage {
  
    constructor(){
    }

  async  has(key){
        return await redis.exists(key);
    }

    async get(key){
        return await redis.get(key);
    }

   async set(key, value){
        await redis.set(key, value);
    }

   async delete(key) {
       await  redis.del(key);
    }
} 