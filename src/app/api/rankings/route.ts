import { NextResponse } from "next/server";
import { getNeighborhoodRanking } from "@/lib/data";

export async function GET() {
  const rankings = getNeighborhoodRanking();

  return NextResponse.json({
    rankings,
    city: "San Francisco",
    lastUpdated: "2026-03-01",
    totalNeighborhoods: rankings.length,
  }, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
