import Fastify from 'fastify';
import { corsPlugin } from './plugins/cors.js';
import { redisPlugin } from './plugins/redis.js';
import { postgresPlugin } from './plugins/postgres.js';
import { healthRoutes } from './routes/health.js';
import { fylkeRoutes } from './routes/fylke.js';
import { kommuneRoutes } from './routes/kommune.js';
import { searchRoutes } from './routes/search.js';
import { i18nRoutes } from './routes/i18n.js';

export function buildApp() {
  const isDev = process.env['NODE_ENV'] !== 'production';
  const app = Fastify({
    logger: isDev
      ? { transport: { target: 'pino-pretty' } }
      : true,
  });
  void app.register(corsPlugin);
  void app.register(redisPlugin);
  void app.register(postgresPlugin);
  void app.register(healthRoutes);
  void app.register(fylkeRoutes);
  void app.register(kommuneRoutes);
  void app.register(searchRoutes);
  void app.register(i18nRoutes);
  return app;
}
