export interface LeaderboardEntry {
  rank: number
  name: string
  wagered: number
  reward: number
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[]
}

export function LeaderboardTable({ entries }: LeaderboardTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-secondary/50">
            <th className="px-6 py-4 text-left font-semibold text-muted-foreground">Place</th>
            <th className="px-6 py-4 text-left font-semibold text-muted-foreground">User</th>
            <th className="px-6 py-4 text-right font-semibold text-muted-foreground">Wagered</th>
            <th className="px-6 py-4 text-right font-semibold text-muted-foreground">Reward</th>
          </tr>
        </thead>
        <tbody>
          {entries.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                No entries yet. Start wagering to climb the leaderboard!
              </td>
            </tr>
          ) : (
            entries.map((entry) => {
              const isTop3 = entry.rank <= 3
              const rankColor =
                entry.rank === 1
                  ? "text-gold"
                  : entry.rank === 2
                  ? "text-silver"
                  : entry.rank === 3
                  ? "text-bronze"
                  : "text-muted-foreground"

              return (
                <tr
                  key={entry.rank}
                  className={`border-b border-border/50 transition-colors hover:bg-secondary/30 ${
                    isTop3 ? "bg-primary/5" : ""
                  }`}
                >
                  <td className={`px-6 py-4 font-bold ${rankColor}`}>#{entry.rank}</td>
                  <td className="px-6 py-4 font-medium text-foreground">{entry.name}</td>
                  <td className="px-6 py-4 text-right tabular-nums text-foreground">
                    ${entry.wagered.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-right tabular-nums font-semibold text-primary">
                    ${entry.reward.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
