// USGS Elevation Point Query Service (free, no API key)
// https://epqs.nationalmap.gov/v1/json

export async function getElevation(lat: number, lng: number): Promise<number> {
  try {
    const params = new URLSearchParams({
      x: lng.toString(),
      y: lat.toString(),
      units: "Meters",
      output: "json",
    });

    const response = await fetch(
      `https://epqs.nationalmap.gov/v1/json?${params}`,
      { signal: AbortSignal.timeout(5000) }
    );

    if (!response.ok) return estimateElevation(lat, lng);

    const data = await response.json();
    const elevation = data?.value;

    if (elevation === undefined || elevation === null || elevation === -1000000) {
      return estimateElevation(lat, lng);
    }

    return Math.max(0, parseFloat(elevation));
  } catch {
    return estimateElevation(lat, lng);
  }
}

// Fallback: rough elevation estimate for SF based on known topography
// SF has a few major hills and a general east-west slope
function estimateElevation(lat: number, lng: number): number {
  // Key SF landmarks with known elevations
  const landmarks: { lat: number; lng: number; elevation: number }[] = [
    { lat: 37.7544, lng: -122.4477, elevation: 282 }, // Twin Peaks
    { lat: 37.7553, lng: -122.4567, elevation: 275 }, // Mt Sutro
    { lat: 37.7915, lng: -122.4051, elevation: 115 }, // Russian Hill
    { lat: 37.7925, lng: -122.4362, elevation: 115 }, // Pacific Heights
    { lat: 37.7605, lng: -122.4009, elevation: 90 },  // Potrero Hill
    { lat: 37.7389, lng: -122.4153, elevation: 100 }, // Bernal Heights
    { lat: 37.7599, lng: -122.4148, elevation: 25 },  // Mission (flat)
    { lat: 37.7785, lng: -122.3950, elevation: 5 },   // SOMA (flat)
    { lat: 37.8015, lng: -122.4368, elevation: 5 },   // Marina (flat)
    { lat: 37.7530, lng: -122.4930, elevation: 30 },  // Sunset (gentle slope)
    { lat: 37.7775, lng: -122.5050, elevation: 40 },  // Outer Richmond
    { lat: 37.7298, lng: -122.3868, elevation: 15 },  // Bayview
  ];

  // IDW interpolation from landmarks
  let weightedSum = 0;
  let weightSum = 0;

  for (const lm of landmarks) {
    const dist = Math.sqrt(
      Math.pow((lat - lm.lat) * 111000, 2) +
      Math.pow((lng - lm.lng) * 111000 * Math.cos(lat * Math.PI / 180), 2)
    );
    if (dist < 10) return lm.elevation;
    const weight = 1 / (dist * dist);
    weightedSum += weight * lm.elevation;
    weightSum += weight;
  }

  return Math.max(0, Math.round(weightedSum / weightSum));
}
