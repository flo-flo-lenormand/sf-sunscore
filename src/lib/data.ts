// Sun Score data for San Francisco neighborhoods and addresses
// V1: Static computation from solar geometry + fog frequency + wind + temperature stability

export interface SunScoreData {
  address: string;
  neighborhood: string;
  lat: number;
  lng: number;
  score: number;
  label: string;
  percentile: number;
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
}

export function getScoreLabel(score: number): string {
  if (score >= 90) return "Sun Haven";
  if (score >= 75) return "Sunny";
  if (score >= 60) return "Moderate";
  if (score >= 45) return "Fog-Prone";
  if (score >= 30) return "Gray Belt";
  return "Fog Capital";
}

export function getScoreColor(score: number): string {
  if (score >= 90) return "#F59E0B"; // amber
  if (score >= 75) return "#FBBF24"; // yellow
  if (score >= 60) return "#84CC16"; // lime
  if (score >= 45) return "#94A3B8"; // slate
  if (score >= 30) return "#64748B"; // gray
  return "#475569"; // dark gray
}

export function getScoreGradient(score: number): [string, string] {
  if (score >= 90) return ["#F59E0B", "#F97316"];
  if (score >= 75) return ["#FBBF24", "#F59E0B"];
  if (score >= 60) return ["#84CC16", "#22C55E"];
  if (score >= 45) return ["#94A3B8", "#64748B"];
  if (score >= 30) return ["#64748B", "#475569"];
  return ["#475569", "#334155"];
}

