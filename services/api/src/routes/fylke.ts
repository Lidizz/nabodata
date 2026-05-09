import type { FastifyInstance } from 'fastify';
import { queryAllFylker, queryFylkeBySlug } from '../db/queries/fylke.js';
import { cacheGet, cacheSet, TTL } from '../lib/cache.js';
import { NotFoundError, sendError } from '../lib/errors.js';
import type { Fylke } from '@nabodata/types';

export async function fylkeRoutes(app: FastifyInstance): Promise<void> {
  app.get('/api/areas/fylke', async (_req, reply) => {
    const cacheKey = 'fylke:all';
    const cached = await cacheGet<Fylke[]>(app.redis, cacheKey);

    if (cached) {
      return reply.send({
        data: cached,
        meta: { generatedAt: new Date().toISOString(), cached: true },
      });
    }

    const fylker = await queryAllFylker(app.sql);
    await cacheSet(app.redis, cacheKey, fylker, TTL.FYLKE_LIST);

    return reply.send({
      data: fylker,
      meta: { generatedAt: new Date().toISOString(), cached: false },
    });
  });

  app.get<{ Params: { slug: string } }>(
    '/api/areas/fylke/:slug/summary',
    async (req, reply) => {
      const { slug } = req.params;
      const cacheKey = `fylke:${slug}`;
      const cached = await cacheGet<Fylke>(app.redis, cacheKey);

      if (cached) {
        return reply.send({
          data: cached,
          meta: { generatedAt: new Date().toISOString(), cached: true },
        });
      }

      const fylke = await queryFylkeBySlug(app.sql, slug);
      if (!fylke) {
        return sendError(reply, new NotFoundError(`Fylke '${slug}'`));
      }

      await cacheSet(app.redis, cacheKey, fylke, TTL.FYLKE_DETAIL);

      return reply.send({
        data: fylke,
        meta: { generatedAt: new Date().toISOString(), cached: false },
      });
    },
  );
}
