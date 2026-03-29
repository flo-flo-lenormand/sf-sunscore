// Solar Position Algorithm (simplified NREL SPA)
// Calculates sun position and annual direct sun hours for any lat/lng
// Reference: https://www.nrel.gov/docs/fy08osti/34302.pdf

const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

interface SunPosition {
  elevation: number;  // degrees above horizon
  azimuth: number;    // degrees from north
}

// Julian Day Number from date
function julianDay(year: number, month: number, day: number, hour: number = 12): number {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + hour / 24 + B - 1524.5;
}

// Sun declination angle (degrees)
function solarDeclination(dayOfYear: number): number {
  return 23.45 * Math.sin(DEG_TO_RAD * (360 / 365) * (dayOfYear - 81));
}

// Equation of time (minutes) - correction for Earth's orbital eccentricity
function equationOfTime(dayOfYear: number): number {
  const B = (360 / 365) * (dayOfYear - 81) * DEG_TO_RAD;
  return 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
}

// Solar hour angle (degrees)
function hourAngle(hour: number, longitude: number, dayOfYear: number, timezone: number = -8): number {
  const eot = equationOfTime(dayOfYear);
  const solarNoon = 12 - (longitude - timezone * 15) / 15 - eot / 60;
  return 15 * (hour - solarNoon);
}

// Calculate sun position at a given time and location
export function sunPosition(
  lat: number,
  lng: number,
  dayOfYear: number,
  hour: number,
  timezone: number = -8
): SunPosition {
  const declination = solarDeclination(dayOfYear);
  const ha = hourAngle(hour, lng, dayOfYear, timezone);

  const latRad = lat * DEG_TO_RAD;
  const decRad = declination * DEG_TO_RAD;
  const haRad = ha * DEG_TO_RAD;

  // Solar elevation
  const sinElevation =
    Math.sin(latRad) * Math.sin(decRad) +
    Math.cos(latRad) * Math.cos(decRad) * Math.cos(haRad);
  const elevation = Math.asin(sinElevation) * RAD_TO_DEG;

  // Solar azimuth
  const cosAzimuth =
    (Math.sin(decRad) - Math.sin(latRad) * sinElevation) /
    (Math.cos(latRad) * Math.cos(elevation * DEG_TO_RAD));
  let azimuth = Math.acos(Math.max(-1, Math.min(1, cosAzimuth))) * RAD_TO_DEG;
  if (ha > 0) azimuth = 360 - azimuth;

  return { elevation, azimuth };
}

// Calculate sunrise and sunset hours for a given day
export function sunriseSunset(lat: number, lng: number, dayOfYear: number, timezone: number = -8): { sunrise: number; sunset: number } | null {
  const declination = solarDeclination(dayOfYear);
  const latRad = lat * DEG_TO_RAD;
  const decRad = declination * DEG_TO_RAD;

  // Hour angle at sunrise/sunset (sun at horizon, corrected for refraction)
  const cosHa = (-0.01454 - Math.sin(latRad) * Math.sin(decRad)) / (Math.cos(latRad) * Math.cos(decRad));

  if (cosHa > 1) return null;  // No sunrise (polar night)
  if (cosHa < -1) return { sunrise: 0, sunset: 24 };  // No sunset (midnight sun)

  const haHours = Math.acos(cosHa) * RAD_TO_DEG / 15;
  const eot = equationOfTime(dayOfYear);
  const solarNoon = 12 - (lng - timezone * 15) / 15 - eot / 60;

  return {
    sunrise: solarNoon - haHours,
    sunset: solarNoon + haHours,
  };
}

// Calculate annual sun hours at a location (hours when sun is above horizon)
// This is the theoretical maximum - no building/terrain shadows
export function annualSunHours(lat: number, lng: number, timezone: number = -8): number {
  let totalHours = 0;

  for (let day = 1; day <= 365; day++) {
    const ss = sunriseSunset(lat, lng, day, timezone);
    if (ss) {
      totalHours += ss.sunset - ss.sunrise;
    }
  }

  return Math.round(totalHours);
}

// Calculate monthly sun hours
export function monthlySunHours(lat: number, lng: number, timezone: number = -8): number[] {
  const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const monthlyHours: number[] = [];
  let dayOfYear = 1;

  for (let month = 0; month < 12; month++) {
    let hours = 0;
    for (let d = 0; d < monthDays[month]; d++) {
      const ss = sunriseSunset(lat, lng, dayOfYear, timezone);
      if (ss) {
        hours += ss.sunset - ss.sunrise;
      }
      dayOfYear++;
    }
    monthlyHours.push(Math.round(hours));
  }

  return monthlyHours;
}

// Estimate effective sun hours accounting for terrain/hill shading
// Uses a simple model: higher elevation = less terrain shading
// Flat coastal areas get penalized for potential fog-induced low sun angle blocking
export function effectiveSunHours(
  lat: number,
  lng: number,
  elevationMeters: number,
  timezone: number = -8
): number {
  const theoretical = annualSunHours(lat, lng, timezone);

  // Elevation factor: higher ground gets more sun (less terrain shadow)
  // SF elevation range: 0m (sea level) to ~282m (Twin Peaks)
  const elevFactor = 0.85 + 0.15 * Math.min(1, elevationMeters / 200);

  // Coastal proximity penalty (lower elevation near coast = more fog/shadow)
  // This is a rough approximation - real model would use 3D building data
  const coastalPenalty = elevationMeters < 30 ? 0.92 : 1.0;

  return Math.round(theoretical * elevFactor * coastalPenalty);
}