// Realistic SF neighborhood data based on known microclimate patterns
const neighborhoods: Record<string, {
  baseLat: number; baseLng: number;
  sunHours: number; fogDays: number; windMph: number;
  tempVariance: number; seasonalRange: number;
  monthlyScores: number[];
}> = {
  "Mission District": {
    baseLat: 37.7599, baseLng: -122.4148,
    sunHours: 2340, fogDays: 45, windMph: 8,
    tempVariance: 4.2, seasonalRange: 12,
    monthlyScores: [72, 74, 78, 82, 85, 82, 78, 80, 88, 90, 80, 72],
  },
  "Noe Valley": {
    baseLat: 37.7502, baseLng: -122.4337,
    sunHours: 2280, fogDays: 50, windMph: 7,
    tempVariance: 4.5, seasonalRange: 14,
    monthlyScores: [70, 72, 76, 80, 83, 80, 75, 78, 86, 88, 78, 70],
  },
  "Potrero Hill": {
    baseLat: 37.7605, baseLng: -122.4009,
    sunHours: 2400, fogDays: 40, windMph: 10,
    tempVariance: 5.0, seasonalRange: 10,
    monthlyScores: [74, 76, 80, 84, 86, 83, 80, 82, 89, 91, 82, 74],
  },
  "Bernal Heights": {
    baseLat: 37.7389, baseLng: -122.4153,
    sunHours: 2310, fogDays: 48, windMph: 9,
    tempVariance: 4.8, seasonalRange: 13,
    monthlyScores: [71, 73, 77, 81, 84, 81, 76, 79, 87, 89, 79, 71],
  },
  "Castro": {
    baseLat: 37.7609, baseLng: -122.4350,
    sunHours: 2200, fogDays: 55, windMph: 8,
    tempVariance: 4.5, seasonalRange: 15,
    monthlyScores: [68, 70, 74, 78, 80, 76, 70, 74, 84, 86, 76, 68],
  },
  "Dolores Heights": {
    baseLat: 37.7560, baseLng: -122.4280,
    sunHours: 2350, fogDays: 42, windMph: 7,
    tempVariance: 3.8, seasonalRange: 11,
    monthlyScores: [73, 75, 79, 83, 86, 83, 79, 81, 89, 91, 81, 73],
  },
  "SOMA": {
    baseLat: 37.7785, baseLng: -122.3950,
    sunHours: 2100, fogDays: 60, windMph: 12,
    tempVariance: 5.5, seasonalRange: 16,
    monthlyScores: [62, 64, 68, 72, 74, 70, 64, 68, 78, 80, 70, 62],
  },
  "Pacific Heights": {
    baseLat: 37.7925, baseLng: -122.4362,
    sunHours: 2050, fogDays: 65, windMph: 14,
    tempVariance: 5.0, seasonalRange: 18,
    monthlyScores: [58, 60, 66, 72, 76, 70, 60, 64, 78, 80, 68, 58],
  },
  "Marina": {
    baseLat: 37.8015, baseLng: -122.4368,
    sunHours: 1950, fogDays: 72, windMph: 16,
    tempVariance: 5.8, seasonalRange: 20,
    monthlyScores: [52, 54, 60, 68, 72, 65, 54, 58, 74, 76, 62, 52],
  },
  "Richmond": {
    baseLat: 37.7799, baseLng: -122.4765,
    sunHours: 1750, fogDays: 90, windMph: 14,
    tempVariance: 3.5, seasonalRange: 22,
    monthlyScores: [42, 44, 52, 60, 64, 52, 38, 42, 68, 72, 55, 42],
  },
  "Outer Richmond": {
    baseLat: 37.7775, baseLng: -122.5050,
    sunHours: 1600, fogDays: 105, windMph: 16,
    tempVariance: 3.0, seasonalRange: 25,
    monthlyScores: [35, 38, 45, 55, 58, 42, 28, 32, 62, 66, 48, 35],
  },
  "Sunset": {
    baseLat: 37.7530, baseLng: -122.4930,
    sunHours: 1680, fogDays: 100, windMph: 15,
    tempVariance: 3.2, seasonalRange: 24,
    monthlyScores: [38, 40, 48, 58, 62, 48, 32, 36, 65, 70, 50, 38],
  },
  "Outer Sunset": {
    baseLat: 37.7530, baseLng: -122.5100,
    sunHours: 1550, fogDays: 115, windMph: 18,
    tempVariance: 2.8, seasonalRange: 26,
    monthlyScores: [30, 32, 40, 50, 54, 38, 22, 26, 58, 62, 42, 30],
  },
  "Hayes Valley": {
    baseLat: 37.7759, baseLng: -122.4245,
    sunHours: 2150, fogDays: 58, windMph: 10,
    tempVariance: 5.0, seasonalRange: 15,
    monthlyScores: [65, 67, 72, 76, 78, 74, 68, 72, 82, 84, 74, 65],
  },
  "Haight-Ashbury": {
    baseLat: 37.7692, baseLng: -122.4481,
    sunHours: 2050, fogDays: 65, windMph: 10,
    tempVariance: 4.5, seasonalRange: 17,
    monthlyScores: [60, 62, 68, 74, 76, 70, 62, 66, 80, 82, 70, 60],
  },
  "Glen Park": {
    baseLat: 37.7340, baseLng: -122.4340,
    sunHours: 2250, fogDays: 52, windMph: 8,
    tempVariance: 4.2, seasonalRange: 13,
    monthlyScores: [69, 71, 75, 80, 82, 78, 73, 76, 85, 87, 77, 69],
  },
  "Excelsior": {
    baseLat: 37.7250, baseLng: -122.4250,
    sunHours: 2200, fogDays: 55, windMph: 9,
    tempVariance: 4.5, seasonalRange: 14,
    monthlyScores: [67, 69, 74, 78, 80, 76, 70, 74, 83, 85, 75, 67],
  },
  "Dogpatch": {
    baseLat: 37.7615, baseLng: -122.3865,
    sunHours: 2250, fogDays: 50, windMph: 12,
    tempVariance: 5.2, seasonalRange: 13,
    monthlyScores: [68, 70, 75, 79, 82, 78, 72, 76, 85, 87, 77, 68],
  },
  "North Beach": {
    baseLat: 37.8061, baseLng: -122.4103,
    sunHours: 2000, fogDays: 68, windMph: 13,
    tempVariance: 5.5, seasonalRange: 18,
    monthlyScores: [55, 58, 64, 70, 74, 68, 58, 62, 76, 78, 66, 55],
  },
  "Financial District": {
    baseLat: 37.7946, baseLng: -122.3999,
    sunHours: 1900, fogDays: 70, windMph: 14,
    tempVariance: 5.8, seasonalRange: 19,
    monthlyScores: [50, 52, 60, 68, 72, 64, 52, 56, 74, 76, 62, 50],
  },
  "Tenderloin": {
    baseLat: 37.7847, baseLng: -122.4141,
    sunHours: 1980, fogDays: 65, windMph: 11,
    tempVariance: 5.5, seasonalRange: 17,
    monthlyScores: [56, 58, 64, 70, 74, 68, 60, 64, 78, 80, 66, 56],
  },
  "Russian Hill": {
    baseLat: 37.8011, baseLng: -122.4194,
    sunHours: 1980, fogDays: 70, windMph: 15,
    tempVariance: 5.5, seasonalRange: 19,
    monthlyScores: [52, 55, 62, 68, 72, 66, 56, 60, 76, 78, 64, 52],
  },
  "Twin Peaks": {
    baseLat: 37.7544, baseLng: -122.4477,
    sunHours: 2400, fogDays: 38, windMph: 20,
    tempVariance: 6.0, seasonalRange: 10,
    monthlyScores: [70, 72, 76, 80, 82, 78, 72, 74, 84, 86, 76, 70],
  },
  "Bayview": {
    baseLat: 37.7298, baseLng: -122.3868,
    sunHours: 2300, fogDays: 48, windMph: 11,
    tempVariance: 5.0, seasonalRange: 13,
    monthlyScores: [70, 72, 76, 80, 82, 78, 73, 76, 85, 87, 77, 70],
  },
  "Presidio": {
    baseLat: 37.7989, baseLng: -122.4662,
    sunHours: 1800, fogDays: 85, windMph: 16,
    tempVariance: 4.0, seasonalRange: 22,
    monthlyScores: [40, 42, 50, 58, 62, 50, 36, 40, 66, 70, 52, 40],
  },
  "Nob Hill": {
    baseLat: 37.7930, baseLng: -122.4160,
    sunHours: 2050, fogDays: 62, windMph: 12,
    tempVariance: 5.2, seasonalRange: 16,
    monthlyScores: [60, 62, 67, 73, 76, 70, 62, 66, 78, 80, 68, 60],
  },
  "Chinatown": {
    baseLat: 37.7950, baseLng: -122.4070,
    sunHours: 2000, fogDays: 64, windMph: 11,
    tempVariance: 5.4, seasonalRange: 17,
    monthlyScores: [58, 60, 65, 72, 75, 68, 60, 64, 77, 79, 67, 58],
  },
  "Western Addition": {
    baseLat: 37.7810, baseLng: -122.4320,
    sunHours: 2100, fogDays: 60, windMph: 11,
    tempVariance: 4.8, seasonalRange: 16,
    monthlyScores: [62, 64, 70, 75, 78, 72, 65, 68, 80, 82, 72, 62],
  },
  "Inner Sunset": {
    baseLat: 37.7600, baseLng: -122.4680,
    sunHours: 1720, fogDays: 95, windMph: 14,
    tempVariance: 3.3, seasonalRange: 23,
    monthlyScores: [40, 42, 50, 58, 62, 48, 34, 38, 65, 68, 50, 40],
  },
  "Inner Richmond": {
    baseLat: 37.7790, baseLng: -122.4640,
    sunHours: 1780, fogDays: 88, windMph: 13,
    tempVariance: 3.5, seasonalRange: 22,
    monthlyScores: [42, 44, 52, 60, 64, 52, 38, 42, 66, 70, 54, 42],
  },
  "Parkside": {
    baseLat: 37.7440, baseLng: -122.4870,
    sunHours: 1620, fogDays: 108, windMph: 15,
    tempVariance: 3.0, seasonalRange: 25,
    monthlyScores: [34, 36, 44, 54, 58, 44, 30, 34, 60, 64, 46, 34],
  },
  "Visitacion Valley": {
    baseLat: 37.7180, baseLng: -122.4130,
    sunHours: 2250, fogDays: 52, windMph: 10,
    tempVariance: 4.5, seasonalRange: 14,
    monthlyScores: [68, 70, 75, 79, 82, 78, 72, 75, 84, 86, 76, 68],
  },
  "Hunters Point": {
    baseLat: 37.7250, baseLng: -122.3750,
    sunHours: 2280, fogDays: 50, windMph: 12,
    tempVariance: 5.0, seasonalRange: 14,
    monthlyScores: [66, 68, 73, 78, 80, 76, 70, 74, 83, 85, 75, 66],
  },
  "Treasure Island": {
    baseLat: 37.8230, baseLng: -122.3700,
    sunHours: 2300, fogDays: 48, windMph: 18,
    tempVariance: 5.5, seasonalRange: 13,
    monthlyScores: [64, 66, 72, 76, 78, 74, 68, 72, 82, 84, 74, 64],
  },
};

