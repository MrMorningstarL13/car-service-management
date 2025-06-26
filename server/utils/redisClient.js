const { createClient } = require('redis');

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.error('Redis client error:', err));
redisClient.on('connect', () => console.log('Redis connection opened'));

(async () => {
    try {
        await redisClient.connect();
    } catch (err) {
        console.error('Could not connect to Redis', err);
    }
})();

module.exports = { redisClient };
