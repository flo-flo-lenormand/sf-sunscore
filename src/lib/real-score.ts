// Real Sun Score computation pipeline
// Wires together: geocoding -> elevation -> solar math -> NOAA interpolation -> score

import { geocodeAddress } from "./geocode";
import { getElevation } from "./elevation";
import { effectiveSunHours, monthlySunHours } from "./solar";
import { idwInterpolate, idwInterpolateMonthly } from "./noaa-stations";
import type { WeatherStation } from "./noaa-stations";

export interface RealSunScoreResult {
  score: number;
  label: string;
  percentile: number;
  address: string;
  neighborhood: string;
  lat: number;
  lng: number;
  elevation: number;
  components: {
    sunHours: { value: number; weight: 0.35; score: number };
    fogFrequency: { value: number; weight: 0.25; score: number };
    windExposure: { value: number; weight: 0.15; score: number };
    temperatureStability: { value: number; weight: 0.15; score: number };
    seasonalConsistency: { value: number; weight: 0.10; score: number };
  };
  seasonal: {
    jan: number; feb: number; mar: number; apr: number;
    may: number; jun: number; jul: number; aug: number;
    sep: number; oct: number; nov: number; dec: number;
  };
  annualSunHours: number;
  fogDaysPerYear: number;
  avgWindMph: number;
  comparison: string;
  dataSources: string[];
}

function getLabel(score: number): string {
  if (score >= 90) return "Sun Haven";
  if (score >= 75) return "Sunny";
  if (score >= 60) return "Moderate";
  if (score >= 45) return "Fog-Prone";
  if (score >= 30) return "Gray Belt";
  return "Fog Capital";
}

// Normalize raw values to 0-100 scores
function normalizeSunHours(hours: number): number {
  // SF effective range after terrain/fog: ~3200 (coastal) to ~4100 (hilltop banana belt)
  // Theoretical max for SF latitude is ~4400 hours
  return Math.min(100, Math.max(0, ((hours - 3000) / 1100) * 100));
}

function normalizeFogDays(days: number): number {
  // Inverse: fewer fog days = higher score
  // SF range: ~28 (Oakland) to ~105 (Outer Sunset)
  return Math.min(100, Math.max(0, ((105 - days) / 77) * 100));
}

function normalizeWind(mph: number): number {
  // Inverse: less wind = higher score
  // SF range: ~7 (sheltered inland) to ~22 (Twin Peaks/coast)
  return Math.min(100, Math.max(0, ((22 - mph) / 15) * 100));
}

function normalizeTemperature(variance: number): number {
  // Lower variance = more stable = better for outdoor comfort
  // But very low variance (heavy fog buffer) shouldn't score too high
  // Sweet spot: 9-12F range
  // SF range: ~5 (fog-locked) to ~20 (inland hills)
  if (variance < 7) {
    // Very low variance usually means persistent fog/overcast
    return Math.min(100, Math.max(0, variance * 10));
  }
  // Normal range: lower is better
  return Math.min(100, Math.max(0, ((18 - variance) / 11) * 100));
}

function normalizeSeasonalConsistency(monthlyScores: number[]): number {
  const max = Math.max(...monthlyScores);
  const min = Math.min(...monthlyScores);
  const range = max - min;
  // Smaller range = more consistent = higher score
  // SF range: ~10 (banana belt) to ~45 (coastal fog zones)
  return Math.min(100, Math.max(0, ((45 - range) / 35) * 100));
}

// Estimate percentile based on SF-wide score distribution
// Derived from computing scores across a grid of SF points
function estimatePercentile(score: number): number {
  // Approximate SF score distribution (roughly normal, mean ~55, SD ~15)
  // These breakpoints are calibrated from the station data
  if (score >= 85) return 97;
  if (score >= 80) return 93;
  if (score >= 75) return 88;
  if (score >= 70) return 80;
  if (score >= 65) return 70;
  if (score >= 60) return 58;
  if (score >= 55) return 45;
  if (score >= 50) return 35;
  if (score >= 45) return 25;
  if (score >= 40) return 15;
  if (score >= 35) return 8;
  if (score >= 30) return 4;
  return 2;
}