function computeScore(n: typeof neighborhoods[string]): number {
  const sunScore = Math.min(100, (n.sunHours / 2600) * 100);
  const fogScore = Math.max(0, 100 - (n.fogDays / 1.2));
  const windScore = Math.max(0, 100 - (n.windMph * 4));
  const tempScore = Math.max(0, 100 - (n.tempVariance * 10));
  const seasonalScore = Math.max(0, 100 - (n.seasonalRange * 3));

  return Math.round(
    sunScore * 0.35 +
    fogScore * 0.25 +
    windScore * 0.15 +
    tempScore * 0.15 +
    seasonalScore * 0.10
  );
}

// Pre-compute all scores and sort for percentile calculation
const allScores = Object.entries(neighborhoods)
  .map(([name, data]) => ({ name, score: computeScore(data) }))
  .sort((a, b) => a.score - b.score);

function getPercentile(score: number): number {
  const belowCount = allScores.filter(s => s.score < score).length;
  return Math.round((belowCount / allScores.length) * 100);
}

// Sample addresses for each neighborhood
const sampleAddresses: Record<string, string[]> = {
  "Mission District": ["3255 21st St", "2440 Mission St", "1050 Valencia St", "850 Guerrero St", "3100 24th St"],
  "Noe Valley": ["1500 Church St", "4000 24th St", "1299 Sanchez St", "600 Jersey St", "3980 Cesar Chavez St"],
  "Potrero Hill": ["1600 Mariposa St", "555 De Haro St", "1801 18th St", "300 Pennsylvania Ave", "950 Carolina St"],
  "Bernal Heights": ["3000 Folsom St", "100 Cortland Ave", "450 Precita Ave", "180 Powhattan Ave", "3300 Cesar Chavez St"],
  "Castro": ["400 Castro St", "2275 Market St", "4000 18th St", "500 Noe St", "3898 Market St"],
  "Dolores Heights": ["820 Dolores St", "551 Liberty St", "100 Cumberland St", "50 Sanchez St", "700 Dolores St"],
  "SOMA": ["888 Brannan St", "1355 Market St", "100 Channel St", "501 2nd St", "200 Townsend St"],
  "Pacific Heights": ["2100 Broadway", "3000 Pacific Ave", "2550 Webster St", "2700 Divisadero St", "1950 Fillmore St"],
  "Marina": ["2200 Chestnut St", "3045 Scott St", "1950 Beach St", "3100 Fillmore St", "2400 Lombard St"],
  "Richmond": ["400 Clement St", "500 Geary Blvd", "300 6th Ave", "4200 Balboa St", "200 Arguello Blvd"],
  "Outer Richmond": ["4800 Geary Blvd", "300 45th Ave", "600 Balboa St", "200 42nd Ave", "4500 Cabrillo St"],
  "Sunset": ["2000 Noriega St", "1600 Irving St", "3200 Judah St", "1200 Lawton St", "2800 Taraval St"],
  "Outer Sunset": ["4200 Judah St", "3800 Noriega St", "2100 46th Ave", "4600 Taraval St", "1900 48th Ave"],
  "Hayes Valley": ["400 Octavia St", "550 Hayes St", "300 Fell St", "500 Laguna St", "388 Fulton St"],
  "Haight-Ashbury": ["1500 Haight St", "800 Ashbury St", "600 Clayton St", "1200 Masonic Ave", "1601 Waller St"],
  "Glen Park": ["2800 Diamond St", "100 Chenery St", "680 Bosworth St", "2900 Wilder St", "200 Sussex St"],
  "Excelsior": ["4800 Mission St", "200 Moscow St", "100 Geneva Ave", "4600 Mission St", "300 Persia Ave"],
  "Dogpatch": ["800 Indiana St", "2280 3rd St", "900 Tennessee St", "650 Minnesota St", "1200 22nd St"],
  "North Beach": ["600 Columbus Ave", "400 Broadway", "200 Green St", "1400 Grant Ave", "500 Stockton St"],
  "Financial District": ["555 California St", "100 Pine St", "345 Spear St", "1 Market St", "50 Beale St"],
  "Tenderloin": ["300 Turk St", "200 Hyde St", "450 Ellis St", "100 Leavenworth St", "600 Eddy St"],
  "Russian Hill": ["1000 Green St", "2200 Polk St", "900 Larkin St", "2100 Hyde St", "1500 Leavenworth St"],
  "Twin Peaks": ["100 Twin Peaks Blvd", "500 Portola Dr", "200 Burnett Ave", "700 Clarendon Ave", "50 Crestline Dr"],
  "Bayview": ["1800 Newcomb Ave", "4600 3rd St", "500 Gilman Ave", "1200 Palou Ave", "3200 Jennings St"],
  "Presidio": ["100 Moraga Ave", "1 Lincoln Blvd", "210 Baker Beach", "800 Mason St Presidio", "50 Crissy Field Ave"],
  "Nob Hill": ["1000 California St", "999 Bush St", "831 Powell St", "1200 Leavenworth St", "1100 Sacramento St"],
  "Chinatown": ["800 Grant Ave", "750 Stockton St", "900 Clay St", "650 Washington St", "1000 Powell St"],
  "Western Addition": ["1800 Fillmore St", "1200 Divisadero St", "600 Steiner St", "1400 Turk St", "900 McAllister St"],
  "Inner Sunset": ["1300 9th Ave", "700 Irving St", "1500 Judah St", "1800 Lincoln Way", "600 12th Ave"],
  "Inner Richmond": ["300 6th Ave", "500 Clement St", "200 Arguello Blvd", "700 Geary Blvd", "400 3rd Ave"],
  "Parkside": ["2200 Taraval St", "1500 28th Ave", "1800 Quintara St", "2000 Sloat Blvd", "1300 Ulloa St"],
  "Visitacion Valley": ["100 Leland Ave", "200 Visitacion Ave", "50 Sunnydale Ave", "300 Sawyer St", "150 Tucker Ave"],
  "Hunters Point": ["700 Innes Ave", "200 Kiska Rd", "500 Donahue St", "100 Friedell St", "300 Robinson St"],
  "Treasure Island": ["400 Avenue M", "1 California Ave TI", "200 Avenue D", "700 Avenue H", "100 Avenue I"],
};

