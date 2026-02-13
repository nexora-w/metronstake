import Link from "next/link"
import { ArrowDown } from "lucide-react"

export function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center overflow-hidden px-4 py-24 text-center lg:py-36">
      {/* Background glow effect */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-3xl">
        <h1 className="text-5xl font-extrabold tracking-tight text-foreground md:text-7xl">
          La<span className="text-primary">Zard</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Unlock exclusive deposit bonuses or free cases and support me across your favorite sites with the code LaZard. Use it today and enjoy amazing perks!
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="#leaderboards"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
          >
            Leaderboards
            <ArrowDown className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
