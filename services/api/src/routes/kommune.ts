import type { FastifyInstance } from 'fastify';
import { queryKommuneBySlug } from '../db/queries/kommune.js';
import { cacheGet, cacheSet, TTL } from '../lib/cache.js';
import { NotFoundError, sendError } from '../lib/errors.js';
import type { Kommune } from '@nabodata/types';

export async function kommuneRoutes(app: FastifyInstance): Promise<void> {
  app.get<{ Params: { slug: string } }>(
    '/api/areas/kommune/:slug/summary',
    async (req, reply) => {
      const { slug } = req.params;
      const cacheKey = `kommune:${slug}`;
      const cached = await cacheGet<Kommune>(app.redis, cacheKey);

      if (cached) {
        return reply.send({
          data: cached,
          meta: { generatedAt: new Date().toISOString(), cached: true },
        });
      }

      const kommune = await queryKommuneBySlug(app.sql, slug);
      if (!kommune) {
        return sendError(reply, new NotFoundError(`Kommune '${slug}'`));
      }

      await cacheSet(app.redis, cacheKey, kommune, TTL.KOMMUNE);

      return reply.send({
        data: kommune,
        meta: { generatedAt: new Date().toISOString(), cached: false },
      });
    },
  );
}
