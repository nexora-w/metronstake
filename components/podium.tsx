import { Crown, Medal } from "lucide-react"

export interface PodiumUser {
  rank: number
  name: string
  wagered: number
  reward: number
}

interface PodiumProps {
  users: PodiumUser[]
}

export function Podium({ users }: PodiumProps) {
  const first = users[0]
  const second = users[1]
  const third = users[2]

  const podiumOrder = [second, first, third]

  return (
    <div className="flex items-end justify-center gap-4 md:gap-8">
      {podiumOrder.map((user, i) => {
        if (!user) return null

        const isFirst = user.rank === 1
        const isSecond = user.rank === 2
        const isThird = user.rank === 3

        const heightClass = isFirst ? "h-40 md:h-48" : isSecond ? "h-32 md:h-36" : "h-28 md:h-32"
        const ringColor = isFirst
          ? "ring-gold shadow-gold/20"
          : isSecond
          ? "ring-silver shadow-silver/20"
          : "ring-bronze shadow-bronze/20"
        const textColor = isFirst ? "text-gold" : isSecond ? "text-silver" : "text-bronze"
        const bgColor = isFirst
          ? "bg-gold/10 border-gold/30"
          : isSecond
          ? "bg-silver/10 border-silver/30"
          : "bg-bronze/10 border-bronze/30"

        return (
          <div key={user.rank} className="flex flex-col items-center">
            {/* Avatar */}
            <div className={`relative mb-3 flex h-14 w-14 items-center justify-center rounded-full ring-2 ${ringColor} bg-secondary shadow-lg md:h-16 md:w-16`}>
              {isFirst ? (
                <Crown className="h-6 w-6 text-gold" />
              ) : (
                <Medal className={`h-6 w-6 ${textColor}`} />
              )}
              <span className={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${bgColor} border ${textColor}`}>
                {user.rank}
              </span>
            </div>

            {/* Name */}
            <p className="mb-1 max-w-[100px] truncate text-sm font-semibold text-foreground">{user.name}</p>

            {/* Wagered */}
            <p className="mb-3 text-xs text-muted-foreground">
              ${user.wagered.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>

            {/* Podium bar */}
            <div className={`${heightClass} w-24 rounded-t-lg border ${bgColor} flex flex-col items-center justify-center md:w-28`}>
              <span className={`text-2xl font-extrabold ${textColor}`}>#{user.rank}</span>
              <span className="mt-1 text-xs font-semibold text-primary">
                ${user.reward.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
