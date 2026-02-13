import { Gift, ExternalLink } from "lucide-react"

const bonuses = [
  {
    site: "CSGORoll",
    code: "LAZARD",
    bonus: "3 Free Cases + 5% Deposit Bonus",
    color: "from-emerald-600/20 to-emerald-900/10",
    borderColor: "border-emerald-500/30",
    link: "#",
  },
  {
    site: "HypeDrop",
    code: "LAZARD",
    bonus: "Free Case on Sign Up",
    color: "from-blue-600/20 to-blue-900/10",
    borderColor: "border-blue-500/30",
    link: "#",
  },
  {
    site: "Clash.GG",
    code: "LAZARD",
    bonus: "5% Deposit Bonus",
    color: "from-amber-600/20 to-amber-900/10",
    borderColor: "border-amber-500/30",
    link: "#",
  },
  {
    site: "Gamdom",
    code: "LAZARD",
    bonus: "15% Rakeback for 7 Days",
    color: "from-red-600/20 to-red-900/10",
    borderColor: "border-red-500/30",
    link: "#",
  },
]

export function BonusOffers() {
  return (
    <section id="bonuses" className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Bonus Offers
        </h2>
        <p className="mt-3 text-muted-foreground">
          Use my affiliate links for instant bonuses!
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {bonuses.map((bonus) => (
          <a
            key={bonus.site}
            href={bonus.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative flex flex-col overflow-hidden rounded-xl border ${bonus.borderColor} bg-gradient-to-b ${bonus.color} p-6 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5`}
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <Gift className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground">{bonus.site}</h3>
            </div>
            <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">{bonus.bonus}</p>
            <div className="flex items-center justify-between">
              <span className="rounded-md bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
                Code: {bonus.code}
              </span>
              <ExternalLink className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
