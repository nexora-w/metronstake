import { NextResponse } from "next/server"

const KICK_CHANNEL_SLUG = "metron"
const KICK_API_URL = `https://kick.com/api/v2/channels/${KICK_CHANNEL_SLUG}`

export async function GET() {
  try {
    const res = await fetch(KICK_API_URL, {
      next: { revalidate: 60 },
      headers: { "User-Agent": "Mozilla/5.0 (compatible; MetronBonus/1.0)" },
    })
    if (!res.ok) {
      return NextResponse.json({ live: false }, { status: 200 })
    }
    const data = await res.json()
    const live = data?.livestream != null
    return NextResponse.json({ live })
  } catch {
    return NextResponse.json({ live: false }, { status: 200 })
  }
}
