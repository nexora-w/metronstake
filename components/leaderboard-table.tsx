"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

const ROWS_PER_PAGE = 10;

const MOCK_LEADERBOARD: { rank: number; player: string; volume: string; prize: string }[] = [
  { rank: 1, player: "Metron", volume: "2,450,000", prize: "1,500" },
  { rank: 2, player: "PlayerTwo", volume: "1,890,000", prize: "750" },
  { rank: 3, player: "HighRoller", volume: "1,520,000", prize: "250" },
  { rank: 4, player: "LuckySeven", volume: "1,100,000", prize: "125" },
  { rank: 5, player: "AceSpade", volume: "980,000", prize: "100" },
  { rank: 6, player: "DiamondHand", volume: "750,000", prize: "80" },
  { rank: 7, player: "StackMaster", volume: "620,000", prize: "60" },
  { rank: 8, player: "GreenMachine", volume: "510,000", prize: "50" },
  { rank: 9, player: "BetKing", volume: "445,000", prize: "40" },
  { rank: 10, player: "AllInAndy", volume: "380,000", prize: "30" },
  { rank: 11, player: "SilverFox", volume: "295,000", prize: "15" },
  { rank: 12, player: "BronzeBoss", volume: "210,000", prize: "0" },
  { rank: 13, player: "WoodWorker", volume: "95,000", prize: "0" },
];

const RANK_STYLES: Record<number, { bg: string; text: string }> = {
  1: { bg: "rgba(228, 162, 18, 0.2)", text: "rgb(228, 162, 18)" },
  2: { bg: "rgba(153, 93, 59, 0.2)", text: "rgb(153, 93, 59)" },
  3: { bg: "rgba(129, 129, 131, 0.2)", text: "rgb(129, 129, 131)" },
};

const TOP_THREE = MOCK_LEADERBOARD.slice(0, 3);
const TABLE_DATA = MOCK_LEADERBOARD.slice(3);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.1,
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 26,
    },
  },
};

