"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import ScoreGauge from "@/components/ScoreGauge";
import SeasonalChart from "@/components/SeasonalChart";
import ComponentBreakdown from "@/components/ComponentBreakdown";
import FeedbackButton from "@/components/FeedbackButton";
import type { SunScoreData } from "@/lib/data";

interface RealScoreResult extends SunScoreData {
  elevation?: number;
  scoreRange?: { low: number; high: number; margin: number };
  confidence?: {
    level: string;
    margin: number;
    nearestStationKm: number;
    note: string;
  };
  dataSources?: {
    measured: string[];
    modeled: string[];
    limitations: string[];
  } | string[];
}

function ScoreResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [result, setResult] = useState<RealScoreResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) return;

    setLoading(true);
    setError(null);

    async function computeScore() {
      // Step 1: Geocode via Nominatim (client-side - browser can make external requests)
      const searchQuery = query.toLowerCase().includes("san francisco") || query.toLowerCase().includes(", sf")
        ? query
        : `${query}, San Francisco, CA`;

      const geoParams = new URLSearchParams({
        q: searchQuery,
        format: "json",
        addressdetails: "1",
        limit: "1",
        countrycodes: "us",
      });

      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?${geoParams}`,
        { headers: { "User-Agent": "SunScore/1.0" } }
      );
      const geoData = await geoRes.json();

      if (!geoData || geoData.length === 0) {
        throw new Error("Could not find that address. Try a specific SF street address.");
      }

      const lat = parseFloat(geoData[0].lat);
      const lng = parseFloat(geoData[0].lon);
      const displayName = geoData[0].display_name;
      const neighborhood = geoData[0].address?.suburb || geoData[0].address?.neighbourhood || "San Francisco";

      // Step 2: Get elevation via USGS (client-side)
      let elevation = 0;
      try {
        const elevRes = await fetch(
          `https://epqs.nationalmap.gov/v1/json?x=${lng}&y=${lat}&units=Meters&output=json`,
          { signal: AbortSignal.timeout(5000) }
        );
        const elevData = await elevRes.json();
        if (elevData?.value && elevData.value !== -1000000) {
          elevation = Math.max(0, parseFloat(elevData.value));
        }
      } catch {
        // Fallback to 0 elevation
      }

      // Step 3: Compute score server-side (pure math, no external calls)
      const computeParams = new URLSearchParams({
        lat: lat.toString(),
        lng: lng.toString(),
        elevation: elevation.toString(),
        address: displayName,
        neighborhood,
      });

      const scoreRes = await fetch(`/api/compute?${computeParams}`);
      if (!scoreRes.ok) {
        const err = await scoreRes.json();
        throw new Error(err.error || "Score computation failed");
      }

      return await scoreRes.json();
    }

    computeScore()
      .then((data) => {
        setResult(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [query]);

  if (!query) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">Enter an address or neighborhood to look up its Sun Score.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center gap-3 text-gray-500">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Computing Sun Score from real data...
        </div>
        <p className="text-xs text-gray-400 mt-3">Geocoding, fetching elevation, computing solar geometry, interpolating weather stations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg mb-2">Could not compute score</p>
        <p className="text-gray-400 text-sm">{error}</p>
        <p className="text-gray-400 text-xs mt-2">Try a specific San Francisco address like &quot;850 Guerrero St&quot; or &quot;2200 Chestnut St&quot;</p>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="space-y-8">
      {/* Primary result */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden score-reveal">
        <div className="p-8">
          <div className="flex flex-col md:flex-row md:items-start gap-8">
            <div className="flex-shrink-0">
              <ScoreGauge score={result.score} label={result.label} size="lg" />
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{result.neighborhood} neighborhood</h2>
              <p className="text-sm text-gray-500 mb-1">{result.address}</p>
              <p className="text-gray-500 mb-1">{result.comparison}</p>

              {/* Accuracy disclaimer - condition #2 */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4">
                <p className="text-xs text-amber-800">
                  This score is an estimate based on regional weather stations and satellite data. Block-level conditions (building shadows, street orientation, micro-terrain) may vary.
                  {result.scoreRange && (
                    <span className="font-medium"> Accuracy: ±{result.scoreRange.margin} points.</span>
                  )}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="text-xs text-gray-400 mb-1">Avg Daily Sun</div>
                  <div className="text-lg font-bold text-gray-900">{(result.annualSunHours / 365).toFixed(1)} hrs</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="text-xs text-gray-400 mb-1">Foggy Days/Year</div>
                  <div className="text-lg font-bold text-gray-900">{result.fogDaysPerYear}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="text-xs text-gray-400 mb-1">Avg Wind</div>
                  <div className="text-lg font-bold text-gray-900">{result.avgWindMph} mph</div>
                </div>
              </div>

              <ComponentBreakdown components={result.components} />
            </div>
          </div>
        </div>

        {/* Seasonal breakdown */}
        <div className="border-t border-gray-100 p-8 bg-gray-50/50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Seasonal Breakdown</h3>
          <SeasonalChart seasonal={result.seasonal} />
          <p className="text-xs text-gray-400 mt-4">
            Scores reflect monthly sunshine quality. SF fog season typically runs June-August,
            with Indian Summer (September-October) bringing the year&apos;s best weather.
          </p>
        </div>
      </div>

      {/* Feedback - prominent, right after score */}
      <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6">
        <div className="text-center mb-3">
          <h3 className="font-semibold text-gray-900 text-lg">Help us improve</h3>
          <p className="text-sm text-gray-500">You know your neighborhood best. Your feedback helps calibrate the model for everyone.</p>
        </div>
        <FeedbackButton address={result.address} score={result.score} label={result.label} />
      </div>

      {/* Confidence & Data sources */}
      {result.confidence && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${
              result.confidence.level === "high" ? "bg-green-500" :
              result.confidence.level === "moderate" ? "bg-amber-500" : "bg-red-500"
            }`} />
            <h3 className="font-semibold text-gray-900">
              {result.confidence.level === "high" ? "High" : result.confidence.level === "moderate" ? "Moderate" : "Low"} Confidence
            </h3>
            <span className="text-xs text-gray-400">±{result.confidence.margin} points</span>
          </div>
          <p className="text-sm text-gray-500">{result.confidence.note}</p>
          <p className="text-xs text-gray-400">Nearest weather station: {result.confidence.nearestStationKm}km away</p>
        </div>
      )}

      {result.dataSources && typeof result.dataSources === "object" && !Array.isArray(result.dataSources) && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
          <h3 className="font-semibold text-gray-900">How this score was computed</h3>

          <div>
            <h4 className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-2">Measured (direct observations)</h4>
            <ul className="text-sm text-gray-500 space-y-1">
              {result.dataSources.measured.map((s: string) => (
                <li key={s} className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5 shrink-0">&#10003;</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-2">Modeled (estimated from data)</h4>
            <ul className="text-sm text-gray-500 space-y-1">
              {result.dataSources.modeled.map((s: string) => (
                <li key={s} className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5 shrink-0">&#9652;</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Known Limitations</h4>
            <ul className="text-sm text-gray-400 space-y-1">
              {result.dataSources.limitations.map((s: string) => (
                <li key={s} className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5 shrink-0">&bull;</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Embed snippet */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-2">Embed this score</h3>
        <p className="text-sm text-gray-500 mb-3">Add this score to your website or blog.</p>
        <div className="bg-gray-900 rounded-xl p-4 text-sm font-mono text-gray-300 overflow-x-auto">
          <code>{`<iframe src="${typeof window !== 'undefined' ? window.location.origin : ''}/widget?address=${encodeURIComponent(result.address)}" width="320" height="180" frameborder="0"></iframe>`}</code>
        </div>
      </div>

      {/* Methodology link */}
      <div className="text-center text-xs text-gray-400">
        Computed from NREL solar algorithms, 10 years of NOAA ASOS observations, USGS elevation, and terrain fog modeling.{" "}
        <a href="/methodology" className="text-amber-600 hover:text-amber-700 underline">View full methodology</a>
      </div>
    </div>
  );
}

export default function ScorePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <SearchBar />
      </div>
      <Suspense fallback={<div className="text-center py-20 text-gray-400">Loading...</div>}>
        <ScoreResults />
      </Suspense>
    </div>
  );
}
