"use client"

import { useEffect, useState } from "react"

interface CountdownTimerProps {
  endDate: Date
}

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

export function CountdownTimer({ endDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(endDate))

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(endDate))
    }, 1000)

    return () => clearInterval(interval)
  }, [endDate])

  const blocks = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Minutes" },
    { value: timeLeft.seconds, label: "Seconds" },
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
