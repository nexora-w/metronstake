import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { RewardsTable } from "@/components/rewards-table";
import Image from "next/image";
import localFont from "next/font/local";
const sportsWorld = localFont({
  src: "../../public/fonts/Sports World-Regular.ttf",
  display: "swap",
  variable: "--font-sports-world",
});

export default function RewardsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[url('/rewardbg-hero.png')] bg-center bg-cover bg-fixed bg-no-repeat">
      <Navbar />
      <main className="flex-1 px-4 py-8 sm:px-6 md:px-8 lg:px-12 my-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center w-full">
              <div
                className={`rewards-title-shadow text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#bc5045]`}
              >
                Rewards
              </div>
            </div>
            <p className="mt-2 text-muted-foreground">
              Claim your tier bonuses based on volume.
            </p>
            <div className="mt-4 rounded-lg border border-amber-500/40 bg-black/50 px-4 py-3 backdrop-blur-sm max-w-2xl mx-auto">
              <p className="text-sm text-amber-200/95">
                <strong className="text-amber-400">To claim rank-up bonuses:</strong> join my Discord and open a support ticket.
              </p>
              <p className="text-xs text-white/70 mt-1">
                Use the Claim button below to go to Discord.
              </p>
            </div>
          </div>
          <RewardsTable />
        </div>
      </main>
      <Footer />
    </div>
  )
}
