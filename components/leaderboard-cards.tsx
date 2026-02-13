import Link from "next/link"
import { Trophy, ArrowRight } from "lucide-react"

const leaderboards = [
  {
    site: "CSGORoll",
    description: "Weekly leaderboard competitions with massive prize pools",
    slug: "csgoroll",
  },
  {
    site: "HypeDrop",
    description: "Daily challenges and monthly tournaments",
    slug: "hypedrop",
  },
  {
    site: "Razed",
    description: "VIP rewards and exclusive competitions",
    slug: "razed",
  },
  {
    site: "Gamdom",
    description: "VIP rewards and exclusive competitions",
    slug: "gamdom",
  },
]

export function LeaderboardCards() {
  return (
    <section id="leaderboards" className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Leaderboards
        </h2>
        <p className="mt-3 text-muted-foreground">
          Compete for glory and rewards
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {leaderboards.map((lb) => (
          <Link
            key={lb.slug}
            href={`/leaderboard/${lb.slug}`}
            className="group flex items-center gap-5 rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Trophy className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground">{lb.site}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{lb.description}</p>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
          </Link>
        ))}
      </div>
    </section>
  )
}
