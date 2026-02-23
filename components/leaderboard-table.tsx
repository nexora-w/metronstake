"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

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

const API_LEADERBOARD = "/api/leaderboard";

function formatWagered(n: number): string {
  return n.toLocaleString();
}

const EMPTY_SLOT_LABEL = "—";

/** Show only first 3 characters, rest as stars; empty slot shows as — */
function maskUsername(username: string): string {
  if (!username || !username.trim()) return EMPTY_SLOT_LABEL;
  if (username.length <= 3) return username;
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
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPage(0);
    setLoading(true);
    setError(null);
    fetch(`${API_LEADERBOARD}?type=${encodeURIComponent(type)}`)
      .then((res) => {
        if (!res.ok) throw new Error(res.status === 503 ? "Leaderboard not configured" : "Failed to load");
        return res.json();
      })
      .then((entries: LeaderboardEntry[]) => setData(Array.isArray(entries) ? entries : []))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load leaderboard"))
      .finally(() => setLoading(false));
  }, [type]);

  const topThree = data.slice(0, 3);
  const tableData = data.slice(3);
  const totalPages = Math.ceil(tableData.length / ROWS_PER_PAGE) || 1;
  const start = page * ROWS_PER_PAGE;
  const rows = tableData.slice(start, start + ROWS_PER_PAGE);

  return (
    <div className="transition-all duration-700 ease-out space-y-6">
      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-2">
        {LEADERBOARD_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setType(tab.value)}
            className={`min-h-[44px] min-w-[44px] px-5 py-2.5 sm:px-4 sm:py-2 rounded-lg text-sm font-medium transition-colors touch-manipulation ${
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
          {/* Top 3 podium cards — always horizontal (2nd, 1st, 3rd) */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 justify-items-center mt-20 sm:mt-28 md:!mt-32 mb-8 sm:mb-12">
            {[topThree[1], topThree[0], topThree[2]].map((entry) => {
              if (!entry) return null;
              const rankStyle = RANK_STYLES[entry.rank];
              return (
                <div
                  key={`card-${entry.rank}-${entry.masked_username}-${type}`}
                  className={`relative w-full max-w-[124px] sm:max-w-[124px] md:max-w-[160px] lg:max-w-[200px] xl:max-w-[240px] aspect-[124/190] overflow-hidden ${entry.rank === 1 ? "-mt-2 sm:-mt-4 lg:-mt-6 xl:-mt-8" : ""}`}
                >
                  <Image
                    src={`/images/leaderboard/${entry.rank}.png`}
                    alt={`Leaderboard ${entry.rank === 1 ? "first" : entry.rank === 2 ? "second" : "third"} place`}
                    fill
                    priority={entry.rank === 1}
                    sizes="(min-width: 1280px) 240px, (min-width: 1024px) 200px, (min-width: 768px) 160px, 124px"
                    className="object-cover"
                  />
                  <div className="relative flex flex-col items-center justify-center gap-0.5 sm:gap-1.5 w-full h-full px-0.5">
                    <div
                      className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 rounded border border-white/50 flex items-center justify-center text-xs sm:text-sm font-bold shrink-0"
                      style={{ background: "rgba(234, 234, 234, 0.15)", color: "rgb(234, 234, 234)" }}
                      aria-hidden
                    >
                      {(entry.masked_username?.trim() ? entry.masked_username[0] : null)?.toUpperCase() ?? "—"}
                    </div>
                    <span className="text-center text-xs sm:text-sm md:text-base lg:text-lg font-medium truncate max-w-full px-0.5 sm:px-1 mt-1 sm:mt-2">
                      {maskUsername(entry.masked_username)}
                    </span>
                    <div className="flex flex-col items-center justify-center mt-0.5 sm:mt-2">
                      <div className="text-[10px] sm:text-xs font-medium truncate max-w-full px-0.5">Wagered</div>
                      <div className="text-xs sm:text-sm md:text-base lg:text-lg font-bold">${formatWagered(entry.wagered)}</div>
                    </div>
                    <div
                      className="flex items-center justify-center mt-0.5 sm:mt-2 w-full max-w-[90%] p-1 sm:p-2 gap-1 sm:gap-3 rounded-lg flex-wrap"
                      style={{ color: rankStyle?.text }}
                    >
                      <div className="text-[10px] sm:text-sm lg:text-lg font-bold">Prize:</div>
                      <div className="text-[10px] sm:text-sm lg:text-lg font-bold truncate max-w-full">{entry.prize}</div>
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
            {/* Desktop: table header */}
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
              const borderStyle = isLast ? "none" : "1px solid rgba(234, 234, 234, 0.04)";
              return (
                <div
                  key={`${row.rank}-${row.masked_username}-${type}-${start + i}`}
                  className="transition-colors duration-200 hover:bg-white/[0.03]"
                  style={{ borderBottom: borderStyle, background: "transparent" }}
                >
                  {/* Mobile: card-style row */}
                  <div className="flex flex-col gap-2 px-3 py-3 sm:hidden">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {rankStyle ? (
                        <span
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                          style={{ background: rankStyle.bg, color: rankStyle.text }}
                        >
                          {row.rank}
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-muted-foreground w-8 h-8 flex items-center justify-center shrink-0">
                          {row.rank}
                        </span>
                      )}
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                        style={{ background: "rgba(234, 234, 234, 0.12)", color: "rgb(234, 234, 234)" }}
                        aria-hidden
                      >
                        {(row.masked_username?.trim() ? row.masked_username[0] : null)?.toUpperCase() ?? "—"}
                      </div>
                      <span className="font-semibold text-foreground text-sm truncate min-w-0">
                        {maskUsername(row.masked_username)}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pl-11 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="text-muted-foreground">Wagered</span>
                        <span className="font-semibold tabular-nums">
                          <span className="text-green-500">$</span>
                          <span className="text-white">{formatWagered(row.wagered)}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-muted-foreground shrink-0">Prize</span>
                        <span className="font-semibold text-amber-400 truncate">{row.prize}</span>
                      </div>
                    </div>
                  </div>

                  {/* Desktop: grid row */}
                  <div className="hidden sm:grid grid-cols-[4rem_1fr_8rem_7rem] gap-4 items-center px-3 sm:px-4 md:px-6 py-3 sm:py-3.5">
                    <div className="flex items-center">
                      {rankStyle ? (
                        <span
                          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                          style={{ background: rankStyle.bg, color: rankStyle.text }}
                        >
                          {row.rank}
                        </span>
                      ) : (
                        <span className="text-sm font-semibold text-muted-foreground w-9 text-center">
                          {row.rank}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                        style={{ background: "rgba(234, 234, 234, 0.12)", color: "rgb(234, 234, 234)" }}
                        aria-hidden
                      >
                        {(row.masked_username?.trim() ? row.masked_username[0] : null)?.toUpperCase() ?? "—"}
                      </div>
                      <span className="font-semibold text-foreground truncate">{maskUsername(row.masked_username)}</span>
                    </div>
                    <div className="flex justify-end">
                      <span className="text-sm sm:text-base font-semibold tabular-nums">
                        <span className="text-green-500">$</span>
                        <span className="text-white">{formatWagered(row.wagered)}</span>
                      </span>
                    </div>
                    <div className="flex justify-end">
                      <span className="text-sm font-semibold text-amber-400">{row.prize}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 sm:gap-4 mt-6 px-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="min-h-[44px] min-w-[44px] p-2.5 sm:p-2 rounded-lg border border-border bg-card/50 text-muted-foreground hover:text-foreground hover:bg-card disabled:opacity-40 disabled:pointer-events-none transition-colors touch-manipulation flex items-center justify-center"
                aria-label="Previous page"
              >
                <Image src="/images/leaderboard/left.svg" alt="" width={24} height={24} className="w-6 h-6" />
              </button>
              <span className="text-xs sm:text-sm text-muted-foreground tabular-nums min-w-[4rem] text-center">
                Page {page + 1} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="min-h-[44px] min-w-[44px] p-2.5 sm:p-2 rounded-lg border border-border bg-card/50 text-muted-foreground hover:text-foreground hover:bg-card disabled:opacity-40 disabled:pointer-events-none transition-colors touch-manipulation flex items-center justify-center"
                aria-label="Next page"
              >
                <Image src="/images/leaderboard/right.svg" alt="" width={24} height={24} className="w-6 h-6" />
              </button>
            </div>
          )}
        </>
      )}

      {loading && (
        <div className="rounded-lg bg-white/5 border border-white/10 text-muted-foreground px-4 py-8 text-center">
          Loading leaderboard…
        </div>
      )}

      {!loading && error && (
        <div className="rounded-lg bg-white/5 border border-white/10 text-muted-foreground px-4 py-8 text-center">
          {error}
        </div>
      )}

      {!loading && !error && data.length === 0 && (
        <div className="rounded-lg bg-white/5 border border-white/10 text-muted-foreground px-4 py-8 text-center">
          No leaderboard data for this period.
        </div>
      )}
    </div>
  );
}
