import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LeaderboardTable } from "@/components/leaderboard-table";
import localFont from "next/font/local";
import Image from "next/image";
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
          <div className="mb-8 text-center flex flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center w-full gap-5">
              <div className="flex items-center justify-center w-full">
                <Image
                  src="/images/leaderboard/left.svg"
                  alt="Leaderboard  "
                  width={30}
                  height={30}
                  className="w-[20px] h-[20px] sm:w-[30px] sm:h-[30px] md:w-[50px] md:h-[50px]"
                />
                <div
                  className={`${sportsWorld.className} text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white`}
                >
                  <span
                    style={{
                      backgroundImage:
                        "linear-gradient(180deg, #FFFEE3 0%, #FAF12B 46%, #DC8F00 80%, #DC8F00 100%)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      color: "transparent",
                      WebkitTextFillColor: "transparent",
                      display: "inline-block",
                    }}
                    className="mr-1 sm:mr-2"
                  >
                    $
                  </span>
                  15,000
                </div>
                <Image
                  src="/images/leaderboard/right.svg"
                  alt="right"
                  width={30}
                  height={30}
                  className="w-[20px] h-[20px] sm:w-[30px] sm:h-[30px] md:w-[50px] md:h-[50px]"
                />
              </div>
              <div
                className={`${sportsWorld.className} text-center text-lg sm:text-2xl md:text-3xl font-bold`}
                style={{
                  backgroundImage:
                    "radial-gradient(100% 100% at 50% 0%, #FFFEE3 0%, #FAF12B 46%, #DC8F00 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  WebkitTextFillColor: "transparent",
                  display: "inline-block",
                }}
              >
                Monthly Leaderboard
              </div>
            </div>
          </div>
          <LeaderboardTable />
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
