"use client";

import { getScoreColor } from "@/lib/data";

interface SeasonalChartProps {
  seasonal: {
    jan: number; feb: number; mar: number; apr: number;
    may: number; jun: number; jul: number; aug: number;
    sep: number; oct: number; nov: number; dec: number;
  };
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function SeasonalChart({ seasonal }: SeasonalChartProps) {
  const values = [
    seasonal.jan, seasonal.feb, seasonal.mar, seasonal.apr,
    seasonal.may, seasonal.jun, seasonal.jul, seasonal.aug,
    seasonal.sep, seasonal.oct, seasonal.nov, seasonal.dec,
  ];

  const max = Math.max(...values);
  const min = Math.min(...values);

  return (
    <div>
      <div className="flex items-end justify-between gap-1 h-32">
        {values.map((val, i) => {
          const height = Math.max(8, (val / 100) * 100);
          const color = getScoreColor(val);
          return (
            <div key={months[i]} className="flex flex-col items-center gap-1 flex-1">
              <span className="text-xs font-medium" style={{ color }}>{val}</span>
              <div
                className="w-full rounded-t-sm transition-all duration-500 ease-out min-w-[16px]"
                style={{
                  height: `${height}%`,
                  backgroundColor: color,
                  opacity: 0.85,
                }}
              />
              <span className="text-[10px] text-gray-400 font-medium">{months[i]}</span>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-3 text-xs text-gray-500">
        <span>Peak: <strong className="text-gray-700">{max}</strong> ({months[values.indexOf(max)]})</span>
        <span>Low: <strong className="text-gray-700">{min}</strong> ({months[values.indexOf(min)]})</span>
      </div>
    </div>
  );
}
