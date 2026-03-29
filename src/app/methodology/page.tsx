export const metadata = {
  title: "Methodology - Sun Score",
  description: "How Sun Score is calculated. Full methodology including data sources, weighting, and score bands.",
};

export default function MethodologyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Methodology</h1>
      <p className="text-gray-500 mb-10 text-lg">
        How we calculate Sun Score. What&apos;s measured, what&apos;s modeled, and what we don&apos;t know.
      </p>

      {/* Data Pipeline */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Data Pipeline</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          Sun Score combines three layers of data. Each has different levels of certainty.
        </p>

        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
              <h3 className="font-bold text-green-900">Layer 1: Measured (high confidence)</h3>
            </div>
            <ul className="text-sm text-green-800 space-y-2 ml-5">
              <li><strong>Daylight hours:</strong> Calculated from the NREL Solar Position Algorithm. This is deterministic astronomy - given a latitude, longitude, and date, the sun&apos;s position is exact. No estimation involved.</li>
              <li><strong>Wind speed and temperature:</strong> 10 years (2014-2024) of hourly METAR observations from 8 Bay Area ASOS weather stations, downloaded from the Iowa Environmental Mesonet. These are real, timestamped instrument readings.</li>
              <li><strong>Elevation:</strong> USGS National Map Elevation Point Query Service, derived from LiDAR surveys.</li>
              <li><strong>Geocoding:</strong> OpenStreetMap Nominatim.</li>
            </ul>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <h3 className="font-bold text-amber-900">Layer 2: Modeled (moderate confidence)</h3>
            </div>
            <ul className="text-sm text-amber-800 space-y-2 ml-5">
              <li><strong>Fog frequency at your address:</strong> No weather station exists within SF city limits. We interpolate fog data from 8 surrounding airport stations using Inverse Distance Weighting (IDW), then adjust using a terrain model of the Twin Peaks ridgeline and Golden Gate fog corridor.</li>
              <li><strong>Sunshine hours:</strong> Theoretical daylight hours multiplied by a &quot;sunshine fraction&quot; that accounts for fog and cloud cover. The fraction is calibrated against SFO&apos;s published 66% sunshine rate (NOAA Climate Normals) and cross-checked against NREL satellite solar radiation data at 4km resolution.</li>
              <li><strong>Spatial interpolation:</strong> Wind and temperature values between stations are estimated using IDW. This assumes smooth gradients, which is reasonable for temperature but less so for wind (which is affected by buildings and terrain).</li>
            </ul>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2.5 h-2.5 rounded-full bg-gray-400" />
              <h3 className="font-bold text-gray-700">Layer 3: Terrain Model (lower confidence)</h3>
            </div>
            <ul className="text-sm text-gray-600 space-y-2 ml-5">
              <li><strong>Twin Peaks ridge fog shadow:</strong> SF&apos;s central ridgeline (Mt Sutro through Twin Peaks to Glen Park) blocks the marine layer from reaching eastern neighborhoods. We model this as a multiplier: locations west of the ridge get 1.5-3x more fog days, east of the ridge gets 0.35-0.65x. The ridge coordinates are mapped from topographic data.</li>
              <li><strong>Golden Gate fog corridor:</strong> The marine layer pours through the Golden Gate, directly hitting Marina, Pacific Heights, and the Presidio before dissipating. We model this as a fan-shaped corridor that overrides the east-side sheltering effect for northern neighborhoods.</li>
              <li><strong>Elevation effect:</strong> Locations above ~150m are typically above the marine layer ceiling and receive less fog.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Components */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Score Components</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-3 text-gray-500 font-medium">Component</th>
                <th className="text-left py-3 px-3 text-gray-500 font-medium">Weight</th>
                <th className="text-left py-3 px-3 text-gray-500 font-medium">Source</th>
                <th className="text-left py-3 px-3 text-gray-500 font-medium">Confidence</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr className="border-b border-gray-100">
                <td className="py-3 px-3 font-medium">Annual Sun Hours</td>
                <td className="py-3 px-3">35%</td>
                <td className="py-3 px-3">NREL SPA + fog-adjusted sunshine fraction</td>
                <td className="py-3 px-3"><span className="text-amber-600">Moderate</span></td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-3 font-medium">Fog Frequency</td>
                <td className="py-3 px-3">25%</td>
                <td className="py-3 px-3">ASOS METAR + terrain fog model</td>
                <td className="py-3 px-3"><span className="text-amber-600">Moderate</span></td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-3 font-medium">Wind Exposure</td>
                <td className="py-3 px-3">15%</td>
                <td className="py-3 px-3">ASOS wind observations + IDW</td>
                <td className="py-3 px-3"><span className="text-green-600">High</span></td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-3 font-medium">Temperature Stability</td>
                <td className="py-3 px-3">15%</td>
                <td className="py-3 px-3">ASOS temperature observations + IDW</td>
                <td className="py-3 px-3"><span className="text-green-600">High</span></td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-medium">Seasonal Consistency</td>
                <td className="py-3 px-3">10%</td>
                <td className="py-3 px-3">Derived from monthly scores</td>
                <td className="py-3 px-3"><span className="text-amber-600">Moderate</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Weather Stations */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Weather Stations</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          All weather data comes from ASOS (Automated Surface Observing System) stations operated at airports.
          None are located within San Francisco. The nearest is SFO, 15km south of downtown.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-2 text-gray-500">Station</th>
                <th className="text-left py-2 px-2 text-gray-500">Location</th>
                <th className="text-right py-2 px-2 text-gray-500">Fog+Overcast days/yr</th>
                <th className="text-right py-2 px-2 text-gray-500">Avg Wind</th>
                <th className="text-right py-2 px-2 text-gray-500">Observations</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              <tr className="border-b border-gray-50"><td className="py-2 px-2">KSFO</td><td className="py-2 px-2">SF International Airport</td><td className="py-2 px-2 text-right">10</td><td className="py-2 px-2 text-right">10.3 mph</td><td className="py-2 px-2 text-right">96,372</td></tr>
              <tr className="border-b border-gray-50"><td className="py-2 px-2">KOAK</td><td className="py-2 px-2">Oakland International</td><td className="py-2 px-2 text-right">34</td><td className="py-2 px-2 text-right">8.3 mph</td><td className="py-2 px-2 text-right">96,271</td></tr>
              <tr className="border-b border-gray-50"><td className="py-2 px-2">KHAF</td><td className="py-2 px-2">Half Moon Bay</td><td className="py-2 px-2 text-right">178</td><td className="py-2 px-2 text-right">7.4 mph</td><td className="py-2 px-2 text-right">90,339</td></tr>
              <tr className="border-b border-gray-50"><td className="py-2 px-2">KSQL</td><td className="py-2 px-2">San Carlos</td><td className="py-2 px-2 text-right">18</td><td className="py-2 px-2 text-right">4.6 mph</td><td className="py-2 px-2 text-right">54,688</td></tr>
              <tr className="border-b border-gray-50"><td className="py-2 px-2">KHWD</td><td className="py-2 px-2">Hayward</td><td className="py-2 px-2 text-right">34</td><td className="py-2 px-2 text-right">6.8 mph</td><td className="py-2 px-2 text-right">95,941</td></tr>
              <tr className="border-b border-gray-50"><td className="py-2 px-2">KCCR</td><td className="py-2 px-2">Concord</td><td className="py-2 px-2 text-right">23</td><td className="py-2 px-2 text-right">7.2 mph</td><td className="py-2 px-2 text-right">96,342</td></tr>
              <tr className="border-b border-gray-50"><td className="py-2 px-2">KPAO</td><td className="py-2 px-2">Palo Alto</td><td className="py-2 px-2 text-right">12</td><td className="py-2 px-2 text-right">8.7 mph</td><td className="py-2 px-2 text-right">49,106</td></tr>
              <tr><td className="py-2 px-2">KAPC</td><td className="py-2 px-2">Napa County</td><td className="py-2 px-2 text-right">78</td><td className="py-2 px-2 text-right">7.6 mph</td><td className="py-2 px-2 text-right">95,814</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Fog+Overcast = days per year with visibility &lt; 1 mile OR cloud ceiling &lt; 2,000ft (BKN/OVC) during 40%+ of daytime hours. Source: IEM ASOS download, 2014-2024.
        </p>
      </section>

      {/* Score Bands */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Score Bands</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-3 text-gray-500 font-medium">Score</th>
                <th className="text-left py-3 px-3 text-gray-500 font-medium">Label</th>
                <th className="text-left py-3 px-3 text-gray-500 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr className="border-b border-gray-100"><td className="py-3 px-3 font-bold" style={{color:"#F59E0B"}}>90-100</td><td className="py-3 px-3 font-medium">Sun Haven</td><td className="py-3 px-3">Exceptional sunshine, minimal fog, sheltered from wind</td></tr>
              <tr className="border-b border-gray-100"><td className="py-3 px-3 font-bold" style={{color:"#FBBF24"}}>75-89</td><td className="py-3 px-3 font-medium">Sunny</td><td className="py-3 px-3">Above-average sun exposure, occasional fog</td></tr>
              <tr className="border-b border-gray-100"><td className="py-3 px-3 font-bold" style={{color:"#84CC16"}}>60-74</td><td className="py-3 px-3 font-medium">Moderate</td><td className="py-3 px-3">Mixed conditions, seasonal fog common</td></tr>
              <tr className="border-b border-gray-100"><td className="py-3 px-3 font-bold" style={{color:"#94A3B8"}}>45-59</td><td className="py-3 px-3 font-medium">Fog-Prone</td><td className="py-3 px-3">Frequent fog, limited sun hours in summer</td></tr>
              <tr className="border-b border-gray-100"><td className="py-3 px-3 font-bold" style={{color:"#64748B"}}>30-44</td><td className="py-3 px-3 font-medium">Gray Belt</td><td className="py-3 px-3">Heavy fog exposure, significant wind</td></tr>
              <tr><td className="py-3 px-3 font-bold" style={{color:"#475569"}}>0-29</td><td className="py-3 px-3 font-medium">Fog Capital</td><td className="py-3 px-3">Dense fog zone, minimal direct sun in summer months</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Confidence */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Confidence and Precision</h2>
        <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
          <p>
            Every score includes a confidence interval (typically +-5 to +-10 points). This reflects the uncertainty from spatial interpolation and terrain modeling. <strong className="text-gray-900">A score of 72 vs 74 is meaningless noise. A score of 52 vs 78 is a real difference.</strong>
          </p>
          <p>
            <strong className="text-gray-900">Scores are most accurate for:</strong> Neighborhood-level comparisons (Potrero Hill vs Outer Sunset). The model reliably captures the well-documented east-west fog gradient created by the Twin Peaks ridgeline.
          </p>
          <p>
            <strong className="text-gray-900">Scores are least accurate for:</strong> Block-level comparisons within the same neighborhood. The model cannot capture building shadows, street-level wind tunnels, or micro-terrain effects smaller than ~500m.
          </p>
        </div>
      </section>

      {/* What's NOT in the model */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">What&apos;s Not In the Model</h2>
        <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
          <p><strong className="text-gray-900">Building shadows.</strong> We don&apos;t model 3D building geometry. A north-facing apartment behind a tall building will get less sun than the score suggests.</p>
          <p><strong className="text-gray-900">Street-level wind.</strong> Wind tunnels between buildings can amplify or reduce wind beyond what station data shows.</p>
          <p><strong className="text-gray-900">Climate change trends.</strong> We use 2014-2024 data. Fog patterns are shifting (generally decreasing), but our model treats the last decade as representative.</p>
          <p><strong className="text-gray-900">Satellite resolution.</strong> NREL&apos;s satellite solar radiation data (NSRDB PSM3) has ~4km resolution. Within a single grid cell, we rely on the terrain model for neighborhood-level differentiation. The blend is 70% satellite + 30% terrain model.</p>
          <p><strong className="text-gray-900">In-city weather stations.</strong> There are no active ASOS or COOP weather stations within San Francisco. All 8 stations are at airports outside the city. This is the single biggest limitation of the model.</p>
        </div>
      </section>

      {/* Validation */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Validation</h2>
        <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
          <p>
            The model was validated against known SF microclimate patterns across 15 neighborhoods. All scored within expected ranges: sunny east-side neighborhoods (Potrero Hill, Dogpatch, Mission) score 75-84, transitional areas (Pacific Heights, Haight) score 66-73, and foggy west-side neighborhoods (Outer Sunset, Parkside) score 49-55.
          </p>
          <p>
            <strong className="text-gray-900">Calibration check:</strong> The sunshine model is calibrated so that SFO produces ~69% sunshine, consistent with NOAA&apos;s published 66% (within measurement uncertainty). The east-west gradient in our model (~17%) is directionally consistent with NREL satellite data showing a 9% gradient at 10km resolution (satellite data averages over cells larger than neighborhoods, so it understates the true gradient).
          </p>
          <p>
            <strong className="text-gray-900">What would improve this:</strong> Ground-truth sensors within SF (personal weather stations with solar radiation sensors), higher-resolution satellite data, and LiDAR-based building shadow models. Contributions welcome - see the project README on GitHub.
          </p>
        </div>
      </section>

      <div className="text-center text-xs text-gray-400 pt-8 border-t border-gray-100">
        Questions about the methodology? Open an issue on GitHub.
      </div>
    </div>
  );
}
