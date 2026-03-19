"use client";

import Image from "next/image";
import { MonthlyCountdown } from "@/components/countdown-timer";
import { LeaderboardTable, type LeaderboardType } from "@/components/leaderboard-table";
import { useMemo, useState } from "react";

type LeaderboardsPanelProps = {
  sportsWorldClassName: string;
};

const PRIZE_BY_TYPE: Record<LeaderboardType, string> = {
  current: "7,500",
  previous: "3,000",
  us_current: "7,500",
  us_previous: "3,000",
};

export function LeaderboardsPanel({ sportsWorldClassName }: LeaderboardsPanelProps) {
  const [type, setType] = useState<LeaderboardType>("current");
  const prizeAmount = useMemo(() => PRIZE_BY_TYPE[type], [type]);

  return (
    <>
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
            <div className={`${sportsWorldClassName} text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white`}>
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
              {prizeAmount}
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
            className={`${sportsWorldClassName} text-center text-lg sm:text-2xl md:text-3xl font-bold`}
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
          <MonthlyCountdown />
        </div>
      </div>
      <LeaderboardTable type={type} onTypeChange={setType} />
    </>
  );
}
