import { NextResponse } from "next/server";
import { neighborhoods } from "@/lib/neighborhoods";
import { annualSunHours } from "@/lib/solar";
import { idwInterpolate } from "@/lib/noaa-stations";
import { interpolateGHI, ghiToSunshineHours } from "@/lib/satellite-data";
import { terrainFogMultiplier, terrainWindMultiplier, terrainTempMultiplier, buildingDensityFactor, sunshineFraction, getLabel } from "@/lib/terrain-model";
import type { WeatherStation } from "@/lib/noaa-stations";

export async function GET() {
  const results = neighborhoods.map((n) => {
    const satGHI = interpolateGHI(n.lat, n.lng);
    const satHrs = ghiToSunshineHours(satGHI);
    const rawFog = idwInterpolate(n.lat, n.lng, (s: WeatherStation) => s.annualFogDays);
    const fogMult = terrainFogMultiplier(n.lat, n.lng, n.elevation);
    const fogDays = Math.round(rawFog * fogMult);
    const daylightHrs = annualSunHours(n.lat, n.lng);
    const terrainHrs = Math.round(daylightHrs * sunshineFraction(fogDays));
    const densityFactor = buildingDensityFactor(n.lat, n.lng);
    const sunHours = Math.round((satHrs * 0.7 + terrainHrs * 0.3) * densityFactor);
    const rawWind = idwInterpolate(n.lat, n.lng, (s: WeatherStation) => s.avgWindMph);
    const windMph = Math.round(rawWind * terrainWindMultiplier(n.lat, n.lng, n.elevation) * 10) / 10;
    const rawTemp = idwInterpolate(n.lat, n.lng, (s: WeatherStation) => s.avgTempVarianceF);
    const tempVar = Math.round(rawTemp * terrainTempMultiplier(n.lat, n.lng) * 10) / 10;

    const normSun = Math.min(100, Math.max(0, ((sunHours - 2200) / 1000) * 100));
    const normFog = Math.min(100, Math.max(0, ((200 - fogDays) / 180) * 100));
    const normWind = Math.min(100, Math.max(0, ((22 - windMph) / 15) * 100));
    const normTemp = tempVar < 7 ? Math.min(100, tempVar * 10) : Math.min(100, Math.max(0, ((18 - tempVar) / 11) * 100));

    const score = Math.max(0, Math.min(100, Math.round(
      normSun * 0.35 + normFog * 0.25 + normWind * 0.15 + normTemp * 0.15 + 50 * 0.10
    )));

    return {
      name: n.name,
      slug: n.slug,
      lat: n.lat,
      lng: n.lng,
      polygon: n.polygon,
      score,
      label: getLabel(score),
      sunHours,
      fogDays,
      windMph,
    };
  });

  results.sort((a, b) => b.score - a.score);

  return NextResponse.json(results, {
    headers: { "Cache-Control": "public, max-age=86400" },
  });
}
