import { NextRequest, NextResponse } from "next/server";
import { searchAddress } from "@/lib/data";

// This endpoint now serves mock data as a fallback.
// For real computation, use /api/compute with lat/lng/elevation.
// The score page handles geocoding + elevation client-side,
// then calls /api/compute for pure-math server-side computation.

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json(
      { error: "Missing required parameter: address. For real computation, use /api/compute with lat/lng." },
      { status: 400 }
    );
  }

  // Try mock data first (instant, no external API needed)
  const results = searchAddress(address);

  if (results.length === 0) {
    return NextResponse.json(
      { error: "No results found. For any SF address, use the score page which geocodes automatically, or call /api/compute with lat/lng." },
      { status: 404 }
    );
  }

  return NextResponse.json(results[0], {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
