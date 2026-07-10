import { createClient } from 'redis';

const redis = createClient({
    username: 'default',
    password: '55ajQDxtjZ5AIeSjgDn0Q9Fos9NUJuVr',
    socket: {
        host: 'hall-innovative-ink-83415.db.redis.io',
        port: 14600
    }
});

redis.on('error', err => console.log('Redis Client Error', err));

await redis.connect();

export default redis;

