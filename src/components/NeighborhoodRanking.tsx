"use client";

import { getScoreColor } from "@/lib/data";

interface RankingItem {
  name: string;
  score: number;
  label: string;
}

interface NeighborhoodRankingProps {
  rankings: RankingItem[];
}

export default function NeighborhoodRanking({ rankings }: NeighborhoodRankingProps) {
  return (
    <div className="space-y-2">
      {rankings.map((item, i) => (
        <div
          key={item.name}
          className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 hover:border-amber-200 hover:shadow-sm transition-all"
        >
          <span className="text-sm text-gray-400 font-medium w-6 text-right">
            {i + 1}
          </span>
          <div className="flex-1 min-w-0">
            <span className="text-sm font-medium text-gray-800 truncate block">
              {item.name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${item.score}%`,
                  backgroundColor: getScoreColor(item.score),
                }}
              />
            </div>
            <span
              className="text-sm font-bold w-8 text-right"
              style={{ color: getScoreColor(item.score) }}
            >
              {item.score}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
