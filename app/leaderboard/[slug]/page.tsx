import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { LeaderboardContent } from "@/components/leaderboard-content"
import type { Metadata } from "next"

const siteData: Record<
  string,
  {
    name: string
    code: string
    rules: { type: string; multiplier: string }[]
    prizePool: number
    prizes: number[]
    entries: { rank: number; name: string; wagered: number; reward: number }[]
  }
> = {
  csgoroll: {
    name: "CSGORoll",
    code: "METRON",
    rules: [
      { type: "Slots", multiplier: "1:1" },
      { type: "Sportsbook", multiplier: "1:2" },
      { type: "Originals", multiplier: "1:0.2" },
    ],
    prizePool: 500,
    prizes: [150, 100, 75, 50, 40, 30, 20, 15, 12, 8],
    entries: [
      { rank: 1, name: "PlayerOne", wagered: 12450.0, reward: 150.0 },
      { rank: 2, name: "GamingKing", wagered: 9870.5, reward: 100.0 },
      { rank: 3, name: "LuckyAce", wagered: 7320.25, reward: 75.0 },
      { rank: 4, name: "HighRoller", wagered: 5100.0, reward: 50.0 },
      { rank: 5, name: "WagerPro", wagered: 4200.75, reward: 40.0 },
      { rank: 6, name: "RollMaster", wagered: 3100.0, reward: 30.0 },
      { rank: 7, name: "CaseDrop", wagered: 2750.5, reward: 20.0 },
      { rank: 8, name: "SpinWin", wagered: 2100.0, reward: 15.0 },
      { rank: 9, name: "BetVictor", wagered: 1650.25, reward: 12.0 },
      { rank: 10, name: "CoinFlip", wagered: 1200.0, reward: 8.0 },
    ],
  },
  hypedrop: {
    name: "HypeDrop",
    code: "METRON",
    rules: [
      { type: "Cases", multiplier: "1:1" },
      { type: "Battles", multiplier: "1:1.5" },
      { type: "Upgrades", multiplier: "1:0.5" },
    ],
    prizePool: 300,
    prizes: [100, 70, 50, 30, 20, 15, 10, 5],
    entries: [
      { rank: 1, name: "BoxHunter", wagered: 8700.0, reward: 100.0 },
      { rank: 2, name: "UnboxKing", wagered: 6550.0, reward: 70.0 },
      { rank: 3, name: "DropLord", wagered: 4200.5, reward: 50.0 },
      { rank: 4, name: "CrateCrazy", wagered: 3100.0, reward: 30.0 },
      { rank: 5, name: "OpenAll", wagered: 2450.25, reward: 20.0 },
    ],
  },
  razed: {
    name: "Razed",
    code: "METRON",
    rules: [
      { type: "Slots", multiplier: "1:1" },
      { type: "Sportsbook", multiplier: "1:2" },
      { type: "Originals", multiplier: "1:0.2" },
    ],
    prizePool: 400,
    prizes: [120, 80, 60, 45, 35, 25, 15, 10, 5, 5],
    entries: [
      { rank: 1, name: "RazedElite", wagered: 10250.0, reward: 120.0 },
      { rank: 2, name: "VIPGamer", wagered: 7800.75, reward: 80.0 },
      { rank: 3, name: "TopWager", wagered: 5400.0, reward: 60.0 },
      { rank: 4, name: "SlotChamp", wagered: 4100.5, reward: 45.0 },
      { rank: 5, name: "BetStorm", wagered: 3200.0, reward: 35.0 },
      { rank: 6, name: "SpinKing", wagered: 2800.25, reward: 25.0 },
      { rank: 7, name: "LuckyStar", wagered: 2150.0, reward: 15.0 },
      { rank: 8, name: "WagerBoss", wagered: 1700.0, reward: 10.0 },
      { rank: 9, name: "GamePro", wagered: 1200.5, reward: 5.0 },
      { rank: 10, name: "RollDice", wagered: 900.0, reward: 5.0 },
    ],
  },
  gamdom: {
    name: "Gamdom",
    code: "METRON",
    rules: [
      { type: "Slots", multiplier: "1:1" },
      { type: "Sports", multiplier: "1:2" },
      { type: "Crash", multiplier: "1:0.5" },
      { type: "Roulette", multiplier: "1:0.5" },
    ],
    prizePool: 350,
    prizes: [100, 75, 55, 40, 30, 20, 15, 10, 5],
    entries: [
      { rank: 1, name: "GamdomPro", wagered: 9400.0, reward: 100.0 },
      { rank: 2, name: "CrashKing", wagered: 7200.5, reward: 75.0 },
      { rank: 3, name: "BetMaster", wagered: 5100.0, reward: 55.0 },
      { rank: 4, name: "RouletteGod", wagered: 3900.25, reward: 40.0 },
      { rank: 5, name: "SlotQueen", wagered: 3000.0, reward: 30.0 },
    ],
  },
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const data = siteData[slug]
  return {
    title: data ? `Metron | ${data.name} Leaderboard` : "Metron | Leaderboard",
    description: data
      ? `Compete on the ${data.name} leaderboard for a share of the $${data.prizePool} prize pool!`
      : "View leaderboard rankings",
  }
}

export default async function LeaderboardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const data = siteData[slug]

  if (!data) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground">Leaderboard Not Found</h1>
            <p className="mt-2 text-muted-foreground">This leaderboard does not exist.</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // End date: end of current week (Sunday midnight)
  const now = new Date()
  const daysUntilSunday = 7 - now.getDay()
  const endDate = new Date(now)
  endDate.setDate(now.getDate() + daysUntilSunday)
  endDate.setHours(23, 59, 59, 999)

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <LeaderboardContent
          siteName={data.name}
          code={data.code}
          rules={data.rules}
          prizePool={data.prizePool}
          prizes={data.prizes}
          entries={data.entries}
          endDateISO={endDate.toISOString()}
        />
      </main>
      <Footer />
    </div>
  )
}
