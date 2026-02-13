"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        <Link href="/" className="text-2xl font-bold tracking-tight text-foreground">
          La<span className="text-primary">Zard</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Home
          </Link>
          <Link href="/#bonuses" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Bonuses
          </Link>
          <Link href="/#leaderboards" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Leaderboards
          </Link>
        </nav>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-foreground md:hidden"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            <Link href="/" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Home
            </Link>
            <Link href="/#bonuses" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Bonuses
            </Link>
            <Link href="/#leaderboards" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Leaderboards
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
