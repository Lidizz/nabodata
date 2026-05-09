import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import postgres from 'postgres';

declare module 'fastify' {
  interface FastifyInstance {
    sql: postgres.Sql;
  }
}

export const postgresPlugin = fp(async (app: FastifyInstance) => {
  const databaseUrl = process.env['DATABASE_URL'];
  if (!databaseUrl) throw new Error('DATABASE_URL is required');

  const sql = postgres(databaseUrl, {
    max: 10,
    idle_timeout: 30,
    connect_timeout: 10,
  });

  app.decorate('sql', sql);

  app.addHook('onClose', async () => {
    await sql.end();
  });
});
