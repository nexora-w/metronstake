"use client";

import Image from "next/image";

const CLAIM_URL = "https://discord.gg/rollinriches";

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
  Emerald: {
    color: "rgb(80, 200, 120)",
    bg: "rgba(80, 200, 120, 0.082)",
    border: "rgba(80, 200, 120, 0.19)",
  },
  Sapphire: {
    color: "rgb(15, 82, 186)",
    bg: "rgba(15, 82, 186, 0.082)",
    border: "rgba(15, 82, 186, 0.19)",
  },
  Diamond: {
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
  { tier: "Wood", volume: "10,000", bonus: "25" },
  { tier: "Wood", volume: "25,000", bonus: "63" },
  { tier: "Bronze", volume: "50,000", bonus: "125" },
  { tier: "Bronze", volume: "75,000", bonus: "188" },
  { tier: "Bronze", volume: "100,000", bonus: "250" },
  { tier: "Silver", volume: "150,000", bonus: "375" },
  { tier: "Silver", volume: "200,000", bonus: "500" },
  { tier: "Silver", volume: "250,000", bonus: "625" },
  { tier: "Gold", volume: "350,000", bonus: "875" },
  { tier: "Gold", volume: "500,000", bonus: "1,250" },
  { tier: "Gold", volume: "750,000", bonus: "1,875" },
  { tier: "Emerald", volume: "1,000,000", bonus: "2,500" },
  { tier: "Emerald", volume: "1,250,000", bonus: "3,125" },
  { tier: "Sapphire", volume: "1,500,000", bonus: "3,750" },
  { tier: "Sapphire", volume: "2,000,000", bonus: "5,000" },
  { tier: "Diamond", volume: "2,500,000", bonus: "6,250" },
  { tier: "Diamond", volume: "5,000,000", bonus: "12,500" },
  { tier: "Obsidian", volume: "10,000,000", bonus: "25,000" },
  { tier: "Obsidian", volume: "15,000,000", bonus: "37,500" },
  { tier: "Obsidian", volume: "20,000,000", bonus: "50,000" },
  { tier: "Obsidian", volume: "30,000,000", bonus: "75,000" },
  { tier: "Obsidian", volume: "40,000,000", bonus: "100,000" },
];

export function RewardsTable() {
  return (
    <div className="transition-all duration-700 ease-out opacity-100 translate-y-0">
      <div
        className="rounded-xl sm:rounded-t-none overflow-hidden"
        style={{
          background: "rgba(15, 15, 15, 0.7)",
          border: "1px solid rgba(234, 234, 234, 0.05)",
        }}
      >
        {REWARDS.map((row, i) => {
          const style = TIER_STYLES[row.tier];
          const isLast = i === REWARDS.length - 1;
          return (
            <div
              key={`${row.tier}-${row.volume}-${i}`}
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
                      src={`/images/tiers/${row.tier.toLowerCase()}.png`}
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
                    src={`/images/tiers/${row.tier.toLowerCase()}.png`}
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
              {/* Claim button */}
              <div className="w-16 sm:w-24 flex justify-end ml-2 sm:ml-0">
                <a
                  href={CLAIM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold text-[10px] sm:text-xs transition-all duration-150 whitespace-nowrap text-white"
                  style={{
                    background:
                      "linear-gradient(rgb(177, 18, 38) 0%, rgb(139, 0, 0) 100%)",
                    boxShadow:
                      "rgb(90, 0, 0) 0px 3px 0px, rgba(177, 18, 38, 0.3) 0px 4px 8px, rgba(255, 255, 255, 0.15) 0px 1px 0px inset",
                  }}
                >
                  Claim
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
