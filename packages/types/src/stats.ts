export interface PopulationStats {
  total: number;
  densityPerKm2: number;
  changeYoY: number;
  year: number;
}

export interface AgeDistribution {
  bands: AgeBand[];
  medianAge: number;
  year: number;
}

export interface AgeBand {
  label: string;
  male: number;
  female: number;
}

export interface IncomeStats {
  medianHousehold: number;
  vsNational: number;
  year: number;
}

export interface EducationStats {
  primaryShare: number;
  secondaryShare: number;
  higherShare: number;
  year: number;
}

export interface MigrationStats {
  // LEGAL NOTE: kommune level only — no grunnkrets breakdown ever
  // FRAMING: always "country of background", never "ethnicity" or "origin"
  topCountries: { country: string; count: number; share: number }[];
  totalForeign: number;
  totalForeignShare: number;
  year: number;
}

export interface BusinessStats {
  total: number;
  perCapita: number;
  topSectors: { sector: string; count: number }[];
  year: number;
}

export interface HealthStats {
  lifeExpectancyMale: number;
  lifeExpectancyFemale: number;
  year: number;
}
