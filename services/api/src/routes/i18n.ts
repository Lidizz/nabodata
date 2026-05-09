import type { FastifyInstance } from 'fastify';
import { cacheGet, cacheSet, TTL } from '../lib/cache.js';
import { ValidationError, sendError } from '../lib/errors.js';

const SUPPORTED_LANGS = ['nb', 'en'] as const;
type Lang = (typeof SUPPORTED_LANGS)[number];

function isSupportedLang(lang: string): lang is Lang {
  return (SUPPORTED_LANGS as readonly string[]).includes(lang);
}

export async function i18nRoutes(app: FastifyInstance): Promise<void> {
  app.get<{ Params: { lang: string } }>('/api/v1/i18n/:lang', async (req, reply) => {
    const { lang } = req.params;

    if (!isSupportedLang(lang)) {
      return sendError(reply, new ValidationError(`Unsupported language: ${lang}`));
    }

    const cacheKey = `i18n:${lang}`;
    const cached = await cacheGet<Record<string, string>>(app.redis, cacheKey);

    if (cached) {
      return reply.send({
        data: cached,
        meta: { generatedAt: new Date().toISOString(), cached: true },
      });
    }

    // TODO: call Anthropic API, cache in i18n_cache table
    const rows = await app.sql<{ namespace: string; strings: Record<string, string> }[]>`
      SELECT namespace, strings FROM i18n_cache WHERE lang = ${lang}
    `;

    const merged: Record<string, string> = {};
    for (const row of rows) {
      Object.assign(merged, row.strings);
    }

    await cacheSet(app.redis, cacheKey, merged, TTL.I18N);

    return reply.send({
      data: merged,
      meta: { generatedAt: new Date().toISOString(), cached: false },
    });
  });
}