// Compute monthly sub-scores from interpolated monthly data
function computeMonthlyScores(
  monthlySun: number[],
  monthlyFog: number[],
  monthlyWind: number[],
  monthlyTemp: number[]
): number[] {
  return Array.from({ length: 12 }, (_, i) => {
    // Monthly sun hours as fraction of theoretical max for that month
    const monthMaxHours = [290, 290, 360, 390, 430, 435, 440, 410, 370, 340, 290, 275];
    const sunScore = Math.min(100, (monthlySun[i] / monthMaxHours[i]) * 100);
    const fogScore = Math.min(100, Math.max(0, 100 - (monthlyFog[i] / 16) * 100));
    const windScore = Math.min(100, Math.max(0, ((22 - monthlyWind[i]) / 15) * 100));
    const tempScore = monthlyTemp[i] < 7
      ? monthlyTemp[i] * 10
      : Math.min(100, Math.max(0, ((18 - monthlyTemp[i]) / 11) * 100));

    return Math.round(
      sunScore * 0.35 +
      fogScore * 0.25 +
      windScore * 0.15 +
      tempScore * 0.15 +
      50 * 0.10  // seasonal consistency doesn't apply per-month
    );
  });
}

export async function computeRealSunScore(addressQuery: string): Promise<RealSunScoreResult | null> {
  // Step 1: Geocode the address
  const geo = await geocodeAddress(addressQuery);
  if (!geo) return null;

  // Step 2: Get elevation
  const elevation = await getElevation(geo.lat, geo.lng);

  // Step 3: Compute solar data
  const sunHours = effectiveSunHours(geo.lat, geo.lng, elevation);
  const monthSun = monthlySunHours(geo.lat, geo.lng);

  // Step 4: Interpolate weather data from NOAA stations
  const fogDays = Math.round(idwInterpolate(geo.lat, geo.lng, (s: WeatherStation) => s.annualFogDays));
  const windMph = Math.round(idwInterpolate(geo.lat, geo.lng, (s: WeatherStation) => s.avgWindMph) * 10) / 10;
  const tempVariance = Math.round(idwInterpolate(geo.lat, geo.lng, (s: WeatherStation) => s.avgTempVarianceF) * 10) / 10;

  // Monthly interpolations
  const monthlyFog = idwInterpolateMonthly(geo.lat, geo.lng, (s: WeatherStation) => s.monthlyFogDays);
  const monthlyWind = idwInterpolateMonthly(geo.lat, geo.lng, (s: WeatherStation) => s.monthlyAvgWindMph);
  const monthlyTemp = idwInterpolateMonthly(geo.lat, geo.lng, (s: WeatherStation) => s.monthlyTempRangeF);

  // Step 5: Normalize components
  const sunScore = Math.round(normalizeSunHours(sunHours));
  const fogScore = Math.round(normalizeFogDays(fogDays));
  const windScore = Math.round(normalizeWind(windMph));
  const tempScore = Math.round(normalizeTemperature(tempVariance));

  // Compute monthly scores for seasonal consistency
  const monthlyScores = computeMonthlyScores(monthSun, monthlyFog, monthlyWind, monthlyTemp);
  const seasonalScore = Math.round(normalizeSeasonalConsistency(monthlyScores));

  // Step 6: Weighted total
  const totalScore = Math.round(
    sunScore * 0.35 +
    fogScore * 0.25 +
    windScore * 0.15 +
    tempScore * 0.15 +
    seasonalScore * 0.10
  );
  const clampedScore = Math.max(0, Math.min(100, totalScore));
  const percentile = estimatePercentile(clampedScore);

  const [jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec] = monthlyScores;

  return {
    score: clampedScore,
    label: getLabel(clampedScore),
    percentile,
    address: geo.displayName,
    neighborhood: geo.neighborhood,
    lat: geo.lat,
    lng: geo.lng,
    elevation: Math.round(elevation),
    components: {
      sunHours: { value: sunHours, weight: 0.35, score: sunScore },
      fogFrequency: { value: fogDays, weight: 0.25, score: fogScore },
      windExposure: { value: windMph, weight: 0.15, score: windScore },
      temperatureStability: { value: tempVariance, weight: 0.15, score: tempScore },
      seasonalConsistency: { value: Math.max(...monthlyScores) - Math.min(...monthlyScores), weight: 0.10, score: seasonalScore },
    },
    seasonal: { jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec },
    annualSunHours: sunHours,
    fogDaysPerYear: fogDays,
    avgWindMph: windMph,
    comparison: `Sunnier than ${percentile}% of SF addresses`,
    dataSources: [
      "Solar position: NREL Solar Position Algorithm",
      "Fog/wind/temperature: NOAA Climate Normals 1991-2020 (IDW interpolation from 12 stations)",
      "Elevation: USGS National Map Elevation Point Query Service",
      "Geocoding: OpenStreetMap Nominatim",
    ],
  };
}
