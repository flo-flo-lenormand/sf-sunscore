# Sun Score

**Live site: [sf-sunscore.vercel.app](https://sf-sunscore.vercel.app)**

A 0-100 sunshine score for every neighborhood in San Francisco. Based on satellite solar radiation, fog frequency, wind exposure, temperature stability, and 10 years of weather data.

**Think Walk Score, but for sunshine.**

## How It Works

Sun Score combines three layers of data:

1. **Measured** - NREL satellite solar radiation (4km resolution), NOAA ASOS wind/temperature observations (2014-2024), USGS elevation, astronomical daylight calculations
2. **Modeled** - Fog frequency interpolated from 8 Bay Area airport stations, adjusted by a terrain model of the Twin Peaks ridgeline and Golden Gate fog corridor
3. **Blended** - 70% satellite-measured + 30% terrain-model refinement for neighborhood-level detail

The score weights five components:
- **Sun Hours** (35%) - Annual sunshine from satellite + terrain blend
- **Fog Frequency** (25%) - Terrain-adjusted fog days
- **Wind Exposure** (15%) - Station-interpolated wind speed
- **Temperature Stability** (15%) - Daily temperature variance
- **Seasonal Consistency** (10%) - Year-round score stability

## Quick Start

```bash
git clone https://github.com/flo-flo-lenormand/sf-sunscore.git
cd sunscore
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The app works out of the box - all satellite data is pre-generated in `src/lib/satellite-data.ts`.

### Optional: NREL API Key

To refresh satellite solar radiation data, get a free API key at [https://developer.nrel.gov/signup/](https://developer.nrel.gov/signup/) and add it to `.env.local`:

```
NREL_API_KEY=your_key_here
```

Then run:
```bash
python3 scripts/fetch_nrel_data.py
```

## Architecture

```
src/
  app/
    page.tsx                    # Landing page
    map/page.tsx                # Interactive Leaflet/OpenStreetMap neighborhood map
    score/page.tsx              # Address score lookup (client-side)
    rankings/page.tsx           # Neighborhood rankings
    methodology/page.tsx        # Full methodology documentation
    embed/page.tsx              # Embed widget documentation
    api-docs/page.tsx           # API documentation
    api/
      compute/route.ts          # Score computation endpoint
      neighborhoods/route.ts    # All neighborhood scores
  lib/
    terrain-model.ts            # Twin Peaks ridge + Golden Gate corridor fog model
    satellite-data.ts           # NREL NSRDB solar radiation (20 calibration points)
    noaa-stations.ts            # 8 Bay Area ASOS stations + IDW interpolation
    solar.ts                    # NREL Solar Position Algorithm
    neighborhoods.ts            # 30 SF neighborhoods with polygons
    data.ts                     # Static neighborhood ranking data
  components/
    SearchBar.tsx               # Address search with geocoding
    ScoreGauge.tsx              # Circular score visualization
    SeasonalChart.tsx           # Monthly score chart
    ComponentBreakdown.tsx      # Score component details
    FeedbackButton.tsx          # Crowd-sourced accuracy feedback
scripts/
  fetch_noaa_data.py            # Download NOAA ASOS station data
  fetch_nrel_data.py            # Download NREL satellite solar data
```

## Data Sources & Attribution

| Source | Data | License |
|--------|------|---------|
| [NREL NSRDB](https://nsrdb.nrel.gov/) | Satellite solar radiation (GHI) | Public domain (DOE) |
| [NOAA IEM ASOS](https://mesonet.agron.iastate.edu/request/download.phtml) | Wind, temperature, fog observations | Public domain |
| [NREL SPA](https://midcdmz.nrel.gov/spa/) | Solar position algorithm | Public domain (DOE) |
| [USGS National Map](https://epqs.nationalmap.gov/) | Elevation data | Public domain |
| [OpenStreetMap Nominatim](https://nominatim.openstreetmap.org/) | Geocoding | ODbL |

## Known Limitations

- No weather stations exist within SF city limits - all 8 are at airports outside the city
- Satellite solar data is ~4km resolution - neighborhoods within the same grid cell share a baseline
- Building shadows, street-level wind tunnels, and micro-terrain are not modeled
- Score precision is +/-5 to +/-10 points; small differences are not meaningful
- Currently SF-only (the terrain model is SF-specific)

## Contributing

Contributions welcome! Some ideas:

- **More cities** - the scoring framework is general, but each city needs its own terrain model
- **Better fog data** - personal weather station data from within SF would dramatically improve accuracy
- **Building shadows** - LiDAR + 3D building models could capture block-level effects
- **Higher-res satellite data** - sub-km solar radiation data exists but is expensive

Please open an issue before starting work on major features.

## License

MIT - see [LICENSE](LICENSE).

## Acknowledgments

Built with data from NOAA, NREL, USGS, and OpenStreetMap. The terrain fog model is based on well-documented SF microclimate patterns (the Twin Peaks ridgeline fog shadow and Golden Gate fog corridor).
