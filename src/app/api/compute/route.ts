import { NextRequest, NextResponse } from "next/server";
import { annualSunHours, monthlySunHours } from "@/lib/solar";
import { idwInterpolate, idwInterpolateMonthly } from "@/lib/noaa-stations";
import { interpolateGHI, ghiToSunshineHours } from "@/lib/satellite-data";
import { terrainFogMultiplier, terrainWindMultiplier, terrainTempMultiplier, buildingDensityFactor, sunshineFraction, ridgeLngAtLat, getLabel } from "@/lib/terrain-model";
import type { WeatherStation } from "@/lib/noaa-stations";

// Pure computation endpoint - takes lat/lng/elevation, returns score
// No external API calls needed (geocoding + elevation resolved client-side)

// --- Score normalization ---
function normalizeSunHours(hours: number): number {
  return Math.min(100, Math.max(0, ((hours - 2200) / 1000) * 100));
}

function normalizeFogDays(days: number): number {
  return Math.min(100, Math.max(0, ((200 - days) / 180) * 100));
}

function normalizeWind(mph: number): number {
  return Math.min(100, Math.max(0, ((22 - mph) / 15) * 100));
}

function normalizeTemperature(variance: number): number {
  if (variance < 7) return Math.min(100, Math.max(0, variance * 10));
  return Math.min(100, Math.max(0, ((18 - variance) / 11) * 100));
}

function normalizeSeasonalConsistency(monthlyScores: number[]): number {
  const range = Math.max(...monthlyScores) - Math.min(...monthlyScores);
  return Math.min(100, Math.max(0, ((45 - range) / 35) * 100));
}

