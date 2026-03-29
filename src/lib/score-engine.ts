// Sun Score Computation Engine
// V1: Static computation from public data sources
//
// Components:
// 1. Annual direct sun hours (35%) - Solar geometry + building shadow model
// 2. Fog frequency (25%) - NOAA historical weather station data
// 3. Wind exposure (15%) - Weather station + topographic modeling
// 4. Temperature stability (15%) - Historical variance from daily mean
// 5. Seasonal consistency (10%) - Year-round pleasantness

export interface ScoreInput {
  annualSunHours: number;    // Hours of direct sunlight per year (SF range: 1500-2600)
  fogDaysPerYear: number;    // Number of fog-affected days (SF range: 30-120)
  avgWindMph: number;        // Average wind speed in mph (SF range: 5-22)
  tempVariance: number;      // Average daily temperature variance in F (SF range: 2-7)
  seasonalRange: number;     // Max monthly score - min monthly score (SF range: 8-28)
}

export interface ScoreBreakdown {
  total: number;
  label: string;
  components: {
    sunHours: { raw: number; normalized: number; weighted: number };
    fogFrequency: { raw: number; normalized: number; weighted: number };
    windExposure: { raw: number; normalized: number; weighted: number };
    temperatureStability: { raw: number; normalized: number; weighted: number };
    seasonalConsistency: { raw: number; normalized: number; weighted: number };
  };
}

const WEIGHTS = {
  sunHours: 0.35,
  fogFrequency: 0.25,
  windExposure: 0.15,
  temperatureStability: 0.15,
  seasonalConsistency: 0.10,
} as const;

// Normalization functions - convert raw values to 0-100 scale
function normalizeSunHours(hours: number): number {
  // SF range: ~1500 (Outer Sunset) to ~2600 (south-facing hilltops)
  return Math.min(100, Math.max(0, ((hours - 1400) / 1200) * 100));
}

function normalizeFogDays(days: number): number {
  // Inverse: fewer fog days = higher score
  // SF range: ~30 (Mission banana belt) to ~120 (Outer Richmond)
  return Math.min(100, Math.max(0, ((120 - days) / 90) * 100));
}

function normalizeWind(mph: number): number {
  // Inverse: less wind = higher score
  // SF range: ~5 (sheltered valleys) to ~22 (exposed hilltops/coast)
  return Math.min(100, Math.max(0, ((22 - mph) / 17) * 100));
}

function normalizeTemperature(variance: number): number {
  // Inverse: less variance = higher score (more stable = more pleasant)
  // SF range: ~2 (fog buffer) to ~7 (inland hills)
  return Math.min(100, Math.max(0, ((7 - variance) / 5) * 100));
}

function normalizeSeasonalConsistency(range: number): number {
  // Inverse: smaller range = higher score (pleasant year-round)
  // SF range: ~8 (banana belt) to ~28 (coastal fog zones)
  return Math.min(100, Math.max(0, ((28 - range) / 20) * 100));
}

function getLabel(score: number): string {
  if (score >= 90) return "Sun Haven";
  if (score >= 75) return "Sunny";
  if (score >= 60) return "Moderate";
  if (score >= 45) return "Fog-Prone";
  if (score >= 30) return "Gray Belt";
  return "Fog Capital";
}

export function computeSunScore(input: ScoreInput): ScoreBreakdown {
  const sunNorm = normalizeSunHours(input.annualSunHours);
  const fogNorm = normalizeFogDays(input.fogDaysPerYear);
  const windNorm = normalizeWind(input.avgWindMph);
  const tempNorm = normalizeTemperature(input.tempVariance);
  const seasonNorm = normalizeSeasonalConsistency(input.seasonalRange);

  const total = Math.round(
    sunNorm * WEIGHTS.sunHours +
    fogNorm * WEIGHTS.fogFrequency +
    windNorm * WEIGHTS.windExposure +
    tempNorm * WEIGHTS.temperatureStability +
    seasonNorm * WEIGHTS.seasonalConsistency
  );

  return {
    total: Math.max(0, Math.min(100, total)),
    label: getLabel(total),
    components: {
      sunHours: {
        raw: input.annualSunHours,
        normalized: Math.round(sunNorm),
        weighted: Math.round(sunNorm * WEIGHTS.sunHours),
      },
      fogFrequency: {
        raw: input.fogDaysPerYear,
        normalized: Math.round(fogNorm),
        weighted: Math.round(fogNorm * WEIGHTS.fogFrequency),
      },
      windExposure: {
        raw: input.avgWindMph,
        normalized: Math.round(windNorm),
        weighted: Math.round(windNorm * WEIGHTS.windExposure),
      },
      temperatureStability: {
        raw: input.tempVariance,
        normalized: Math.round(tempNorm),
        weighted: Math.round(tempNorm * WEIGHTS.temperatureStability),
      },
      seasonalConsistency: {
        raw: input.seasonalRange,
        normalized: Math.round(seasonNorm),
        weighted: Math.round(seasonNorm * WEIGHTS.seasonalConsistency),
      },
    },
  };
}
