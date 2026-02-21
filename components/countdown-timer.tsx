"use client"

import { useEffect, useState } from "react"

interface CountdownTimerProps {
  endDate: Date
  /** "default" = colon-separated blocks; "polygon" = polygon boxes with gradient numbers */
  variant?: "default" | "polygon"
}

const TIME_UNITS = { days: "Days", hours: "Hrs", minutes: "Mins", seconds: "Secs" } as const

function getTimeLeft(endDate: Date) {
  const now = new Date()
  const diff = endDate.getTime() - now.getTime()

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function PolygonBlock({
  value,
  label,
}: {
  value: number
  label: string
}) {
  return (
    <div className="relative w-[40px] h-[46px] sm:w-[45px] sm:h-[52px] md:w-[53px] md:h-[61px] lg:w-[61px] lg:h-[70px] bg-[url('/images/leaderboard/polygon.png')] bg-cover bg-center">
      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
        <div>
          <div
            className="text-white text-xs sm:text-sm md:text-lg lg:text-xl font-bold"
            style={{
              backgroundImage:
                "radial-gradient(100% 100% at 50% 0%, #FFC23D 0%, #FF810A 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              WebkitTextFillColor: "transparent",
              display: "inline-block",
            }}
          >
            {value}
          </div>
        </div>
        <div className="text-white text-[8px] sm:text-[10px] md:text-xs uppercase">
          {label}
        </div>
      </div>
    </div>
  )
}

export function CountdownTimer({ endDate, variant = "default" }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(endDate))

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(endDate))
    }, 1000)

    return () => clearInterval(interval)
  }, [endDate])

  if (variant === "polygon") {
    return (
      <div className="flex items-center justify-center gap-1 sm:gap-2 md:gap-3 lg:gap-4">
        <PolygonBlock value={timeLeft.days} label={TIME_UNITS.days} />
        <PolygonBlock value={timeLeft.hours} label={TIME_UNITS.hours} />
        <PolygonBlock value={timeLeft.minutes} label={TIME_UNITS.minutes} />
        <PolygonBlock value={timeLeft.seconds} label={TIME_UNITS.seconds} />
      </div>
    )
  }

  const blocks = [
    { value: timeLeft.days, label: TIME_UNITS.days },
    { value: timeLeft.hours, label: TIME_UNITS.hours },
    { value: timeLeft.minutes, label: TIME_UNITS.minutes },
    { value: timeLeft.seconds, label: TIME_UNITS.seconds },
  ]

  return (
    <div className="flex items-center justify-center gap-3">
      {blocks.map((block, i) => (
        <div key={block.label} className="flex items-center gap-3">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold tabular-nums text-foreground md:text-4xl">
              {String(block.value).padStart(2, "0")}
            </span>
            <span className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {block.label}
            </span>
          </div>
          {i < blocks.length - 1 && (
            <span className="mb-4 text-2xl font-bold text-muted-foreground">:</span>
          )}
        </div>
      ))}
    </div>
  )
}

/** End of the current month in UTC (last moment of last day of month). */
export function getEndOfCurrentMonthUTC(): Date {
  const now = new Date()
  const year = now.getUTCFullYear()
  const month = now.getUTCMonth()
  return new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999))
}

/** Countdown to end of current month with polygon-style boxes. Use on leaderboards page. */
export function MonthlyCountdown() {
  return (
    <CountdownTimer endDate={getEndOfCurrentMonthUTC()} variant="polygon" />
  )
}
