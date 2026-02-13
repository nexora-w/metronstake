"use client"

import { useState } from "react"
import { CountdownTimer } from "./countdown-timer"
import { Podium, type PodiumUser } from "./podium"
import { LeaderboardTable, type LeaderboardEntry } from "./leaderboard-table"
import { Copy, Check, ChevronDown, ChevronUp, Info } from "lucide-react"

interface LeaderboardContentProps {
  siteName: string
  code: string
  rules: { type: string; multiplier: string }[]
  prizePool: number
  prizes: number[]
  entries: LeaderboardEntry[]
  endDateISO: string
}

export function LeaderboardContent({
  siteName,
  code,
  rules,
  prizePool,
  prizes,
  entries,
  endDateISO,
}: LeaderboardContentProps) {
  const [copied, setCopied] = useState(false)
  const [showPrevious, setShowPrevious] = useState(false)

  const endDate = new Date(endDateISO)

  const copyCode = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const podiumUsers: PodiumUser[] = entries.slice(0, 3).map((e) => ({
    rank: e.rank,
    name: e.name,
    wagered: e.wagered,
    reward: e.reward,
  }))

  const tableEntries = entries.slice(3)

  // Example previous results
  const previousResults = [
    { rank: 1, name: "OldChamp", wagered: 15000, reward: 120 },
    { rank: 2, name: "PastPro", wagered: 11200, reward: 80 },
    { rank: 3, name: "ExKing", wagered: 8500, reward: 60 },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      {/* Header */}
      <div className="mb-10 text-center">
        <p className="mb-2 text-sm font-medium uppercase tracking-widest text-primary">
          My Leaderboards
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
          {siteName}
        </h1>
      </div>

      {/* Code & Rules Row */}
      <div className="mb-10 flex flex-col items-stretch gap-6 lg:flex-row">
        {/* Code Box */}
        <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-border bg-card p-6">
          <span className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Code
          </span>
          <button
            onClick={copyCode}
            className="group flex items-center gap-2 rounded-lg bg-primary/10 px-5 py-2.5 text-lg font-bold text-primary transition-colors hover:bg-primary/20"
          >
            {code}
            {copied ? (
              <Check className="h-4 w-4 text-primary" />
            ) : (
              <Copy className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
            )}
          </button>
        </div>

        {/* Rules Box */}
        <div className="flex flex-1 flex-col rounded-xl border border-border bg-card p-6">
          <div className="mb-3 flex items-center gap-2">
            <Info className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Rules
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            {rules.map((rule) => (
              <div
                key={rule.type}
                className="rounded-lg border border-border bg-secondary/50 px-4 py-2 text-sm"
              >
                <span className="font-medium text-foreground">{rule.type}</span>{" "}
                <span className="text-primary">{rule.multiplier}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Prize Pool Box */}
        <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-primary/30 bg-primary/5 p-6">
          <span className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Prize Pool
          </span>
          <span className="text-3xl font-extrabold text-primary">
            ${prizePool.toLocaleString("en-US")}
          </span>
        </div>
      </div>

      {/* Podium */}
      <div className="mb-12">
        <Podium users={podiumUsers} />
      </div>

      {/* Countdown */}
      <div className="mb-10 rounded-xl border border-border bg-card p-8 text-center">
        <h2 className="mb-1 text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Ending In
        </h2>
        <div className="mt-4">
          <CountdownTimer endDate={endDate} />
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Ends on: {endDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Prize Distribution */}
      <div className="mb-10 rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Prize Distribution
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {prizes.map((prize, i) => {
            const rankColor =
              i === 0
                ? "border-gold/40 bg-gold/5 text-gold"
                : i === 1
                ? "border-silver/40 bg-silver/5 text-silver"
                : i === 2
                ? "border-bronze/40 bg-bronze/5 text-bronze"
                : "border-border bg-secondary/30 text-foreground"

            return (
              <div
                key={i}
                className={`flex flex-col items-center rounded-lg border p-3 ${rankColor}`}
              >
                <span className="text-xs font-medium text-muted-foreground">#{i + 1}</span>
                <span className="mt-1 text-lg font-bold">${prize}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Leaderboard Table (entries after top 3) */}
      <div className="mb-10">
        <LeaderboardTable entries={tableEntries} />
      </div>

      {/* Previous Results Toggle */}
      <div className="rounded-xl border border-border bg-card">
        <button
          onClick={() => setShowPrevious(!showPrevious)}
          className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-secondary/30"
        >
          <span className="text-sm font-semibold text-foreground">View Previous Results</span>
          {showPrevious ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </button>
        {showPrevious && (
          <div className="border-t border-border p-6">
            <h4 className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Last Week Results
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Place</th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">User</th>
                    <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Wagered</th>
                    <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Reward</th>
                  </tr>
                </thead>
                <tbody>
                  {previousResults.map((entry) => (
                    <tr key={entry.rank} className="border-b border-border/50">
                      <td className="px-4 py-3 font-bold text-muted-foreground">#{entry.rank}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{entry.name}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-foreground">
                        ${entry.wagered.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums font-semibold text-primary">
                        ${entry.reward.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
