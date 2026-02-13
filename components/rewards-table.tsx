"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const CLAIM_URL = "https://stake.com/?c=metron&offer=metron";

function tierImageSlug(tier: string): string {
  if (tier.startsWith("Platinum")) return "platinum";
  if (tier.startsWith("Diamond")) return "diamond";
  return tier.toLowerCase();
}

const TIER_STYLES: Record<
  string,
  { color: string; bg: string; border: string }
> = {
  Wood: {
    color: "rgb(139, 69, 19)",
    bg: "rgba(139, 69, 19, 0.082)",
    border: "rgba(139, 69, 19, 0.19)",
  },
  Bronze: {
    color: "rgb(205, 127, 50)",
    bg: "rgba(205, 127, 50, 0.082)",
    border: "rgba(205, 127, 50, 0.19)",
  },
  Silver: {
    color: "rgb(168, 168, 168)",
    bg: "rgba(168, 168, 168, 0.082)",
    border: "rgba(168, 168, 168, 0.19)",
  },
  Gold: {
    color: "rgb(255, 215, 0)",
    bg: "rgba(255, 215, 0, 0.082)",
    border: "rgba(255, 215, 0, 0.19)",
  },
  "Platinum I": {
    color: "rgb(229, 228, 226)",
    bg: "rgba(229, 228, 226, 0.082)",
    border: "rgba(229, 228, 226, 0.19)",
  },
  "Platinum II": {
    color: "rgb(229, 228, 226)",
    bg: "rgba(229, 228, 226, 0.082)",
    border: "rgba(229, 228, 226, 0.19)",
  },
  "Platinum III": {
    color: "rgb(229, 228, 226)",
    bg: "rgba(229, 228, 226, 0.082)",
    border: "rgba(229, 228, 226, 0.19)",
  },
  "Platinum IV": {
    color: "rgb(229, 228, 226)",
    bg: "rgba(229, 228, 226, 0.082)",
    border: "rgba(229, 228, 226, 0.19)",
  },
  "Platinum V": {
    color: "rgb(229, 228, 226)",
    bg: "rgba(229, 228, 226, 0.082)",
    border: "rgba(229, 228, 226, 0.19)",
  },
  "Platinum VI": {
    color: "rgb(229, 228, 226)",
    bg: "rgba(229, 228, 226, 0.082)",
    border: "rgba(229, 228, 226, 0.19)",
  },
  "Diamond I": {
    color: "rgb(64, 224, 208)",
    bg: "rgba(64, 224, 208, 0.082)",
    border: "rgba(64, 224, 208, 0.19)",
  },
  "Diamond II": {
    color: "rgb(64, 224, 208)",
    bg: "rgba(64, 224, 208, 0.082)",
    border: "rgba(64, 224, 208, 0.19)",
  },
  "Diamond III": {
    color: "rgb(64, 224, 208)",
    bg: "rgba(64, 224, 208, 0.082)",
    border: "rgba(64, 224, 208, 0.19)",
  },
  "Diamond IV": {
    color: "rgb(64, 224, 208)",
    bg: "rgba(64, 224, 208, 0.082)",
    border: "rgba(64, 224, 208, 0.19)",
  },
  "Diamond V": {
    color: "rgb(64, 224, 208)",
    bg: "rgba(64, 224, 208, 0.082)",
    border: "rgba(64, 224, 208, 0.19)",
  },
  Obsidian: {
    color: "rgb(107, 35, 142)",
    bg: "rgba(107, 35, 142, 0.082)",
    border: "rgba(107, 35, 142, 0.19)",
  },
};

