"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { searchAddress, getScoreColor } from "@/lib/data";

function WidgetContent() {
  const searchParams = useSearchParams();
  const address = searchParams.get("address") || "Mission District";
  const results = searchAddress(address);
  const data = results[0];

  if (!data) {
    return (
      <div className="p-4 text-center text-sm text-gray-500">
        Address not found
      </div>
    );
  }

  const color = getScoreColor(data.score);
  const seasonalValues = Object.values(data.seasonal);
  const peakMonth = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][
    seasonalValues.indexOf(Math.max(...seasonalValues))
  ];
  const lowMonth = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][
    seasonalValues.indexOf(Math.min(...seasonalValues))
  ];

  return (
    <div className="bg-white p-5 font-sans" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div className="flex items-center gap-2 mb-3">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="5" fill="#F59E0B" />
          <g stroke="#F59E0B" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="1" x2="12" y2="4" />
            <line x1="12" y1="20" x2="12" y2="23" />
            <line x1="1" y1="12" x2="4" y2="12" />
            <line x1="20" y1="12" x2="23" y2="12" />
          </g>
        </svg>
        <span className="text-xs font-bold text-gray-900">Sun Score</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-5xl font-bold" style={{ color }}>{data.score}</div>
        <div>
          <div className="text-sm font-semibold text-gray-900">{data.label}</div>
          <div className="text-xs text-gray-500">{data.comparison}</div>
          <div className="text-xs text-gray-400 mt-0.5">
            Peak: {Math.max(...seasonalValues)} ({peakMonth}) / Low: {Math.min(...seasonalValues)} ({lowMonth})
          </div>
        </div>
      </div>
      <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${data.score}%`, backgroundColor: color }} />
      </div>
      <div className="mt-2 text-right">
        <span className="text-[10px] text-gray-400">Sun Score</span>
      </div>
    </div>
  );
}

export default function WidgetPage() {
  return (
    <div className="min-h-0">
      <Suspense fallback={<div className="p-4 text-center text-sm text-gray-400">Loading...</div>}>
        <WidgetContent />
      </Suspense>
    </div>
  );
}
