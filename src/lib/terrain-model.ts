// Terrain-aware climate model for San Francisco
// Models fog, wind, and microclimate effects based on terrain features.

// Twin Peaks ridge: approximate N-S line through SF's central spine
const RIDGE_POINTS = [
  { lat: 37.800, lng: -122.450 },  // Presidio Heights
  { lat: 37.785, lng: -122.448 },  // Lone Mountain
  { lat: 37.770, lng: -122.452 },  // Mt Sutro area
  { lat: 37.756, lng: -122.448 },  // Twin Peaks
  { lat: 37.742, lng: -122.437 },  // Diamond Heights
  { lat: 37.734, lng: -122.433 },  // Glen Park ridge
  { lat: 37.720, lng: -122.430 },  // Excelsior ridge
];

export function ridgeLngAtLat(lat: number): number {
  for (let i = 0; i < RIDGE_POINTS.length - 1; i++) {
    const p1 = RIDGE_POINTS[i];
    const p2 = RIDGE_POINTS[i + 1];
    if (lat <= p1.lat && lat >= p2.lat) {
      const t = (lat - p2.lat) / (p1.lat - p2.lat);
      return p2.lng + t * (p1.lng - p2.lng);
    }
  }
  if (lat > RIDGE_POINTS[0].lat) return RIDGE_POINTS[0].lng;
  return RIDGE_POINTS[RIDGE_POINTS.length - 1].lng;
}

// Golden Gate fog corridor: fog pours through the Gate into Marina,
// Pacific Heights, Cow Hollow. Fan-shaped, strongest at Gate mouth.
export function goldenGateFogFloor(lat: number, lng: number): number {
  const gateLat = 37.808;
  const gateLng = -122.475;
  const corridorReach = 0.06;

  const lngOffset = lng - gateLng;
  if (lngOffset < 0 || lngOffset > corridorReach) return 0;

  const progress = lngOffset / corridorReach;
  const corridorWidth = 0.005 + 0.025 * progress;

  const latDist = Math.abs(lat - gateLat);
  if (latDist > corridorWidth) return 0;

  const eastDecay = 1 - progress * 0.6;
  const latDecay = 1 - (latDist / corridorWidth) * 0.7;
  return 0.9 + eastDecay * latDecay * 1.3;
}

export function terrainFogMultiplier(lat: number, lng: number, elevationM: number): number {
  const ridgeLng = ridgeLngAtLat(lat);
  const offset = lng - ridgeLng;
  const elevationReduction = elevationM > 150 ? 0.5 : elevationM > 80 ? 0.7 : 1.0;

  let baseMult: number;
  if (offset > 0.005) {
    baseMult = Math.max(0.35, 0.65 - offset * 5);
  } else if (offset < -0.005) {
    baseMult = Math.min(3.0, 1.65 + Math.abs(offset) * 16);
  } else {
    baseMult = 0.85;
  }

  baseMult = Math.max(baseMult, goldenGateFogFloor(lat, lng));
  return baseMult * elevationReduction;
}

// --- Wind exposure model ---
// SF wind patterns are driven by terrain. Key factors:
// 1. Hilltops and ridges are windier (Twin Peaks, Treasure Island)
// 2. The western coast gets Pacific winds
// 3. The Gap (Alemany Gap between Twin Peaks and San Bruno Mountain)
//    funnels wind into certain southern neighborhoods
// 4. Downtown valleys and dense areas are sheltered
// Returns a multiplier on the IDW-interpolated wind speed.

export function terrainWindMultiplier(lat: number, lng: number, elevationM: number): number {
  let mult = 1.0;

  // Elevation effect: hilltops and ridges are windier
  if (elevationM > 200) mult *= 1.8;       // Twin Peaks summit, Mt Davidson
  else if (elevationM > 100) mult *= 1.3;  // Bernal Hill, Potrero Hill top
  else if (elevationM > 60) mult *= 1.1;   // moderate hills

  // Waterfront exposure: bay and ocean-facing areas get more wind
  if (lng > -122.395 && lat > 37.75) mult *= 1.2;  // eastern waterfront
  if (lng < -122.49) mult *= 1.35;                  // western ocean

  // Treasure Island: famously one of the windiest spots
  if (lat > 37.815 && lng > -122.38) mult *= 2.0;

  // Mission corridor: sheltered valley between hills
  if (lat > 37.749 && lat < 37.77 && lng > -122.425 && lng < -122.41) mult *= 0.85;

  return mult;
}

// --- Building density sun reduction ---
// Dense downtown areas lose sun hours to building shadows. We can't model
// individual buildings, but we know which areas have tall, dense construction.
// Returns a multiplier on effective sun hours (< 1.0 = less sun).
export function buildingDensityFactor(lat: number, lng: number): number {
  // Financial District: dense high-rises, deep street canyons
  if (lat > 37.788 && lat < 37.800 && lng > -122.405 && lng < -122.390)
    return 0.88;

  // Tenderloin: dense mid-rises, narrow streets
  if (lat > 37.780 && lat < 37.789 && lng > -122.420 && lng < -122.410)
    return 0.90;

  // Chinatown: dense, narrow alleys
  if (lat > 37.791 && lat < 37.800 && lng > -122.413 && lng < -122.400)
    return 0.90;

  // SOMA: mixed, some tall buildings but wider streets
  if (lat > 37.773 && lat < 37.788 && lng > -122.410 && lng < -122.390)
    return 0.93;

  // Nob Hill: some tall buildings on top
  if (lat > 37.789 && lat < 37.797 && lng > -122.420 && lng < -122.410)
    return 0.93;

  return 1.0;  // most neighborhoods: no density penalty
}

// --- Temperature variance model ---
// Areas near the bay/ocean have more stable temps (maritime effect).
// Inland/sheltered areas have wider swings.
export function terrainTempMultiplier(lat: number, lng: number): number {
  // Distance from the coast/bay
  const coastDist = Math.min(
    Math.abs(lng - (-122.51)),  // ocean
    Math.abs(lng - (-122.38)) + Math.abs(lat - 37.79) * 0.5,  // bay
  );

  // Closer to water = more stable temps (lower variance multiplier)
  if (coastDist < 0.02) return 0.8;
  if (coastDist < 0.05) return 0.9;
  if (coastDist > 0.10) return 1.15;
  return 1.0;
}

// Sunshine model: convert fog days to sunshine fraction.
// Calibrated so SFO produces ~66% sunshine (NOAA Climate Normals).
const BASE_SUNSHINE_FRACTION = 0.71;
const FOG_DAY_IMPACT = 0.00118;

export function sunshineFraction(adjustedFogDays: number): number {
  return Math.max(0.30, Math.min(0.80, BASE_SUNSHINE_FRACTION - FOG_DAY_IMPACT * adjustedFogDays));
}

// Score labels
export function getLabel(score: number): string {
  if (score >= 90) return "Sun Haven";
  if (score >= 75) return "Sunny";
  if (score >= 60) return "Moderate";
  if (score >= 45) return "Fog-Prone";
  if (score >= 30) return "Gray Belt";
  return "Fog Capital";
}
