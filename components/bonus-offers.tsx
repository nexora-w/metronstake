import Image from "next/image"
import { ExternalLink, Sparkles } from "lucide-react"

export function BonusOffers() {
  return (
    <section id="bonuses" className="relative px-4 py-16 lg:px-8 min-h-[50vh] flex items-center justify-center border-b border-t border-gray-800">
      <div
        className="absolute inset-0 bg-[url('/images/pattern.png')] bg-center bg-cover bg-no-repeat opacity-20"
        aria-hidden
      />
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Bonus Offers
          </h2>
          <p className="mt-3 text-muted-foreground">
            Use my affiliate links for instant bonuses!
          </p>
        </div>

        <div className="flex justify-center">
          <a
            href="https://stake.com/?c=metron&offer=metron"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-b from-gray-900 to-gray-800 p-6 w-full max-w-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/50"
          >
            {/* Subtle top-edge highlight */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-60" aria-hidden />

            <div className="mb-4 flex flex-col gap-3">
              <div className="relative flex h-10 w-full items-center justify-center py-10">
                <Image
                  src="/images/stake_logo.png"
                  alt="Stake"
                  width={140}
                  height={40}
                  className="object-contain object-left"
                />
              </div>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary/80 shrink-0" />
                Exclusive offer
              </p>
            </div>

            <p className="mb-5 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-2">
              3 Free Cases + 5% Deposit Bonus
            </p>

            <div className="flex items-center justify-between gap-3 rounded-xl bg-background/40 px-3 py-2.5 ring-1 ring-border/50 backdrop-blur-sm">
              <span className="font-mono text-xs font-semibold tracking-wider text-primary">
                METRON
              </span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Code
              </span>
            </div>

            <div className="mt-4 flex items-center justify-end gap-2 text-xs font-medium text-primary opacity-90 transition-opacity group-hover:opacity-100">
              <span>Claim offer</span>
              <ExternalLink className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2.5} />
            </div>
          </a>
        </div>
      </div>
    </section>
  )
}
