import type { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';

export async function corsPlugin(app: FastifyInstance): Promise<void> {
  await app.register(cors, {
    origin: process.env['NODE_ENV'] === 'production'
      ? ['https://nabodata.no', 'https://www.nabodata.no']
      : true,
    methods: ['GET'],
  });
}
