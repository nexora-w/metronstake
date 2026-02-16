import { NextRequest, NextResponse } from "next/server";

const LEADERBOARD_API_URL = "https://cabrzy.com/api/leaderboard";

export type LeaderboardEntry = {
  rank: number;
  leaderboard_type: string;
  masked_username: string;
  wagered: number;
  prize: string;
  last_updated: string;
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") ?? "current";

    const res = await fetch(LEADERBOARD_API_URL, {
      next: { revalidate: 60 },
      headers: { "User-Agent": "Mozilla/5.0 (compatible; LazardBonus/1.0)" },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch leaderboard" },
        { status: res.status }
      );
    }

    const data: LeaderboardEntry[] = await res.json();
    const filtered = data.filter((entry) => entry.leaderboard_type === type);
    return NextResponse.json(filtered);
  } catch (err) {
    console.error("[leaderboard] fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
