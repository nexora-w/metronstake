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
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-8 sm:px-6 md:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl mt-20">
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center w-full">
              <div
                className={`${sportsWorld.className} rewards-title-shadow text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary`}
              >
                Rewards
              </div>
            </div>
            <p className="mt-2 text-muted-foreground">
              Claim your tier bonuses based on volume.
            </p>
          </div>
          <RewardsTable />
        </div>
      </main>
      <Footer />
    </div>
  )
}
