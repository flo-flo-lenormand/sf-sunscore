#!/usr/bin/env python3
"""
NOAA Data Pipeline for Sun Score
Fetches 10 years of hourly METAR data from Iowa Environmental Mesonet (IEM)
and computes climate statistics for each station.

Data source: Iowa State University ASOS download service
https://mesonet.agron.iastate.edu/request/download.phtml

Outputs: station_data.json with real fog/wind/temp statistics
"""

import json
import subprocess
import sys
from collections import defaultdict
from datetime import datetime

# ASOS stations near San Francisco Bay Area
# Format: (station_id, name, expected_lat, expected_lng, elevation_m)
STATIONS = [
    ("SFO", "San Francisco International Airport", 37.619, -122.375, 4),
    ("OAK", "Oakland International Airport", 37.718, -122.233, 2),
    ("HAF", "Half Moon Bay Airport", 37.514, -122.500, 20),
    ("SQL", "San Carlos Airport", 37.512, -122.248, 1),
    ("HWD", "Hayward Executive Airport", 37.659, -122.121, 14),
    ("CCR", "Concord Buchanan Field", 37.992, -122.053, 7),
    ("PAO", "Palo Alto Airport", 37.461, -122.115, 2),
    ("APC", "Napa County Airport", 38.208, -122.280, 10),
]

# Date range: 10 years
YEAR_START = 2014
YEAR_END = 2024

def fetch_station_data(station_id: str) -> str:
    """Fetch hourly METAR data from IEM for a station."""
    url = (
        f"https://mesonet.agron.iastate.edu/cgi-bin/request/asos.py?"
        f"station={station_id}"
        f"&data=tmpf&data=vsby&data=sknt&data=skyc1&data=skyl1"
        f"&year1={YEAR_START}&month1=1&day1=1"
        f"&year2={YEAR_END}&month2=12&day2=31"
        f"&tz=America/Los_Angeles"
        f"&format=comma&latlon=yes&missing=M"
        f"&report_type=3"
    )

    print(f"  Fetching {station_id} ({YEAR_START}-{YEAR_END})...", end=" ", flush=True)
    result = subprocess.run(
        ["curl", "-s", url],
        capture_output=True, text=True, timeout=120
    )

    lines = [l for l in result.stdout.strip().split("\n") if not l.startswith("#")]
    data_lines = lines[1:]  # skip header
    print(f"{len(data_lines)} observations")
    return result.stdout


def parse_observations(csv_data: str) -> list[dict]:
    """Parse IEM CSV into list of observations."""
    observations = []

    for line in csv_data.strip().split("\n"):
        if line.startswith("#") or line.startswith("station,"):
            continue

        parts = line.split(",")
        if len(parts) < 9:
            continue

        station, valid, lon, lat, tmpf, vsby, sknt, skyc1, skyl1 = parts[:9]

        # Skip if core values are missing
        if "M" in (tmpf, vsby, sknt):
            continue

        try:
            obs = {
                "station": station,
                "datetime": valid,
                "lat": float(lat),
                "lng": float(lon),
                "temp_f": float(tmpf),
                "visibility_mi": float(vsby),
                "wind_knots": float(sknt),
                "sky_cover": skyc1 if skyc1 != "M" else None,
                "cloud_base_ft": float(skyl1) if skyl1 not in ("M", "") else None,  # IEM returns feet AGL
            }

            # Parse month from datetime
            dt = datetime.strptime(valid, "%Y-%m-%d %H:%M")
            obs["month"] = dt.month
            obs["year"] = dt.year
            obs["date"] = dt.strftime("%Y-%m-%d")
            obs["hour"] = dt.hour

            observations.append(obs)
        except (ValueError, IndexError):
            continue

    return observations


