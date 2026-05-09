import type { FastifyInstance } from 'fastify';
import { queryKommuneSearch } from '../db/queries/kommune.js';
import { cacheGet, cacheSet, TTL } from '../lib/cache.js';
import { ValidationError, sendError } from '../lib/errors.js';
import type { KommuneSummary } from '@nabodata/types';

export async function searchRoutes(app: FastifyInstance): Promise<void> {
  app.get<{ Querystring: { q?: string; lang?: string } }>('/api/v1/search', async (req, reply) => {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return sendError(reply, new ValidationError('Query parameter "q" must be at least 2 characters'));
    }

    const term = q.trim();
    const cacheKey = `search:${term.toLowerCase()}`;
    const cached = await cacheGet<KommuneSummary[]>(app.redis, cacheKey);

    if (cached) {
      return reply.send({
        data: { results: cached },
        meta: { generatedAt: new Date().toISOString(), cached: true },
      });
    }

    const results = await queryKommuneSearch(app.sql, term);
    await cacheSet(app.redis, cacheKey, results, TTL.SEARCH);

    return reply.send({
      data: { results },
      meta: { generatedAt: new Date().toISOString(), cached: false },
    });
  });
}
