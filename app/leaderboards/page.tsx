import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LeaderboardsPanel } from "@/components/leaderboards-panel";
import localFont from "next/font/local";
const sportsWorld = localFont({
  src: "../../public/fonts/Sports World-Regular.ttf",
  display: "swap",
  variable: "--font-sports-world",
});

export default function LeaderboardsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[url('/leaderbg-hero.png')] bg-center bg-cover bg-fixed bg-no-repeat">
      <Navbar />
      <main className="flex-1 px-4 py-8 sm:px-6 md:px-8 lg:px-12 my-20">
        <div className="mx-auto max-w-4xl">
          <LeaderboardsPanel sportsWorldClassName={sportsWorld.className} />
          <div className="mt-6 rounded border border-amber-500/40 bg-black/40 px-4 py-3 backdrop-blur-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-amber-400/90">
              How games count toward the leaderboard
            </p>
            <ul className="space-y-1 text-sm text-white/90">
              <li><span className="text-amber-300 font-medium">RTP ≤ 98%</span> → 100% of wagered amount counts</li>
              <li><span className="text-amber-300 font-medium">RTP &gt; 98%</span> → 50% of wagered amount counts</li>
              <li><span className="text-amber-300 font-medium">RTP ≥ 99%</span> → 10% of wagered amount counts</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