def compute_station_stats(observations: list[dict]) -> dict:
    """Compute climate statistics from hourly observations."""
    if not observations:
        return None

    station = observations[0]["station"]
    lat = observations[0]["lat"]
    lng = observations[0]["lng"]

    # Group by date for daily statistics
    daily_data = defaultdict(list)
    for obs in observations:
        daily_data[obs["date"]].append(obs)

    # Group by month
    monthly_fog_days = defaultdict(set)      # month -> set of fog dates
    monthly_wind_sum = defaultdict(float)     # month -> sum of wind speeds
    monthly_wind_count = defaultdict(int)     # month -> count
    monthly_temp_highs = defaultdict(list)    # month -> list of daily highs
    monthly_temp_lows = defaultdict(list)     # month -> list of daily lows

    total_fog_days = set()
    all_winds = []

    total_overcast_days = set()
    monthly_overcast_days = defaultdict(set)

    for date_str, day_obs in daily_data.items():
        month = day_obs[0]["month"]

        # Fog day: visibility < 1 mile OR low overcast/broken ceiling during daytime
        has_fog = any(obs["visibility_mi"] < 1.0 for obs in day_obs)
        if has_fog:
            total_fog_days.add(date_str)
            monthly_fog_days[month].add(date_str)

        # Overcast day: BKN or OVC with ceiling < 2000ft during daytime hours (7am-6pm)
        # This captures the SF marine layer that blocks sun even when visibility > 1 mile
        daytime_obs = [obs for obs in day_obs if 7 <= obs.get("hour", 12) <= 18]
        overcast_count = sum(
            1 for obs in daytime_obs
            if obs.get("sky_cover") in ("BKN", "OVC")
            and obs.get("cloud_base_ft") is not None
            and obs["cloud_base_ft"] < 2000
        )
        # If more than 40% of daytime observations are low overcast, count as overcast day
        if daytime_obs and overcast_count / len(daytime_obs) > 0.4:
            total_overcast_days.add(date_str)
            monthly_overcast_days[month].add(date_str)

        # Wind: convert knots to mph (1 knot = 1.15078 mph)
        winds_mph = [obs["wind_knots"] * 1.15078 for obs in day_obs]
        avg_wind = sum(winds_mph) / len(winds_mph)
        monthly_wind_sum[month] += avg_wind
        monthly_wind_count[month] += 1
        all_winds.append(avg_wind)

        # Temperature: daily high and low
        temps = [obs["temp_f"] for obs in day_obs]
        if temps:
            monthly_temp_highs[month].append(max(temps))
            monthly_temp_lows[month].append(min(temps))

    num_years = YEAR_END - YEAR_START

    # Annual fog days: use combined metric (true fog + low overcast days)
    # This better captures the SF marine layer effect on sunshine
    combined_fog = total_fog_days | total_overcast_days  # union of both
    annual_fog_days = round(len(combined_fog) / num_years)
    annual_strict_fog = round(len(total_fog_days) / num_years)
    annual_overcast = round(len(total_overcast_days) / num_years)

    # Average wind speed
    avg_wind_mph = round(sum(all_winds) / len(all_winds), 1) if all_winds else 0

    # Average daily temperature range
    all_daily_ranges = []
    for month in range(1, 13):
        highs = monthly_temp_highs.get(month, [])
        lows = monthly_temp_lows.get(month, [])
        for h, l in zip(highs, lows):
            all_daily_ranges.append(h - l)
    avg_temp_variance = round(sum(all_daily_ranges) / len(all_daily_ranges), 1) if all_daily_ranges else 0

    # Monthly breakdowns
    monthly_fog = []
    monthly_wind = []
    monthly_temp_range = []

    for month in range(1, 13):
        # Combined fog + overcast days per month (annual average)
        combined = monthly_fog_days.get(month, set()) | monthly_overcast_days.get(month, set())
        fog_count = len(combined)
        monthly_fog.append(round(fog_count / num_years, 1))

        # Average wind per month
        if monthly_wind_count.get(month, 0) > 0:
            monthly_wind.append(round(monthly_wind_sum[month] / monthly_wind_count[month], 1))
        else:
            monthly_wind.append(0)

        # Average daily temp range per month
        highs = monthly_temp_highs.get(month, [])
        lows = monthly_temp_lows.get(month, [])
        if highs and lows:
            ranges = [h - l for h, l in zip(highs, lows)]
            monthly_temp_range.append(round(sum(ranges) / len(ranges), 1))
        else:
            monthly_temp_range.append(0)

    return {
        "id": f"K{station}" if not station.startswith("K") else station,
        "name": None,  # Will be filled from STATIONS list
        "lat": lat,
        "lng": lng,
        "elevation": None,  # Will be filled from STATIONS list
        "annualFogDays": annual_fog_days,
        "avgWindMph": avg_wind_mph,
        "avgTempVarianceF": avg_temp_variance,
        "monthlyFogDays": monthly_fog,
        "monthlyAvgWindMph": monthly_wind,
        "monthlyTempRangeF": monthly_temp_range,
        "annualStrictFog": annual_strict_fog,
        "annualOvercast": annual_overcast,
        "dataYears": f"{YEAR_START}-{YEAR_END}",
        "totalObservations": len(observations),
    }


def main():
    print(f"Sun Score NOAA Data Pipeline")
    print(f"Fetching {YEAR_END - YEAR_START} years of hourly METAR data from {len(STATIONS)} stations")
    print(f"Source: Iowa Environmental Mesonet (mesonet.agron.iastate.edu)")
    print()

    all_stats = []

    for station_id, name, expected_lat, expected_lng, elevation in STATIONS:
        csv_data = fetch_station_data(station_id)
        observations = parse_observations(csv_data)

        if not observations:
            print(f"  WARNING: No valid observations for {station_id}, skipping")
            continue

        stats = compute_station_stats(observations)
        if stats:
            stats["name"] = name
            stats["elevation"] = elevation
            all_stats.append(stats)

            print(f"  -> Fog+overcast: {stats['annualFogDays']}d/yr "
                  f"(strict fog: {stats.get('annualStrictFog', '?')}d, "
                  f"low overcast: {stats.get('annualOvercast', '?')}d)")
            print(f"     Wind: {stats['avgWindMph']}mph, "
                  f"Temp range: {stats['avgTempVarianceF']}F")
            print(f"     Monthly fog+overcast: {stats['monthlyFogDays']}")

    # Write output
    output_path = "scripts/station_data.json"
    with open(output_path, "w") as f:
        json.dump({
            "generated": datetime.now().isoformat(),
            "source": "Iowa Environmental Mesonet ASOS data",
            "period": f"{YEAR_START}-{YEAR_END}",
            "stations": all_stats,
        }, f, indent=2)

    print(f"\nWrote {len(all_stats)} stations to {output_path}")

    # Also generate TypeScript
    generate_typescript(all_stats)


