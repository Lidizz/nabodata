import type { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';

// ALLOWED_ORIGINS env var: comma-separated list of allowed origins in production
// Falls back to allowing all Vercel preview URLs + the main app domain
const ALLOWED_ORIGINS = process.env['ALLOWED_ORIGINS']
  ? process.env['ALLOWED_ORIGINS'].split(',').map((s) => s.trim())
  : null;

export async function corsPlugin(app: FastifyInstance): Promise<void> {
  await app.register(cors, {
    origin:
      process.env['NODE_ENV'] === 'production'
        ? (origin, cb) => {
            if (!origin) { cb(null, true); return; } // server-to-server
            const allowed = ALLOWED_ORIGINS ?? [];
            const isAllowed =
              allowed.includes(origin) ||
              /https:\/\/nabodata.*\.vercel\.app$/.test(origin) ||
              origin === 'https://nabodata.no' ||
              origin === 'https://www.nabodata.no';
            cb(isAllowed ? null : new Error('Not allowed by CORS'), isAllowed);
          }
        : true,
    methods: ['GET'],
  });
}