export function LeaderboardTable() {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(TABLE_DATA.length / ROWS_PER_PAGE) || 1;
  const start = page * ROWS_PER_PAGE;
  const rows = TABLE_DATA.slice(start, start + ROWS_PER_PAGE);

  return (
    <motion.div
      className="transition-all duration-700 ease-out space-y-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Top 3 podium cards — fixed size, Image fill, content overlay */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 justify-items-center mt-24 mb-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[TOP_THREE[1], TOP_THREE[0], TOP_THREE[2]].map((entry) => {
          const rankStyle = RANK_STYLES[entry.rank];
          return (
            <motion.div
              key={`card-${entry.rank}-${entry.player}`}
              variants={rowVariants}
              className={`relative w-[124px] h-[190px] lg:w-[200px] lg:h-[307px] xl:w-[240px] xl:h-[368px] overflow-hidden ${entry.rank === 1 ? "-mt-4 sm:-mt-6 lg:-mt-8 xl:-mt-10" : ""}`}
            >
              <Image
                src={`/images/leaderboard/${entry.rank}.png`}
                alt={`Leaderboard ${entry.rank === 1 ? "first" : entry.rank === 2 ? "second" : "third"} place`}
                fill
                priority={entry.rank === 1}
                sizes="(min-width: 1280px) 240px, (min-width: 1024px) 200px, 124px"
                className="object-cover"
              />
              <div className="relative flex flex-col items-center justify-center gap-1.5 w-full h-full">
                <div
                  className="w-24 h-24 rounded border border-white/50 flex items-center justify-center text-sm font-bold shrink-0"
                  style={{ background: "rgba(234, 234, 234, 0.15)", color: "rgb(234, 234, 234)" }}
                  aria-hidden
                >
                  {entry.player.charAt(0).toUpperCase()}
                </div>
                <span className="text-center text-lg font-medium truncate max-w-full px-1 mt-2">{entry.player}</span>
                <div className="flex flex-col items-center justify-center mt-2">
                  <div className="text-sm font-medium truncate max-w-full px-1">
                    Wagered
                  </div>
                  <div className="text-lg font-bold">
                    ${entry.volume}
                  </div>
                </div>
                <div 
                  className="flex items-center justify-center mt-2 w-4/5 p-2 gap-3 rounded-lg"
                  style={{ color: rankStyle.text }}
                >
                  <div
                    className="text-lg font-bold"
                  >
                    Prize:
                  </div>
                  <div
                    className="text-lg font-bold"
                  >
                    ${entry.prize}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        className="rounded-xl sm:rounded-t-none overflow-hidden"
        style={{
          background: "rgba(15, 15, 15, 0.7)",
          border: "1px solid rgba(234, 234, 234, 0.05)",
        }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header row */}
        <div
          className="hidden sm:grid grid-cols-[4rem_1fr_8rem_7rem] gap-4 px-3 sm:px-4 md:px-6 py-3 sm:py-3.5 border-b border-[rgba(234,234,234,0.08)]"
          style={{ background: "rgba(234, 234, 234, 0.02)" }}
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rank</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">User</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">Wagered</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">Prize</span>
        </div>

        {rows.map((row, i) => {
          const isLast = i === rows.length - 1;
          const rankStyle = RANK_STYLES[row.rank];
          return (
            <motion.div
              key={`${row.rank}-${row.player}-${start + i}`}
              variants={rowVariants}
              whileHover={{ backgroundColor: "rgba(234, 234, 234, 0.03)" }}
              className="grid grid-cols-[3rem_1fr_auto] sm:grid-cols-[4rem_1fr_8rem_7rem] gap-2 sm:gap-4 items-center px-3 sm:px-4 md:px-6 py-3 sm:py-3.5 transition-all duration-200 group"
              style={{
                borderBottom: isLast ? "none" : "1px solid rgba(234, 234, 234, 0.04)",
                background: "transparent",
              }}
            >
              <div className="flex items-center">
                {rankStyle ? (
                  <span
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ background: rankStyle.bg, color: rankStyle.text }}
                  >
                    {row.rank}
                  </span>
                ) : (
                  <span className="text-sm font-semibold text-muted-foreground w-8 sm:w-9 text-center">{row.rank}</span>
                )}
              </div>
              <div className="min-w-0 flex items-center gap-3">
                <div
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                  style={{ background: "rgba(234, 234, 234, 0.12)", color: "rgb(234, 234, 234)" }}
                  aria-hidden
                >
                  {row.player.charAt(0).toUpperCase()}
                </div>
                <span className="font-semibold text-foreground truncate">{row.player}</span>
              </div>
              <div className="col-span-2 sm:col-span-1 flex sm:justify-end">
                <span className="text-sm sm:text-base font-semibold">
                  <span className="text-green-500">$</span>
                  <span className="text-white">{row.volume}</span>
                </span>
              </div>
              <div className="hidden sm:flex justify-end">
                <span className="text-sm font-semibold">
                  <span className="text-amber-400">$</span>
                  <span className="text-white">{row.prize}</span>
                </span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="p-2 rounded-lg border border-border bg-card/50 text-muted-foreground hover:text-foreground hover:bg-card disabled:opacity-40 disabled:pointer-events-none transition-colors"
            aria-label="Previous page"
          >
            <Image src="/images/leaderboard/left.svg" alt="" width={24} height={24} className="w-6 h-6" />
          </button>
          <span className="text-sm text-muted-foreground">
            Page {page + 1} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="p-2 rounded-lg border border-border bg-card/50 text-muted-foreground hover:text-foreground hover:bg-card disabled:opacity-40 disabled:pointer-events-none transition-colors"
            aria-label="Next page"
          >
            <Image src="/images/leaderboard/right.svg" alt="" width={24} height={24} className="w-6 h-6" />
          </button>
        </div>
      )}
    </motion.div>
  );
}
