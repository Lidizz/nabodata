import postgres from 'postgres';
import pino from 'pino';

const logger = pino({ level: 'info' });

const databaseUrl = process.env['DATABASE_URL'];
if (!databaseUrl) throw new Error('DATABASE_URL is required');

const sql = postgres(databaseUrl);

const JOB = process.env['JOB'];

async function main() {
  logger.info({ job: JOB }, 'Starting ingestion job');

  switch (JOB) {
    case 'boundaries': {
      const { runBoundaryIngestion } = await import('./jobs/kartverket-boundaries.js');
      await runBoundaryIngestion(sql);
      break;
    }
    case 'population': {
      const { runPopulationIngestion } = await import('./jobs/ssb-population.js');
      await runPopulationIngestion(sql);
      break;
    }
    case 'income': {
      const { runIncomeIngestion } = await import('./jobs/ssb-income.js');
      await runIncomeIngestion(sql);
      break;
    }
    case 'education': {
      const { runEducationIngestion } = await import('./jobs/ssb-education.js');
      await runEducationIngestion(sql);
      break;
    }
    case 'migration': {
      const { runMigrationIngestion } = await import('./jobs/ssb-migration.js');
      await runMigrationIngestion(sql);
      break;
    }
    case 'businesses': {
      const { runBusinessIngestion } = await import('./jobs/bronnoy-businesses.js');
      await runBusinessIngestion(sql);
      break;
    }
    case 'osm': {
      const { runOsmIngestion } = await import('./jobs/osm-pois.js');
      await runOsmIngestion(sql);
      break;
    }
    case 'health': {
      const { runHealthIngestion } = await import('./jobs/fhi-health.js');
      await runHealthIngestion(sql);
      break;
    }
    default:
      throw new Error(`Unknown JOB: ${JOB ?? '(none)'}. Set JOB env var.`);
  }

  logger.info({ job: JOB }, 'Ingestion complete');
  await sql.end();
}

main().catch((err) => {
  logger.error(err, 'Ingestion failed');
  process.exit(1);
});