function estimatePercentile(score: number): number {
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

function computeMonthlyScores(
  monthlySun: number[],
  monthlyFog: number[],
  monthlyWind: number[],
  monthlyTemp: number[],
  fogMultiplier: number
): number[] {
  const monthMaxHours = [290, 290, 360, 390, 430, 435, 440, 410, 370, 340, 290, 275];
  return Array.from({ length: 12 }, (_, i) => {
    const adjustedFogDays = monthlyFog[i] * fogMultiplier;
    const sunshine = sunshineFraction(adjustedFogDays * 12);
    const effectiveHours = monthlySun[i] * sunshine;
    const sunScore = Math.min(100, (effectiveHours / (monthMaxHours[i] * 0.7)) * 100);
    const fogScore = Math.min(100, Math.max(0, 100 - (adjustedFogDays / 20) * 100));
    const windScore = Math.min(100, Math.max(0, ((22 - monthlyWind[i]) / 15) * 100));
    const tempScore = monthlyTemp[i] < 7
      ? monthlyTemp[i] * 10
      : Math.min(100, Math.max(0, ((18 - monthlyTemp[i]) / 11) * 100));
    return Math.round(
      sunScore * 0.35 + fogScore * 0.25 + windScore * 0.15 + tempScore * 0.15 + 50 * 0.10
    );
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const lat = parseFloat(searchParams.get("lat") || "");
  const lng = parseFloat(searchParams.get("lng") || "");
  const elevation = parseFloat(searchParams.get("elevation") || "0");
  const address = searchParams.get("address") || "";
  const neighborhood = searchParams.get("neighborhood") || "";

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ error: "Missing lat/lng parameters" }, { status: 400 });
  }

  if (lat < 37.70 || lat > 37.82 || lng < -122.52 || lng > -122.35) {
    return NextResponse.json({ error: "Location is outside San Francisco. Only SF is supported in V1." }, { status: 400 });
  }

  // PRIMARY: Satellite-measured solar radiation (NREL NSRDB PSM3, 4km resolution)
  const satelliteGHI = interpolateGHI(lat, lng);
  const satelliteSunHours = ghiToSunshineHours(satelliteGHI);

  // SECONDARY: Terrain-adjusted fog model for sub-satellite-cell refinement
  const rawFogDays = idwInterpolate(lat, lng, (s: WeatherStation) => s.annualFogDays);
  const fogMult = terrainFogMultiplier(lat, lng, elevation);
  const adjustedFogDays = Math.round(rawFogDays * fogMult);

  // Blend: 70% satellite (measured) + 30% terrain model (local detail)
  const daylightHours = annualSunHours(lat, lng);
  const terrainSunHours = Math.round(daylightHours * sunshineFraction(adjustedFogDays));
  const densityFactor = buildingDensityFactor(lat, lng);
  const sunHours = Math.round((satelliteSunHours * 0.7 + terrainSunHours * 0.3) * densityFactor);
  const monthSun = monthlySunHours(lat, lng);

  const rawWind = idwInterpolate(lat, lng, (s: WeatherStation) => s.avgWindMph);
  const windMph = Math.round(rawWind * terrainWindMultiplier(lat, lng, elevation) * 10) / 10;
  const rawTemp = idwInterpolate(lat, lng, (s: WeatherStation) => s.avgTempVarianceF);
  const tempVariance = Math.round(rawTemp * terrainTempMultiplier(lat, lng) * 10) / 10;

  const monthlyFog = idwInterpolateMonthly(lat, lng, (s: WeatherStation) => s.monthlyFogDays);
  const monthlyWind = idwInterpolateMonthly(lat, lng, (s: WeatherStation) => s.monthlyAvgWindMph);
  const monthlyTemp = idwInterpolateMonthly(lat, lng, (s: WeatherStation) => s.monthlyTempRangeF);

  const sunScore = Math.round(normalizeSunHours(sunHours));
  const fogScore = Math.round(normalizeFogDays(adjustedFogDays));
  const windScore = Math.round(normalizeWind(windMph));
  const tempScore = Math.round(normalizeTemperature(tempVariance));

  const monthlyScores = computeMonthlyScores(monthSun, monthlyFog, monthlyWind, monthlyTemp, fogMult);
  const seasonalScore = Math.round(normalizeSeasonalConsistency(monthlyScores));

  const totalScore = Math.max(0, Math.min(100, Math.round(
    sunScore * 0.35 + fogScore * 0.25 + windScore * 0.15 + tempScore * 0.15 + seasonalScore * 0.10
  )));
  const percentile = estimatePercentile(totalScore);

  // Confidence interval
  const nearestStationDist = Math.min(
    ...([37.619, 37.718, 37.514, 37.512, 37.659, 37.992, 37.461, 38.208].map((sLat, i) => {
      const sLngs = [-122.375, -122.233, -122.500, -122.248, -122.121, -122.053, -122.115, -122.280];
      return Math.sqrt((lat - sLat) ** 2 + (lng - sLngs[i]) ** 2);
    }))
  );
  const distUncertainty = Math.round(5 + nearestStationDist * 20);
  const ridgeLng = ridgeLngAtLat(lat);
  const ridgeProximity = Math.abs(lng - ridgeLng);
  const terrainUncertainty = ridgeProximity < 0.01 ? 3 : 0;
  const margin = Math.min(12, distUncertainty + terrainUncertainty);
  const scoreLow = Math.max(0, totalScore - margin);
  const scoreHigh = Math.min(100, totalScore + margin);

  const [jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec] = monthlyScores;

  return NextResponse.json({
    score: totalScore,
    scoreRange: { low: scoreLow, high: scoreHigh, margin },
    label: getLabel(totalScore),
    percentile,
    address: address || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
    neighborhood: neighborhood || "San Francisco",
    lat, lng,
    elevation: Math.round(elevation),
    components: {
      sunHours: { value: sunHours, weight: 0.35, score: sunScore, source: "measured" },
      fogFrequency: { value: adjustedFogDays, weight: 0.25, score: fogScore, source: "modeled" },
      windExposure: { value: windMph, weight: 0.15, score: windScore, source: "measured" },
      temperatureStability: { value: tempVariance, weight: 0.15, score: tempScore, source: "measured" },
      seasonalConsistency: { value: Math.max(...monthlyScores) - Math.min(...monthlyScores), weight: 0.10, score: seasonalScore, source: "computed" },
    },
    seasonal: { jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec },
    annualSunHours: sunHours,
    fogDaysPerYear: adjustedFogDays,
    avgWindMph: windMph,
    comparison: `Sunnier than ${percentile}% of SF addresses`,
    confidence: {
      level: margin <= 6 ? "high" : margin <= 9 ? "moderate" : "low",
      margin,
      nearestStationKm: Math.round(nearestStationDist * 111),
      note: margin <= 6
        ? "Close to weather stations with direct observations"
        : "Far from stations; score relies more on terrain modeling",
    },
    dataSources: {
      measured: [
        "Solar radiation: NREL NSRDB PSM3 satellite observations at 4km resolution (20 calibration points across SF)",
        "Wind speed and temperature: 10 years of hourly METAR observations from 8 Bay Area ASOS stations (2014-2024)",
        "Daylight hours: NREL Solar Position Algorithm (deterministic astronomical calculation)",
        "Elevation: USGS National Map Elevation Point Query Service",
      ],
      modeled: [
        "Fog frequency: IDW spatial interpolation from airport stations, adjusted by Twin Peaks ridge terrain model",
        "Sunshine hours: 70% satellite-measured + 30% terrain-model refinement for sub-grid-cell detail",
      ],
      limitations: [
        "No weather stations exist within San Francisco city limits; all 8 stations are at airports outside the city",
        "Fog estimates use a terrain model based on the Twin Peaks ridgeline and Golden Gate corridor - accurate to the neighborhood level, not the block level",
        "Score precision is \u00b1" + margin + " points; differences smaller than that are not meaningful",
        "Building shadows, street-level wind tunnels, and micro-terrain are not captured",
      ],
    },
  }, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
