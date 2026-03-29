import NeighborhoodRanking from "@/components/NeighborhoodRanking";
import { getNeighborhoodRanking } from "@/lib/data";
import SearchBar from "@/components/SearchBar";

export const metadata = {
  title: "SF Neighborhood Rankings - Sun Score",
  description: "All San Francisco neighborhoods ranked by Sun Score. See which areas get the most sunshine.",
};

export default function RankingsPage() {
  const rankings = getNeighborhoodRanking();

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">SF Neighborhood Rankings</h1>
      <p className="text-gray-500 text-center mb-8">
        All SF neighborhoods ranked by annual Sun Score. Based on satellite solar data, fog frequency, wind exposure, temperature stability, and seasonal consistency.
      </p>

      <div className="mb-8">
        <SearchBar />
      </div>

      <NeighborhoodRanking rankings={rankings} />

      <div className="mt-8 p-4 bg-amber-50 rounded-xl text-sm text-amber-800">
        <strong>Note:</strong> Scores represent neighborhood-level averages. Individual addresses within a neighborhood can vary by 5-10 points based on building shadows, street orientation, and elevation. Look up a specific address for a precise score.
      </div>

      <p className="text-center text-xs text-gray-400 mt-8">
        Calculated from NREL satellite solar data, NOAA weather observations, and terrain fog modeling.{" "}
        <a href="/methodology" className="text-amber-600 hover:text-amber-700 underline">How it works</a>
      </p>
    </div>
  );
}
