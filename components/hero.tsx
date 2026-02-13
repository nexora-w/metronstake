"use client"

import Image from "next/image"
import { HiOutlineChartBar } from "react-icons/hi";
import { useRouter } from "next/navigation";

export function Hero() {
  const router = useRouter();
  return (
    <section className="relative flex flex-col items-center justify-center overflow-hidden px-4 py-24 text-center lg:py-36 bg-[url('/hero-bg.png')] bg-cover bg-center min-h-screen">
      {/* Background glow effect */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-3xl">
        <div className="flex items-center justify-center p-8">
          <div
            className="cursor-pointer transition-all duration-300 ease-out hover:scale-110 w-fit [filter:drop-shadow(0_0_0_transparent)] hover:[filter:drop-shadow(0_6px_12px_rgba(254,212,0,0.7))_drop-shadow(0_0_16px_rgba(254,212,0,0.4))]"
            style={{ willChange: 'filter' }}
          >
            <Image
              src="/logo.png"
              alt="Metron"
              width={250}
              height={250}
              priority
              className="block"
            />
          </div>
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight text-foreground md:text-7xl">
          <span className="text-primary">Metron</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Use code Metron on your go-to platforms to grab special deposit rewards or complimentary cases and give me a little boost while you’re at it. Activate it now and take advantage of the extra benefits waiting for you.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            className="
              relative overflow-hidden
              cursor-pointer
              px-6 py-2.5
              text-lg font-semibold
              text-primary
              border-2 border-primary
              rounded-[34px]
              bg-transparent
              transition-all duration-300
              ease-[cubic-bezier(0.23,1,0.320,1)]
              hover:scale-110
              hover:text-[#212121]
              hover:shadow-[0_0_20px_rgba(142,70,49,0.4)]
              active:scale-100
              group
              flex items-center justify-center gap-2
            "
            onClick={() => {
              router.push("/#leaderboards");
            }}
          >
            {/* Animated background circle — sized from button so it always fills on hover */}
            <span
              className="
                absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                w-[300%] aspect-square
                rounded-full
                bg-primary
                scale-0
                transition-all duration-700
                ease-[cubic-bezier(0.23,1,0.320,1)]
                group-hover:scale-100
                -z-10
              "
            ></span>
            <HiOutlineChartBar className="h-4 w-4" />
            Leaderboards
          </button>
        </div>
      </div>
    </section>
  )
}
