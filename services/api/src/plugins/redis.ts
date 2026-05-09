import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { Redis } from 'ioredis';

declare module 'fastify' {
  interface FastifyInstance {
    redis: Redis;
  }
}

export const redisPlugin = fp(async (app: FastifyInstance) => {
  const redisUrl = process.env['REDIS_URL'];
  if (!redisUrl) throw new Error('REDIS_URL is required');
  const redis = new Redis(redisUrl, { lazyConnect: true });
  await redis.connect();
  app.decorate('redis', redis);
  app.addHook('onClose', async () => {
    await redis.quit();
  });
});
