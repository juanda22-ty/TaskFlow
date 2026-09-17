import Redis from 'ioredis';

const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
};

export const redisClient = new Redis(redisConfig);
export const redisSubscriber = new Redis(redisConfig);

redisClient.on('connect', () => console.log('✅ Redis Cliente conectado'));
redisSubscriber.on('connect', () => console.log('✅ Redis Subscriber conectado'));

redisClient.on('error', (err) => console.error('❌ Redis Cliente error:', err.message));
redisSubscriber.on('error', (err) => console.error('❌ Redis Subscriber error:', err.message));
