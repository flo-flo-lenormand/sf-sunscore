// REAL NOAA weather station data for the San Francisco Bay Area
// Generated from Iowa Environmental Mesonet ASOS data (2014-2024)
// 8 stations, 10 years of hourly METAR observations
// Source: https://mesonet.agron.iastate.edu/request/download.phtml

export interface WeatherStation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  elevation: number;
  annualFogDays: number;
  avgWindMph: number;
  avgTempVarianceF: number;
  monthlyFogDays: number[];
  monthlyAvgWindMph: number[];
  monthlyTempRangeF: number[];
}

export const stations: WeatherStation[] = [
  {
    id: "KSFO",
    name: "San Francisco International Airport",
    lat: 37.619, lng: -122.3749, elevation: 4,
    annualFogDays: 10,
    avgWindMph: 10.3,
    avgTempVarianceF: 13.9,
    monthlyFogDays: [2.6, 0.7, 0.5, 0.1, 1.0, 0.2, 0.1, 0.5, 0.7, 0.8, 1.3, 2.0],
    monthlyAvgWindMph: [6.6, 8.9, 9.9, 12.5, 13.4, 13.5, 12.9, 11.9, 11.0, 8.8, 6.8, 6.9],
    monthlyTempRangeF: [11.2, 13.4, 13.0, 14.1, 14.0, 15.5, 14.8, 14.5, 15.7, 16.5, 13.4, 10.7],
  },
  {
    id: "KOAK",
    name: "Oakland International Airport",
    lat: 37.7178, lng: -122.233, elevation: 2,
    annualFogDays: 34,
    avgWindMph: 8.3,
    avgTempVarianceF: 15.3,
    monthlyFogDays: [4.0, 1.6, 1.1, 1.2, 3.2, 2.7, 3.3, 3.9, 3.4, 2.5, 3.1, 3.9],
    monthlyAvgWindMph: [6.2, 7.6, 8.6, 9.7, 10.8, 10.2, 10.0, 9.4, 8.2, 6.7, 5.9, 6.3],
    monthlyTempRangeF: [13.9, 16.0, 14.8, 15.3, 14.3, 15.3, 13.9, 13.9, 16.7, 19.0, 16.9, 13.9],
  },
  {
    id: "KHAF",
    name: "Half Moon Bay Airport",
    lat: 37.5136, lng: -122.4996, elevation: 20,
    annualFogDays: 178,
    avgWindMph: 7.4,
    avgTempVarianceF: 12.1,
    monthlyFogDays: [10.5, 7.4, 10.4, 12.4, 17.3, 19.7, 24.1, 23.4, 19.5, 13.2, 10.0, 9.8],
    monthlyAvgWindMph: [7.0, 8.4, 8.3, 8.8, 8.4, 8.0, 7.0, 6.5, 6.5, 6.0, 6.3, 7.0],
    monthlyTempRangeF: [14.0, 14.6, 12.6, 11.2, 8.9, 9.2, 7.5, 8.5, 12.2, 16.3, 16.2, 13.6],
  },
  {
    id: "KSQL",
    name: "San Carlos Airport",
    lat: 37.5119, lng: -122.2483, elevation: 1,
    annualFogDays: 18,
    avgWindMph: 4.6,
    avgTempVarianceF: 12.5,
    monthlyFogDays: [2.2, 1.5, 0.7, 1.1, 0.8, 1.2, 1.1, 1.6, 1.2, 0.9, 1.4, 3.8],
    monthlyAvgWindMph: [3.1, 4.2, 4.3, 5.4, 6.3, 6.1, 5.9, 5.6, 4.6, 3.3, 3.1, 3.2],
    monthlyTempRangeF: [10.7, 11.7, 11.9, 12.8, 11.3, 13.5, 12.5, 13.7, 14.4, 14.8, 12.8, 10.6],
  },
  {
    id: "KHWD",
    name: "Hayward Executive Airport",
    lat: 37.6588, lng: -122.1212, elevation: 14,
    annualFogDays: 34,
    avgWindMph: 6.8,
    avgTempVarianceF: 16.1,
    monthlyFogDays: [3.7, 1.5, 1.1, 1.9, 4.7, 2.8, 3.2, 3.8, 2.5, 2.8, 2.5, 3.1],
    monthlyAvgWindMph: [5.3, 6.3, 7.0, 7.9, 8.8, 8.4, 8.2, 7.6, 6.7, 5.5, 4.9, 5.5],
    monthlyTempRangeF: [14.3, 16.5, 15.5, 16.0, 15.1, 16.9, 16.3, 15.9, 17.5, 19.0, 16.3, 14.1],
  },
  {
    id: "KCCR",
    name: "Concord Buchanan Field",
    lat: 37.9916, lng: -122.0526, elevation: 7,
    annualFogDays: 23,
    avgWindMph: 7.2,
    avgTempVarianceF: 22.9,
    monthlyFogDays: [6.6, 2.0, 1.2, 0.5, 0.2, 0.0, 0.2, 0.3, 0.6, 0.3, 2.5, 8.2],
    monthlyAvgWindMph: [4.7, 5.8, 6.5, 7.8, 9.7, 10.1, 10.2, 9.3, 7.5, 5.3, 4.5, 4.7],
    monthlyTempRangeF: [17.0, 19.8, 19.3, 22.1, 23.2, 27.5, 29.5, 27.5, 26.7, 25.4, 20.9, 16.3],
  },
  {
    id: "KPAO",
    name: "Palo Alto Airport",
    lat: 37.4611, lng: -122.1151, elevation: 2,
    annualFogDays: 12,
    avgWindMph: 8.7,
    avgTempVarianceF: 16.8,
    monthlyFogDays: [2.3, 1.3, 0.7, 0.4, 0.3, 0.2, 0.2, 0.5, 0.8, 1.4, 1.8, 2.5],
    monthlyAvgWindMph: [6.3, 7.7, 8.8, 10.2, 10.6, 11.2, 11.0, 10.4, 9.0, 7.4, 6.2, 6.0],
    monthlyTempRangeF: [15.5, 16.9, 16.6, 18.3, 16.4, 16.5, 15.1, 15.5, 18.6, 20.4, 17.7, 14.3],
  },
  {
    id: "KAPC",
    name: "Napa County Airport",
    lat: 38.2075, lng: -122.2804, elevation: 10,
    annualFogDays: 78,
    avgWindMph: 7.6,
    avgTempVarianceF: 23.0,
    monthlyFogDays: [12.8, 5.9, 6.7, 5.0, 4.6, 1.7, 1.5, 4.4, 6.5, 6.7, 9.3, 12.8],
    monthlyAvgWindMph: [6.1, 6.5, 6.9, 7.8, 9.5, 10.1, 10.0, 9.3, 7.5, 5.8, 5.2, 6.3],
    monthlyTempRangeF: [18.8, 22.0, 21.2, 23.1, 23.1, 24.8, 22.7, 22.7, 26.8, 28.2, 24.0, 18.1],
  },
];

