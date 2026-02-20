"use client";

import Image from "next/image";
import { useState, useMemo, useEffect } from "react";

const ROWS_PER_PAGE = 10;

type LeaderboardType = "current" | "previous" | "us_current" | "us_previous";

type LeaderboardEntry = {
  rank: number;
  leaderboard_type: string;
  masked_username: string;
  wagered: number;
  prize: string;
  last_updated: string;
};

const LEADERBOARD_TABS: { value: LeaderboardType; label: string }[] = [
  { value: "current", label: "Current" },
  { value: "previous", label: "Previous" }
];

const STATIC_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, leaderboard_type: "current", masked_username: "Plfokraker88i", wagered: 606.73, prize: "—", last_updated: "19-Feb-26 12:00 am" },
  { rank: 2, leaderboard_type: "current", masked_username: "PaunJebeMeme", wagered: 356.56, prize: "—", last_updated: "19-Feb-26 12:00 am" },
  { rank: 3, leaderboard_type: "current", masked_username: "RORUDMP", wagered: 100.0, prize: "—", last_updated: "19-Feb-26 12:00 am" },
  { rank: 4, leaderboard_type: "current", masked_username: "metronxlafkah", wagered: 70.91, prize: "—", last_updated: "19-Feb-26 12:00 am" },
  { rank: 5, leaderboard_type: "current", masked_username: "CrisScp892met", wagered: 43.66, prize: "—", last_updated: "19-Feb-26 12:00 am" },
];

function formatWagered(n: number): string {
  return n.toLocaleString();
}

/** Show only first 3 characters, rest as stars */
function maskUsername(username: string): string {
  if (!username || username.length <= 3) return username;
  return username.slice(0, 3) + "*".repeat(username.length - 3);
}

const RANK_STYLES: Record<number, { bg: string; text: string }> = {
  1: { bg: "rgba(228, 162, 18, 0.2)", text: "rgb(228, 162, 18)" },
  2: { bg: "rgba(153, 93, 59, 0.2)", text: "rgb(153, 93, 59)" },
  3: { bg: "rgba(129, 129, 131, 0.2)", text: "rgb(129, 129, 131)" },
};

export function LeaderboardTable() {
  const [type, setType] = useState<LeaderboardType>("current");
  const [page, setPage] = useState(0);

  const data = useMemo(() => {
    if (type === "current") return STATIC_LEADERBOARD;
    return []; // "Previous" tab: no static data; add entries here if needed
  }, [type]);

  useEffect(() => setPage(0), [type]);

  const topThree = data.slice(0, 3);
  const tableData = data.slice(3);
  const totalPages = Math.ceil(tableData.length / ROWS_PER_PAGE) || 1;
  const start = page * ROWS_PER_PAGE;
  const rows = tableData.slice(start, start + ROWS_PER_PAGE);

  return (
    <div className="transition-all duration-700 ease-out space-y-6">
      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {LEADERBOARD_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setType(tab.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              type === tab.value
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                : "bg-white/5 text-muted-foreground border border-white/10 hover:bg-white/10 hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {data.length > 0 && (
        <>
          {/* Top 3 podium cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 justify-items-center !mt-32 mb-12">
            {[topThree[1], topThree[0], topThree[2]].map((entry) => {
              if (!entry) return null;
              const rankStyle = RANK_STYLES[entry.rank];
              return (
                <div
                  key={`card-${entry.rank}-${entry.masked_username}-${type}`}
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
                      {(entry.masked_username[0] ?? "?").toUpperCase()}
                    </div>
                    <span className="text-center text-lg font-medium truncate max-w-full px-1 mt-2">
                      {maskUsername(entry.masked_username)}
                    </span>
                    <div className="flex flex-col items-center justify-center mt-2">
                      <div className="text-sm font-medium truncate max-w-full px-1">Wagered</div>
                      <div className="text-lg font-bold">${formatWagered(entry.wagered)}</div>
                    </div>
                    <div
                      className="flex items-center justify-center mt-2 w-4/5 p-2 gap-3 rounded-lg"
                      style={{ color: rankStyle?.text }}
                    >
                      <div className="text-lg font-bold">Prize:</div>
                      <div className="text-lg font-bold">{entry.prize}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            className="rounded-xl sm:rounded-t-none overflow-hidden"
            style={{
              background: "rgba(15, 15, 15, 0.7)",
              border: "1px solid rgba(234, 234, 234, 0.05)",
            }}
          >
            <div
              className="hidden sm:grid grid-cols-[4rem_1fr_8rem_7rem] gap-4 px-3 sm:px-4 md:px-6 py-3 sm:py-3.5 border-b border-[rgba(234,234,234,0.08)]"
              style={{ background: "rgba(234, 234, 234, 0.02)" }}
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rank</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">User</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">
                Wagered
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">
                Prize
              </span>
            </div>

            {rows.map((row, i) => {
              const isLast = i === rows.length - 1;
              const rankStyle = RANK_STYLES[row.rank];
              return (
                <div
                  key={`${row.rank}-${row.masked_username}-${type}-${start + i}`}
                  className="grid grid-cols-[3rem_1fr_auto] sm:grid-cols-[4rem_1fr_8rem_7rem] gap-2 sm:gap-4 items-center px-3 sm:px-4 md:px-6 py-3 sm:py-3.5 transition-colors duration-200 group hover:bg-white/[0.03]"
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
                      <span className="text-sm font-semibold text-muted-foreground w-8 sm:w-9 text-center">
                        {row.rank}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex items-center gap-3">
                    <div
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                      style={{ background: "rgba(234, 234, 234, 0.12)", color: "rgb(234, 234, 234)" }}
                      aria-hidden
                    >
                      {(row.masked_username[0] ?? "?").toUpperCase()}
                    </div>
                    <span className="font-semibold text-foreground truncate">{maskUsername(row.masked_username)}</span>
                  </div>
                  <div className="col-span-2 sm:col-span-1 flex sm:justify-end">
                    <span className="text-sm sm:text-base font-semibold">
                      <span className="text-green-500">$</span>
                      <span className="text-white">{formatWagered(row.wagered)}</span>
                    </span>
                  </div>
                  <div className="hidden sm:flex justify-end">
                    <span className="text-sm font-semibold text-amber-400">{row.prize}</span>
                  </div>
                </div>
              );
            })}
          </div>

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
        </>
      )}

      {data.length === 0 && (
        <div className="rounded-lg bg-white/5 border border-white/10 text-muted-foreground px-4 py-8 text-center">
          No leaderboard data for this period.
        </div>
      )}
    </div>
  );
}