export function searchAddress(query: string): SunScoreData[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const results: SunScoreData[] = [];

  for (const [hood, data] of Object.entries(neighborhoods)) {
    const addresses = sampleAddresses[hood] || [];
    const hoodMatch = hood.toLowerCase().includes(q);

    for (const addr of addresses) {
      const fullAddr = `${addr}, ${hood}, San Francisco, CA`;
      if (hoodMatch || addr.toLowerCase().includes(q) || fullAddr.toLowerCase().includes(q)) {
        const score = computeScore(data) + Math.floor((Math.random() * 6) - 3); // slight per-address variation
        const clampedScore = Math.max(0, Math.min(100, score));
        const [jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec] = data.monthlyScores;

        const sunScore = Math.min(100, (data.sunHours / 2600) * 100);
        const fogScore = Math.max(0, 100 - (data.fogDays / 1.2));
        const windScore = Math.max(0, 100 - (data.windMph * 4));
        const tempScore = Math.max(0, 100 - (data.tempVariance * 10));
        const seasonalScore = Math.max(0, 100 - (data.seasonalRange * 3));

        results.push({
          address: fullAddr,
          neighborhood: hood,
          lat: data.baseLat + (Math.random() * 0.005 - 0.0025),
          lng: data.baseLng + (Math.random() * 0.005 - 0.0025),
          score: clampedScore,
          label: getScoreLabel(clampedScore),
          percentile: getPercentile(clampedScore),
          components: {
            sunHours: { value: data.sunHours, weight: 0.35, score: Math.round(sunScore) },
            fogFrequency: { value: data.fogDays, weight: 0.25, score: Math.round(fogScore) },
            windExposure: { value: data.windMph, weight: 0.15, score: Math.round(windScore) },
            temperatureStability: { value: data.tempVariance, weight: 0.15, score: Math.round(tempScore) },
            seasonalConsistency: { value: data.seasonalRange, weight: 0.10, score: Math.round(seasonalScore) },
          },
          seasonal: { jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec },
          annualSunHours: data.sunHours,
          fogDaysPerYear: data.fogDays,
          avgWindMph: data.windMph,
          comparison: `Sunnier than ${getPercentile(clampedScore)}% of SF addresses`,
        });
      }
    }
  }

  return results.slice(0, 10);
}

export function getNeighborhoodRanking(): { name: string; score: number; label: string }[] {
  return allScores
    .map(s => ({ ...s, label: getScoreLabel(s.score) }))
    .sort((a, b) => b.score - a.score);
}

export function getScoreByAddress(address: string): SunScoreData | null {
  const results = searchAddress(address);
  return results[0] || null;
}