const REWARDS: { tier: string; volume: string; bonus: string }[] = [
  { tier: "Wood", volume: "1,000", bonus: "—" },
  { tier: "Bronze", volume: "10,000", bonus: "—" },
  { tier: "Silver", volume: "50,000", bonus: "—" },
  { tier: "Gold", volume: "100,000", bonus: "—" },
  { tier: "Platinum I", volume: "250,000", bonus: "—" },
  { tier: "Platinum II", volume: "500,000", bonus: "—" },
  { tier: "Platinum III", volume: "1,000,000", bonus: "—" },
  { tier: "Platinum IV", volume: "2,500,000", bonus: "—" },
  { tier: "Platinum V", volume: "5,000,000", bonus: "—" },
  { tier: "Platinum VI", volume: "10,000,000", bonus: "—" },
  { tier: "Diamond I", volume: "25,000,000", bonus: "—" },
  { tier: "Diamond II", volume: "50,000,000", bonus: "—" },
  { tier: "Diamond III", volume: "100,000,000", bonus: "—" },
  { tier: "Diamond IV", volume: "250,000,000", bonus: "—" },
  { tier: "Diamond V", volume: "500,000,000", bonus: "—" },
  { tier: "Obsidian", volume: "1,000,000,000", bonus: "—" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
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

export function RewardsTable() {
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
        {REWARDS.map((row, i) => {
          const style = TIER_STYLES[row.tier];
          const isLast = i === REWARDS.length - 1;
          return (
            <motion.div
              key={`${row.tier}-${row.volume}-${i}`}
              variants={rowVariants}
              whileHover={{ backgroundColor: "rgba(234, 234, 234, 0.03)" }}
              className="flex items-center px-3 sm:px-4 md:px-6 py-3 sm:py-3.5 transition-all duration-200 group"
              style={{
                borderBottom: isLast
                  ? "none"
                  : "1px solid rgba(234, 234, 234, 0.04)",
                background: "transparent",
              }}
            >
              {/* Desktop: icon + tier badge + volume */}
              <div className="hidden sm:flex items-center flex-1">
                <div className="w-12 flex-shrink-0 flex justify-center">
                  <div className="w-10 h-10 relative transition-transform duration-200 group-hover:scale-110">
                    <Image
                      alt={row.tier}
                      src={`/images/tiers/${tierImageSlug(row.tier)}.png`}
                      fill
                      className="object-contain"
                      sizes="40px"
                    />
                  </div>
                </div>
                <div className="flex-1 flex items-center gap-3">
                  <span
                    className="text-xs font-bold uppercase px-2.5 py-1 rounded"
                    style={{
                      color: style.color,
                      background: style.bg,
                      border: `1px solid ${style.border}`,
                    }}
                  >
                    {row.tier}
                  </span>
                  <span className="text-base font-semibold">
                    <span className="text-green-500">$</span>
                    <span className="text-white">{row.volume}</span>
                  </span>
                </div>
              </div>
              {/* Mobile: icon + tier + volume stacked */}
              <div className="flex sm:hidden items-center gap-3 flex-1">
                <div className="w-10 h-10 relative flex-shrink-0">
                  <Image
                    alt={row.tier}
                    src={`/images/tiers/${tierImageSlug(row.tier)}.png`}
                    fill
                    className="object-contain"
                    sizes="40px"
                  />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span
                    className="text-[10px] font-bold uppercase tracking-wide"
                    style={{ color: style.color }}
                  >
                    {row.tier}
                  </span>
                  <span className="text-sm font-semibold">
                    <span className="text-green-500">$</span>
                    <span className="text-white">{row.volume}</span>
                  </span>
                </div>
              </div>
              {/* Bonus amount */}
              <div className="w-16 sm:w-28 text-right sm:text-center">
                <span className="text-sm sm:text-base font-bold">
                  <span className="text-green-500">$</span>
                  <span className="text-white">{row.bonus}</span>
                </span>
              </div>
              {/* Claim button — same style as hero Leaderboards button */}
              <div className="w-16 sm:w-24 flex justify-end ml-2 sm:ml-0">
                <a
                  href={CLAIM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    relative overflow-hidden
                    cursor-pointer
                    px-3 sm:px-4 py-1.5 sm:py-2
                    text-[10px] sm:text-xs font-semibold
                    text-[#bc5045]
                    border-2 border-[#bc5045]
                    rounded-[34px]
                    bg-transparent
                    transition-all duration-300
                    ease-[cubic-bezier(0.23,1,0.320,1)]
                    hover:scale-110
                    hover:text-[#212121]
                    hover:shadow-[0_0_20px_rgba(188,80,69,0.4)]
                    active:scale-100
                    group
                    flex items-center justify-center
                    whitespace-nowrap
                  "
                >
                  <span
                    className="
                      absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                      w-[300%] aspect-square
                      rounded-full
                      bg-[#bc5045]
                      scale-0
                      transition-all duration-700
                      ease-[cubic-bezier(0.23,1,0.320,1)]
                      group-hover:scale-100
                      -z-10
                    "
                  />
                  Claim
                </a>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
