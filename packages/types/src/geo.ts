export interface Fylke {
  id: string;
  slug: string;
  name: { nb: string; en: string };
  bbox: [number, number, number, number];
  kommuner: KommuneSummary[];
}

export interface KommuneSummary {
  id: string;
  slug: string;
  name: { nb: string; en: string };
  fylkeId: string;
}

export interface Kommune extends KommuneSummary {
  bbox: [number, number, number, number];
  stats: KommuneStats;
  updatedAt: string;
}

export interface KommuneStats {
  population: PopulationStats;
  income: IncomeStats;
  age: AgeDistribution;
  education: EducationStats;
  migration: MigrationStats;
  businesses: BusinessStats;
  health: HealthStats;
}

import type {
  PopulationStats,
  IncomeStats,
  AgeDistribution,
  EducationStats,
  MigrationStats,
  BusinessStats,
  HealthStats,
} from './stats.js';
