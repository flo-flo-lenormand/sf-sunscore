"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";

interface NeighborhoodData {
  name: string;
  slug: string;
  lat: number;
  lng: number;
  polygon: [number, number][];
  score: number;
  label: string;
  sunHours: number;
  fogDays: number;
  windMph: number;
}

function scoreColor(score: number): string {
  if (score >= 75) return "#F59E0B";
  if (score >= 65) return "#FBBF24";
  if (score >= 55) return "#D9F99D";
  if (score >= 45) return "#94A3B8";
  return "#64748B";
}

function scoreBg(score: number): string {
  if (score >= 75) return "bg-amber-100 border-amber-300";
  if (score >= 65) return "bg-amber-50 border-amber-200";
  if (score >= 55) return "bg-gray-100 border-gray-300";
  return "bg-slate-100 border-slate-300";
}

function LeafletMap({
  data,
  selected,
  compare,
  onSelect,
}: {
  data: NeighborhoodData[];
  selected: NeighborhoodData | null;
  compare: NeighborhoodData | null;
  onSelect: (n: NeighborhoodData) => void;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersRef = useRef<L.Layer[]>([]);
  const [L, setL] = useState<typeof import("leaflet") | null>(null);

  // Load leaflet client-side only
  useEffect(() => {
    import("leaflet").then((leaflet) => {
      setL(leaflet.default || leaflet);
    });
  }, []);

  // Initialize map
  useEffect(() => {
    if (!L || !mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [37.765, -122.44],
      zoom: 13,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [L]);

  // Draw neighborhood polygons
  useEffect(() => {
    if (!L || !mapInstanceRef.current || data.length === 0) return;
    const map = mapInstanceRef.current;

    // Clear existing layers
    layersRef.current.forEach((layer) => map.removeLayer(layer));
    layersRef.current = [];

    data.forEach((n) => {
      const isSelected = selected?.slug === n.slug || compare?.slug === n.slug;
      const coords = n.polygon.map(([lat, lng]) => [lat, lng] as [number, number]);

      const polygon = L.polygon(coords, {
        color: isSelected ? "#1F2937" : "#FFFFFF",
        weight: isSelected ? 3 : 1.5,
        fillColor: scoreColor(n.score),
        fillOpacity: isSelected ? 0.7 : 0.5,
      });

      polygon.on("click", () => onSelect(n));

      polygon.bindTooltip(
        `<div style="text-align:center;font-family:system-ui">
          <strong>${n.name}</strong><br/>
          <span style="font-size:18px;font-weight:800;color:${scoreColor(n.score)}">${n.score}</span>
          <span style="font-size:11px;color:#6B7280"> ${n.label}</span>
        </div>`,
        { sticky: true, direction: "top", className: "score-tooltip" }
      );

      polygon.addTo(map);
      layersRef.current.push(polygon);

      // Score label in center
      const center = polygon.getBounds().getCenter();
      const marker = L.marker(center, {
        icon: L.divIcon({
          className: "score-label",
          html: `<div style="
            font-family:system-ui;text-align:center;
            font-size:14px;font-weight:800;
            color:#1F2937;text-shadow:0 0 3px white,0 0 3px white,0 0 3px white;
            pointer-events:none;
          ">${n.score}</div>`,
          iconSize: [40, 20],
          iconAnchor: [20, 10],
        }),
        interactive: false,
      });
      marker.addTo(map);
      layersRef.current.push(marker);
    });
  }, [L, data, selected, compare, onSelect]);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        crossOrigin=""
      />
      <div ref={mapRef} className="w-full h-full rounded-2xl" />
      <style jsx global>{`
        .score-tooltip {
          background: white !important;
          border: 1px solid #E5E7EB !important;
          border-radius: 8px !important;
          padding: 6px 10px !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
        }
        .score-tooltip::before { display: none !important; }
        .score-label { background: none !important; border: none !important; }
      `}</style>
    </>
  );
}

export default function MapPage() {
  const [data, setData] = useState<NeighborhoodData[]>([]);
  const [selected, setSelected] = useState<NeighborhoodData | null>(null);
  const [compare, setCompare] = useState<NeighborhoodData | null>(null);

  useEffect(() => {
    fetch("/api/neighborhoods")
      .then((r) => r.json())
      .then(setData);
  }, []);

  function handleClick(n: NeighborhoodData) {
    if (selected && selected.slug === n.slug) {
      setSelected(null);
      setCompare(null);
    } else if (!selected) {
      setSelected(n);
    } else {
      setCompare(n);
    }
  }

  function clearSelection() {
    setSelected(null);
    setCompare(null);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <SearchBar />
      </div>

      <div className="flex items-baseline gap-3 mb-4">
        <h1 className="text-2xl font-bold text-gray-900">SF Sun Map</h1>
        <span className="text-sm text-gray-400">Click neighborhoods to compare</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ height: "600px" }}>
          <LeafletMap
            data={data}
            selected={selected}
            compare={compare}
            onSelect={handleClick}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {selected ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">
                  {compare ? "Comparing" : "Selected"}
                </h3>
                <button onClick={clearSelection} className="text-xs text-gray-400 hover:text-gray-600">
                  Clear
                </button>
              </div>

              <div className={`rounded-xl border p-4 ${scoreBg(selected.score)}`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-gray-900">{selected.name}</h4>
                  <span className="text-2xl font-black" style={{ color: scoreColor(selected.score) }}>{selected.score}</span>
                </div>
                <p className="text-sm text-gray-600">{selected.label}</p>
                <div className="grid grid-cols-3 gap-2 mt-3 text-xs text-gray-500">
                  <div>{selected.sunHours.toLocaleString()} sun hrs</div>
                  <div>{selected.fogDays} fog days</div>
                  <div>{selected.windMph} mph wind</div>
                </div>
              </div>

              {compare && (
                <>
                  <div className="text-center text-gray-400 text-xs">vs</div>
                  <div className={`rounded-xl border p-4 ${scoreBg(compare.score)}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-gray-900">{compare.name}</h4>
                      <span className="text-2xl font-black" style={{ color: scoreColor(compare.score) }}>{compare.score}</span>
                    </div>
                    <p className="text-sm text-gray-600">{compare.label}</p>
                    <div className="grid grid-cols-3 gap-2 mt-3 text-xs text-gray-500">
                      <div>{compare.sunHours.toLocaleString()} sun hrs</div>
                      <div>{compare.fogDays} fog days</div>
                      <div>{compare.windMph} mph wind</div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-100 p-4 text-sm text-gray-600">
                    <p className="font-medium text-gray-900 mb-2">Verdict</p>
                    {selected.score > compare.score ? (
                      <p><strong>{selected.name}</strong> gets {selected.sunHours - compare.sunHours} more sun hours and {compare.fogDays - selected.fogDays} fewer fog days per year than <strong>{compare.name}</strong>.</p>
                    ) : selected.score < compare.score ? (
                      <p><strong>{compare.name}</strong> gets {compare.sunHours - selected.sunHours} more sun hours and {selected.fogDays - compare.fogDays} fewer fog days per year than <strong>{selected.name}</strong>.</p>
                    ) : (
                      <p>These neighborhoods have very similar sun exposure.</p>
                    )}
                  </div>
                </>
              )}

              {!compare && (
                <p className="text-xs text-gray-400 text-center">Click another neighborhood to compare</p>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400 text-sm">
              <p className="mb-2">Click a neighborhood on the map</p>
              <p className="text-xs">Or search for a specific address above</p>
            </div>
          )}

          {/* Quick ranking */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-900 text-sm mb-3">All Neighborhoods</h3>
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {data.map((n, i) => (
                <button
                  key={n.slug}
                  onClick={() => handleClick(n)}
                  className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-sm hover:bg-gray-50 transition-colors ${
                    selected?.slug === n.slug || compare?.slug === n.slug ? "bg-gray-100" : ""
                  }`}
                >
                  <span className="text-gray-500 w-5 text-xs">{i + 1}</span>
                  <span className="flex-1 text-left text-gray-700">{n.name}</span>
                  <span className="font-bold" style={{ color: scoreColor(n.score) }}>{n.score}</span>
                </button>
              ))}
            </div>
          </div>

          <Link href="/methodology" className="block text-center text-xs text-gray-400 hover:text-amber-600">
            How are scores calculated?
          </Link>
        </div>
      </div>
    </div>
  );
}
