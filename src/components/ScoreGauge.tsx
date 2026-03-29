"use client";

import { getScoreColor } from "@/lib/data";

interface ScoreGaugeProps {
  score: number;
  label: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export default function ScoreGauge({ score, label, size = "md", showLabel = true }: ScoreGaugeProps) {
  const color = getScoreColor(score);
  const sizes = {
    sm: { width: 80, stroke: 6, fontSize: 20, labelSize: 10 },
    md: { width: 140, stroke: 8, fontSize: 36, labelSize: 14 },
    lg: { width: 200, stroke: 10, fontSize: 52, labelSize: 18 },
  };
  const s = sizes[size];
  const radius = (s.width - s.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const center = s.width / 2;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={s.width} height={s.width} viewBox={`0 0 ${s.width} ${s.width}`}>
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={s.stroke}
          className="text-gray-100"
        />
        {/* Score arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={s.stroke}
          strokeDasharray={`${progress} ${circumference - progress}`}
          strokeDashoffset={circumference / 4}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
        />
        {/* Score number */}
        <text
          x={center}
          y={center}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={s.fontSize}
          fontWeight="700"
          fill={color}
        >
          {score}
        </text>
      </svg>
      {showLabel && (
        <span
          className="font-semibold tracking-wide uppercase"
          style={{ color, fontSize: s.labelSize }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