const DEG_TO_RAD = Math.PI / 180;

// Haversine distance between two points in km
export function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * DEG_TO_RAD;
  const dLng = (lng2 - lng1) * DEG_TO_RAD;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * DEG_TO_RAD) * Math.cos(lat2 * DEG_TO_RAD) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Inverse Distance Weighting interpolation
export function idwInterpolate(
  lat: number,
  lng: number,
  getValue: (station: WeatherStation) => number,
  power: number = 2,
  maxDistance: number = 50
): number {
  let weightedSum = 0;
  let weightSum = 0;

  for (const station of stations) {
    const dist = haversineDistance(lat, lng, station.lat, station.lng);
    if (dist < 0.05) return getValue(station);
    if (dist <= maxDistance) {
      const weight = 1 / Math.pow(dist, power);
      weightedSum += weight * getValue(station);
      weightSum += weight;
    }
  }

  if (weightSum === 0) {
    for (const station of stations) {
      const dist = haversineDistance(lat, lng, station.lat, station.lng);
      const weight = 1 / Math.pow(dist, power);
      weightedSum += weight * getValue(station);
      weightSum += weight;
    }
  }

  return weightedSum / weightSum;
}

// Interpolate monthly values
export function idwInterpolateMonthly(
  lat: number,
  lng: number,
  getMonthlyValues: (station: WeatherStation) => number[],
  power: number = 2
): number[] {
  return Array.from({ length: 12 }, (_, i) =>
    idwInterpolate(lat, lng, (s) => getMonthlyValues(s)[i], power)
  );
}
