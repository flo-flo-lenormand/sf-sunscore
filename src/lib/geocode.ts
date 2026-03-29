// Geocoding via OpenStreetMap Nominatim (free, no API key)
// Rate limit: 1 request/second, include User-Agent

export interface GeocodingResult {
  lat: number;
  lng: number;
  displayName: string;
  neighborhood: string;
  city: string;
}

// SF bounding box for filtering results
const SF_BOUNDS = {
  south: 37.70,
  north: 37.82,
  west: -122.52,
  east: -122.35,
};

function isInSF(lat: number, lng: number): boolean {
  return (
    lat >= SF_BOUNDS.south &&
    lat <= SF_BOUNDS.north &&
    lng >= SF_BOUNDS.west &&
    lng <= SF_BOUNDS.east
  );
}

// Extract neighborhood from Nominatim response
function extractNeighborhood(address: Record<string, string>): string {
  return (
    address.neighbourhood ||
    address.suburb ||
    address.quarter ||
    address.city_district ||
    "San Francisco"
  );
}

export async function geocodeAddress(query: string): Promise<GeocodingResult | null> {
  // Append SF context if not already present
  const searchQuery = query.toLowerCase().includes("san francisco") || query.toLowerCase().includes(", sf")
    ? query
    : `${query}, San Francisco, CA`;

  const params = new URLSearchParams({
    q: searchQuery,
    format: "json",
    addressdetails: "1",
    limit: "1",
    countrycodes: "us",
  });

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?${params}`,
      {
        headers: {
          "User-Agent": "SunScore/1.0 (github.com/sunscore)",
        },
      }
    );

    if (!response.ok) return null;

    const results = await response.json();
    if (!results || results.length === 0) return null;

    const result = results[0];
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);

    if (!isInSF(lat, lng)) return null;

    return {
      lat,
      lng,
      displayName: result.display_name,
      neighborhood: extractNeighborhood(result.address || {}),
      city: "San Francisco",
    };
  } catch {
    return null;
  }
}

// Reverse geocode to get neighborhood name from coordinates
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lon: lng.toString(),
      format: "json",
      addressdetails: "1",
      zoom: "16",
    });

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?${params}`,
      {
        headers: {
          "User-Agent": "SunScore/1.0 (github.com/sunscore)",
        },
      }
    );

    if (!response.ok) return "San Francisco";

    const result = await response.json();
    return extractNeighborhood(result.address || {});
  } catch {
    return "San Francisco";
  }
}
