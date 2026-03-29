// NREL NSRDB PSM3 satellite solar radiation data for San Francisco
// Source: PVWatts v8 API, NSRDB Physical Solar Model v3
// Resolution: ~4km grid cells
// GHI = Global Horizontal Irradiance (kWh/m²/day annual average)
// Monthly GHI values capture actual fog/cloud patterns from satellite observations

export interface SatelliteDataPoint {
  name: string;
  lat: number;
  lng: number;
  ghiAnnual: number;      // kWh/m²/day
  ghiMonthly: number[];   // kWh/m²/day per month
  sunshineHours: number;  // estimated annual sunshine hours
}

// Convert GHI to sunshine hours: GHI * 365 / avg_irradiance_during_sun (0.6 kW/m² for SF)
const GHI_TO_HOURS = 365 / 0.6;

export const satelliteData: SatelliteDataPoint[] = [
  { name: "Outer Sunset", lat: 37.755, lng: -122.495, ghiAnnual: 4.658181267163389, ghiMonthly: [2.37, 3.61, 4.86, 6.08, 6.69, 7.23, 6.04, 5.43, 4.95, 3.69, 2.90, 2.05], sunshineHours: 2834 },
  { name: "Inner Sunset", lat: 37.76, lng: -122.468, ghiAnnual: 4.859433166306397, ghiMonthly: [2.30, 3.46, 4.81, 6.04, 6.88, 7.53, 7.08, 6.14, 5.27, 3.94, 2.80, 2.06], sunshineHours: 2956 },
  { name: "Outer Richmond", lat: 37.779, lng: -122.49, ghiAnnual: 4.658181267163389, ghiMonthly: [2.37, 3.61, 4.86, 6.08, 6.69, 7.23, 6.04, 5.43, 4.95, 3.69, 2.90, 2.05], sunshineHours: 2834 },
  { name: "Inner Richmond", lat: 37.779, lng: -122.464, ghiAnnual: 4.859433166306397, ghiMonthly: [2.30, 3.46, 4.81, 6.04, 6.88, 7.53, 7.08, 6.14, 5.27, 3.94, 2.80, 2.06], sunshineHours: 2956 },
  { name: "Haight-Ashbury", lat: 37.769, lng: -122.448, ghiAnnual: 4.859433166306397, ghiMonthly: [2.30, 3.46, 4.81, 6.04, 6.88, 7.53, 7.08, 6.14, 5.27, 3.94, 2.80, 2.06], sunshineHours: 2956 },
  { name: "Twin Peaks", lat: 37.752, lng: -122.448, ghiAnnual: 4.859433166306397, ghiMonthly: [2.30, 3.46, 4.81, 6.04, 6.88, 7.53, 7.08, 6.14, 5.27, 3.94, 2.80, 2.06], sunshineHours: 2956 },
  { name: "Castro", lat: 37.761, lng: -122.435, ghiAnnual: 4.918017054986047, ghiMonthly: [2.29, 3.45, 4.80, 6.42, 7.11, 7.54, 7.12, 6.17, 5.44, 3.96, 2.61, 2.10], sunshineHours: 2992 },
  { name: "Mission", lat: 37.76, lng: -122.415, ghiAnnual: 4.918017054986047, ghiMonthly: [2.29, 3.45, 4.80, 6.42, 7.11, 7.54, 7.12, 6.17, 5.44, 3.96, 2.61, 2.10], sunshineHours: 2992 },
  { name: "Potrero Hill", lat: 37.761, lng: -122.4, ghiAnnual: 5.017531809627465, ghiMonthly: [2.32, 3.42, 4.80, 6.15, 7.05, 7.96, 7.34, 6.58, 5.53, 4.24, 2.74, 2.08], sunshineHours: 3052 },
  { name: "Dogpatch", lat: 37.759, lng: -122.388, ghiAnnual: 5.017531809627465, ghiMonthly: [2.32, 3.42, 4.80, 6.15, 7.05, 7.96, 7.34, 6.58, 5.53, 4.24, 2.74, 2.08], sunshineHours: 3052 },
  { name: "SOMA", lat: 37.779, lng: -122.395, ghiAnnual: 5.017531809627465, ghiMonthly: [2.32, 3.42, 4.80, 6.15, 7.05, 7.96, 7.34, 6.58, 5.53, 4.24, 2.74, 2.08], sunshineHours: 3052 },
  { name: "Marina", lat: 37.801, lng: -122.437, ghiAnnual: 4.817503768302335, ghiMonthly: [2.24, 3.37, 4.33, 6.36, 7.01, 7.46, 6.78, 5.97, 5.44, 3.91, 2.86, 2.08], sunshineHours: 2931 },
  { name: "Pacific Heights", lat: 37.793, lng: -122.435, ghiAnnual: 4.817503768302335, ghiMonthly: [2.24, 3.37, 4.33, 6.36, 7.01, 7.46, 6.78, 5.97, 5.44, 3.91, 2.86, 2.08], sunshineHours: 2931 },
  { name: "Bernal Heights", lat: 37.739, lng: -122.416, ghiAnnual: 5.028362069158816, ghiMonthly: [2.27, 3.48, 4.91, 6.25, 7.05, 7.82, 7.32, 6.63, 5.40, 4.21, 2.91, 2.09], sunshineHours: 3059 },
  { name: "Parkside", lat: 37.744, lng: -122.487, ghiAnnual: 4.427213530423079, ghiMonthly: [2.31, 3.51, 4.76, 5.97, 6.51, 6.62, 5.58, 4.57, 4.73, 3.70, 2.82, 2.06], sunshineHours: 2693 },
  { name: "Presidio", lat: 37.8, lng: -122.465, ghiAnnual: 4.864937384021656, ghiMonthly: [2.22, 3.41, 4.51, 6.01, 6.95, 7.61, 7.07, 6.30, 5.31, 4.08, 2.86, 2.04], sunshineHours: 2960 },
  { name: "Noe Valley", lat: 37.75, lng: -122.434, ghiAnnual: 5.028362069158816, ghiMonthly: [2.27, 3.48, 4.91, 6.25, 7.05, 7.82, 7.32, 6.63, 5.40, 4.21, 2.91, 2.09], sunshineHours: 3059 },
  { name: "Glen Park", lat: 37.734, lng: -122.433, ghiAnnual: 5.028362069158816, ghiMonthly: [2.27, 3.48, 4.91, 6.25, 7.05, 7.82, 7.32, 6.63, 5.40, 4.21, 2.91, 2.09], sunshineHours: 3059 },
  { name: "Excelsior", lat: 37.726, lng: -122.425, ghiAnnual: 5.028362069158816, ghiMonthly: [2.27, 3.48, 4.91, 6.25, 7.05, 7.82, 7.32, 6.63, 5.40, 4.21, 2.91, 2.09], sunshineHours: 3059 },
  { name: "Bayview", lat: 37.734, lng: -122.39, ghiAnnual: 5.002917864162628, ghiMonthly: [2.33, 3.45, 4.81, 6.13, 7.30, 7.79, 7.30, 6.57, 5.55, 3.83, 2.90, 2.07], sunshineHours: 3043 },
  // Additional calibration points for new neighborhoods (same NREL grid cells as nearby points)
  { name: "North Beach", lat: 37.806, lng: -122.410, ghiAnnual: 4.918017054986047, ghiMonthly: [2.29, 3.45, 4.80, 6.42, 7.11, 7.54, 7.12, 6.17, 5.44, 3.96, 2.61, 2.10], sunshineHours: 2992 },
  { name: "Russian Hill", lat: 37.800, lng: -122.420, ghiAnnual: 4.918017054986047, ghiMonthly: [2.29, 3.45, 4.80, 6.42, 7.11, 7.54, 7.12, 6.17, 5.44, 3.96, 2.61, 2.10], sunshineHours: 2992 },
  { name: "Financial District", lat: 37.794, lng: -122.398, ghiAnnual: 5.017531809627465, ghiMonthly: [2.32, 3.42, 4.80, 6.15, 7.05, 7.96, 7.34, 6.58, 5.53, 4.24, 2.74, 2.08], sunshineHours: 3052 },
  { name: "Western Addition", lat: 37.781, lng: -122.432, ghiAnnual: 4.859433166306397, ghiMonthly: [2.30, 3.46, 4.81, 6.04, 6.88, 7.53, 7.08, 6.14, 5.27, 3.94, 2.80, 2.06], sunshineHours: 2956 },
  { name: "Visitacion Valley", lat: 37.718, lng: -122.413, ghiAnnual: 5.028362069158816, ghiMonthly: [2.27, 3.48, 4.91, 6.25, 7.05, 7.82, 7.32, 6.63, 5.40, 4.21, 2.91, 2.09], sunshineHours: 3059 },
  { name: "Hunters Point", lat: 37.725, lng: -122.375, ghiAnnual: 5.002917864162628, ghiMonthly: [2.33, 3.45, 4.81, 6.13, 7.30, 7.79, 7.30, 6.57, 5.55, 3.83, 2.90, 2.07], sunshineHours: 3043 },
  { name: "Treasure Island", lat: 37.823, lng: -122.370, ghiAnnual: 5.017531809627465, ghiMonthly: [2.32, 3.42, 4.80, 6.15, 7.05, 7.96, 7.34, 6.58, 5.53, 4.24, 2.74, 2.08], sunshineHours: 3052 },
];

// IDW interpolation of satellite GHI for any lat/lng within SF
export function interpolateGHI(lat: number, lng: number): number {
  let weightedSum = 0;
  let weightSum = 0;
  for (const point of satelliteData) {
    const dist = Math.sqrt((lat - point.lat) ** 2 + (lng - point.lng) ** 2);
    if (dist < 0.001) return point.ghiAnnual;
    const weight = 1 / (dist ** 2);
    weightedSum += weight * point.ghiAnnual;
    weightSum += weight;
  }
  return weightedSum / weightSum;
}

export function interpolateMonthlyGHI(lat: number, lng: number): number[] {
  return Array.from({ length: 12 }, (_, i) => {
    let weightedSum = 0;
    let weightSum = 0;
    for (const point of satelliteData) {
      const dist = Math.sqrt((lat - point.lat) ** 2 + (lng - point.lng) ** 2);
      if (dist < 0.001) return point.ghiMonthly[i];
      const weight = 1 / (dist ** 2);
      weightedSum += weight * point.ghiMonthly[i];
      weightSum += weight;
    }
    return weightedSum / weightSum;
  });
}

export function ghiToSunshineHours(ghi: number): number {
  return Math.round(ghi * GHI_TO_HOURS);
}