def generate_typescript(stations: list[dict]):
    """Generate TypeScript file with real station data."""
    ts_lines = [
        "// REAL NOAA weather station data for the San Francisco Bay Area",
        f"// Generated from Iowa Environmental Mesonet ASOS data ({YEAR_START}-{YEAR_END})",
        f"// {len(stations)} stations, 10 years of hourly METAR observations",
        "// Source: https://mesonet.agron.iastate.edu/request/download.phtml",
        "",
        "export interface WeatherStation {",
        "  id: string;",
        "  name: string;",
        "  lat: number;",
        "  lng: number;",
        "  elevation: number;",
        "  annualFogDays: number;",
        "  avgWindMph: number;",
        "  avgTempVarianceF: number;",
        "  monthlyFogDays: number[];",
        "  monthlyAvgWindMph: number[];",
        "  monthlyTempRangeF: number[];",
        "}",
        "",
        "export const stations: WeatherStation[] = [",
    ]

    for s in stations:
        ts_lines.append("  {")
        ts_lines.append(f'    id: "{s["id"]}",')
        ts_lines.append(f'    name: "{s["name"]}",')
        ts_lines.append(f'    lat: {s["lat"]}, lng: {s["lng"]}, elevation: {s["elevation"]},')
        ts_lines.append(f'    annualFogDays: {s["annualFogDays"]},')
        ts_lines.append(f'    avgWindMph: {s["avgWindMph"]},')
        ts_lines.append(f'    avgTempVarianceF: {s["avgTempVarianceF"]},')
        ts_lines.append(f'    monthlyFogDays: {json.dumps(s["monthlyFogDays"])},')
        ts_lines.append(f'    monthlyAvgWindMph: {json.dumps(s["monthlyAvgWindMph"])},')
        ts_lines.append(f'    monthlyTempRangeF: {json.dumps(s["monthlyTempRangeF"])},')
        ts_lines.append("  },")

    ts_lines.extend([
        "];",
        "",
        "const DEG_TO_RAD = Math.PI / 180;",
        "",
        "// Haversine distance between two points in km",
        "export function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {",
        "  const R = 6371;",
        "  const dLat = (lat2 - lat1) * DEG_TO_RAD;",
        "  const dLng = (lng2 - lng1) * DEG_TO_RAD;",
        "  const a =",
        "    Math.sin(dLat / 2) * Math.sin(dLat / 2) +",
        "    Math.cos(lat1 * DEG_TO_RAD) * Math.cos(lat2 * DEG_TO_RAD) *",
        "    Math.sin(dLng / 2) * Math.sin(dLng / 2);",
        "  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));",
        "  return R * c;",
        "}",
        "",
        "// Inverse Distance Weighting interpolation",
        "export function idwInterpolate(",
        "  lat: number,",
        "  lng: number,",
        "  getValue: (station: WeatherStation) => number,",
        "  power: number = 2,",
        "  maxDistance: number = 50",
        "): number {",
        "  let weightedSum = 0;",
        "  let weightSum = 0;",
        "",
        "  for (const station of stations) {",
        "    const dist = haversineDistance(lat, lng, station.lat, station.lng);",
        "    if (dist < 0.05) return getValue(station);",
        "    if (dist <= maxDistance) {",
        "      const weight = 1 / Math.pow(dist, power);",
        "      weightedSum += weight * getValue(station);",
        "      weightSum += weight;",
        "    }",
        "  }",
        "",
        "  if (weightSum === 0) {",
        "    for (const station of stations) {",
        "      const dist = haversineDistance(lat, lng, station.lat, station.lng);",
        "      const weight = 1 / Math.pow(dist, power);",
        "      weightedSum += weight * getValue(station);",
        "      weightSum += weight;",
        "    }",
        "  }",
        "",
        "  return weightedSum / weightSum;",
        "}",
        "",
        "// Interpolate monthly values",
        "export function idwInterpolateMonthly(",
        "  lat: number,",
        "  lng: number,",
        "  getMonthlyValues: (station: WeatherStation) => number[],",
        "  power: number = 2",
        "): number[] {",
        "  return Array.from({ length: 12 }, (_, i) =>",
        "    idwInterpolate(lat, lng, (s) => getMonthlyValues(s)[i], power)",
        "  );",
        "}",
    ])

    output_path = "scripts/noaa-stations-real.ts"
    with open(output_path, "w") as f:
        f.write("\n".join(ts_lines) + "\n")

    print(f"Wrote TypeScript to {output_path}")


if __name__ == "__main__":
    main()
