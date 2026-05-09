import type { FastifyInstance } from 'fastify';

const VERSION = process.env['npm_package_version'] ?? '0.1.0';
const MARTIN_URL = process.env['TILE_SERVER_URL'] ?? 'http://localhost:3001';

type DepStatus = 'ok' | 'degraded';

export async function healthRoutes(app: FastifyInstance): Promise<void> {
  app.get('/health', async () => {
    const [dbResult, redisResult, martinResult] = await Promise.allSettled([
      app.sql`SELECT 1`.then((): DepStatus => 'ok'),
      app.redis.ping().then((): DepStatus => 'ok'),
      fetch(`${MARTIN_URL}/catalog`).then((r): DepStatus => (r.ok ? 'ok' : 'degraded')),
    ]);

    const db: DepStatus = dbResult.status === 'fulfilled' ? dbResult.value : 'degraded';
    const redis: DepStatus = redisResult.status === 'fulfilled' ? redisResult.value : 'degraded';
    const martin: DepStatus = martinResult.status === 'fulfilled' ? martinResult.value : 'degraded';
    const status: DepStatus =
      db === 'ok' && redis === 'ok' && martin === 'ok' ? 'ok' : 'degraded';

    return { status, version: VERSION, db, redis, martin };
  });
}
