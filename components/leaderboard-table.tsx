"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

const ROWS_PER_PAGE = 10;

const MOCK_LEADERBOARD: { rank: number; player: string; volume: string; tier: string }[] = [
  { rank: 1, player: "Metron", volume: "2,450,000", tier: "Platinum IV" },
  { rank: 2, player: "PlayerTwo", volume: "1,890,000", tier: "Platinum III" },
  { rank: 3, player: "HighRoller", volume: "1,520,000", tier: "Platinum III" },
  { rank: 4, player: "LuckySeven", volume: "1,100,000", tier: "Platinum III" },
  { rank: 5, player: "AceSpade", volume: "980,000", tier: "Platinum II" },
  { rank: 6, player: "DiamondHand", volume: "750,000", tier: "Platinum II" },
  { rank: 7, player: "StackMaster", volume: "620,000", tier: "Platinum I" },
  { rank: 8, player: "GreenMachine", volume: "510,000", tier: "Platinum I" },
  { rank: 9, player: "BetKing", volume: "445,000", tier: "Gold" },
  { rank: 10, player: "AllInAndy", volume: "380,000", tier: "Gold" },
  { rank: 11, player: "SilverFox", volume: "295,000", tier: "Silver" },
  { rank: 12, player: "BronzeBoss", volume: "210,000", tier: "Bronze" },
  { rank: 13, player: "WoodWorker", volume: "95,000", tier: "Wood" },
];

const RANK_STYLES: Record<number, { bg: string; text: string }> = {
  1: { bg: "rgba(255, 215, 0, 0.2)", text: "rgb(255, 215, 0)" },
  2: { bg: "rgba(192, 192, 192, 0.2)", text: "rgb(192, 192, 192)" },
  3: { bg: "rgba(205, 127, 50, 0.2)", text: "rgb(205, 127, 50)" },
};

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
  const totalPages = Math.ceil(MOCK_LEADERBOARD.length / ROWS_PER_PAGE) || 1;
  const start = page * ROWS_PER_PAGE;
  const rows = MOCK_LEADERBOARD.slice(start, start + ROWS_PER_PAGE);

  return (
    <motion.div
      className="transition-all duration-700 ease-out"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    >
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
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Player</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">Volume</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">Tier</span>
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
              <div className="min-w-0">
                <span className="font-semibold text-foreground truncate block">{row.player}</span>
              </div>
              <div className="col-span-2 sm:col-span-1 flex sm:justify-end">
                <span className="text-sm sm:text-base font-semibold">
                  <span className="text-green-500">$</span>
                  <span className="text-white">{row.volume}</span>
                </span>
              </div>
              <div className="hidden sm:flex justify-end">
                <span className="text-xs font-medium text-muted-foreground">{row.tier}</span>
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
