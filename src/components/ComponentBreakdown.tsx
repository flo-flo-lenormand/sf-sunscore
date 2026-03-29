"use client";

import type { SunScoreData } from "@/lib/data";

interface ComponentBreakdownProps {
  components: SunScoreData["components"];
}

const componentLabels: Record<string, { label: string; unit: string; icon: string }> = {
  sunHours: { label: "Direct Sun Hours", unit: "hrs/year", icon: "\u2600\uFE0F" },
  fogFrequency: { label: "Fog Frequency", unit: "days/year", icon: "\uD83C\uDF2B\uFE0F" },
  windExposure: { label: "Wind Exposure", unit: "mph avg", icon: "\uD83D\uDCA8" },
  temperatureStability: { label: "Temp Stability", unit: "\u00B0F variance", icon: "\uD83C\uDF21\uFE0F" },
  seasonalConsistency: { label: "Seasonal Consistency", unit: "pt range", icon: "\uD83D\uDCC5" },
};

export default function ComponentBreakdown({ components }: ComponentBreakdownProps) {
  return (
    <div className="space-y-3">
      {Object.entries(components).map(([key, comp]) => {
        const meta = componentLabels[key];
        const percentage = Math.round(comp.weight * 100);
        return (
          <div key={key}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600">
                {meta.icon} {meta.label}
                <span className="text-gray-400 ml-1">({percentage}%)</span>
              </span>
              <span className="text-sm font-medium text-gray-800">
                {comp.value} {meta.unit}
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${comp.score}%`,
                  backgroundColor: comp.score >= 70 ? "#F59E0B" : comp.score >= 50 ? "#84CC16" : "#94A3B8",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
