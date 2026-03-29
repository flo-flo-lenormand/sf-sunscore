import SearchBar from "@/components/SearchBar";
import NeighborhoodRanking from "@/components/NeighborhoodRanking";
import { getNeighborhoodRanking } from "@/lib/data";
import Link from "next/link";

export default function Home() {
  const rankings = getNeighborhoodRanking();

  return (
    <div>
      {/* Hero */}
      <section className="hero-gradient py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
            How sunny is your address?
          </h1>
          <p className="text-xl text-gray-500 mb-8 max-w-xl mx-auto leading-relaxed">
            A 0-100 sunshine score for every neighborhood in San Francisco. Based on satellite data, fog patterns, and 10 years of weather observations.
          </p>
          <SearchBar large />
          <p className="text-xs text-gray-400 mt-3">
            Try: &quot;Mission District&quot;, &quot;Valencia St&quot;, &quot;Marina&quot;, &quot;Outer Sunset&quot;
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Five climate factors, one score</h2>
          <p className="text-gray-500 text-center mb-10 max-w-lg mx-auto">
            Sun Score combines real data from NOAA, NREL, and USGS into a single number you can compare across neighborhoods.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { icon: "\u2600\uFE0F", label: "Sun Hours", weight: "35%", desc: "Satellite-measured solar radiation" },
              { icon: "\uD83C\uDF2B\uFE0F", label: "Fog Frequency", weight: "25%", desc: "Terrain-adjusted fog from NOAA data" },
              { icon: "\uD83D\uDCA8", label: "Wind Exposure", weight: "15%", desc: "10-year average from weather stations" },
              { icon: "\uD83C\uDF21\uFE0F", label: "Temp Stability", weight: "15%", desc: "Daily temperature variance" },
              { icon: "\uD83D\uDCC5", label: "Seasonal", weight: "10%", desc: "Year-round consistency" },
            ].map((factor) => (
              <div key={factor.label} className="text-center p-4 rounded-xl bg-white border border-gray-100">
                <div className="text-2xl mb-2">{factor.icon}</div>
                <div className="font-semibold text-gray-900 text-sm">{factor.label}</div>
                <div className="text-amber-600 font-bold text-lg">{factor.weight}</div>
                <div className="text-xs text-gray-400 mt-1">{factor.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Score Bands */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Score bands</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { range: "90-100", label: "Sun Haven", desc: "Exceptional sunshine, minimal fog", color: "#F59E0B" },
              { range: "75-89", label: "Sunny", desc: "Above-average sun, occasional fog", color: "#FBBF24" },
              { range: "60-74", label: "Moderate", desc: "Mixed conditions, seasonal fog", color: "#84CC16" },
              { range: "45-59", label: "Fog-Prone", desc: "Frequent fog, limited summer sun", color: "#94A3B8" },
              { range: "30-44", label: "Gray Belt", desc: "Heavy fog, significant wind", color: "#64748B" },
              { range: "0-29", label: "Fog Capital", desc: "Dense fog zone, minimal direct sun", color: "#475569" },
            ].map((band) => (
              <div key={band.label} className="p-4 rounded-xl border border-gray-100" style={{ borderLeftWidth: 4, borderLeftColor: band.color }}>
                <div className="font-bold text-lg" style={{ color: band.color }}>{band.range}</div>
                <div className="font-semibold text-gray-900 text-sm">{band.label}</div>
                <div className="text-xs text-gray-500 mt-1">{band.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SF Rankings */}
      <section className="py-16 px-4">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">SF Neighborhood Rankings</h2>
          <p className="text-gray-500 text-center mb-8 text-sm">
            All SF neighborhoods ranked by Sun Score
          </p>
          <NeighborhoodRanking rankings={rankings} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-amber-50 to-yellow-50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Explore the map</h2>
          <p className="text-gray-500 mb-6">
            See how sunshine varies across San Francisco. Compare neighborhoods side by side.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/methodology" className="px-6 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors">
              How it works
            </Link>
            <Link href="/map" className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:border-amber-300 transition-colors">
              Explore the Sun Map
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
