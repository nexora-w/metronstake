"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import Image from "next/image"
import { HiOutlineHome, HiOutlineGift, HiOutlineChartBar } from "react-icons/hi"
import { FaKickstarter } from "react-icons/fa";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOnline, setIsOnline] = useState<boolean | null>(null)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const checkKickLive = async () => {
      try {
        const res = await fetch("/api/kick-status")
        const data = await res.json()
        setIsOnline(data.live === true)
      } catch {
        setIsOnline(false)
      }
    }
    checkKickLive()
    const interval = setInterval(checkKickLive, 60_000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header
      className={`sticky z-50 transition-[top] duration-300 ease-out ${isScrolled ? "top-0" : "top-5"}`}
    >
      <div
        className={`mx-auto flex border border-primary/25 bg-background/80 backdrop-blur-md items-center px-4 py-3 lg:px-8 transition-[max-width,border-radius,border-width] duration-300 ease-out ${isScrolled ? "w-full max-w-none rounded-none border-x-0 border-t-0" : "max-w-7xl rounded-3xl"}`}
      >
        <div className="flex flex-1 items-center">
          <Link href="/" className="">
            <Image src="/logo.png" alt="Metron" width={50} height={50} />
          </Link>
        </div>

        <nav className="hidden items-center justify-center gap-8 md:flex flex-1">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            <HiOutlineHome className="h-4 w-4" />
            Home
          </Link>
          <Link href="/bonuses" className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            <HiOutlineGift className="h-4 w-4" />
            Bonuses
          </Link>
          <Link href="/#leaderboards" className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            <HiOutlineChartBar className="h-4 w-4" />
            Leaderboards
          </Link>
        </nav>

        <div className="flex flex-1 items-center justify-end gap-4">
          <Link
            href="https://kick.com/metron"
            target="_blank"
            rel="noopener noreferrer"
            className={`hidden items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors md:inline-flex ${
              isOnline === null
                ? "bg-muted text-muted-foreground"
                : isOnline
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-red-500 text-white hover:bg-red-600"
            }`}
          >
            <FaKickstarter className="h-4 w-4" />
            {isOnline === null ? "…" : isOnline ? "Online" : "Offline"}
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-foreground md:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out md:hidden ${mobileOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-border bg-background px-4 py-4">
            <nav className="flex flex-col gap-4">
              <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                <HiOutlineHome className="h-4 w-4" />
                Home
              </Link>
              <Link href="/bonuses" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                <HiOutlineGift className="h-4 w-4" />
                Bonuses
              </Link>
              <Link href="/#leaderboards" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                <HiOutlineChartBar className="h-4 w-4" />
                Leaderboards
              </Link>
              <Link
                href="https://kick.com/metron"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-center text-sm font-medium transition-colors ${
                  isOnline === null
                    ? "bg-muted text-muted-foreground"
                    : isOnline
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-red-500 text-white hover:bg-red-600"
                }`}
              >
                <FaKickstarter className="h-4 w-4" />
                {isOnline === null ? "…" : isOnline ? "Online" : "Offline"}
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}
