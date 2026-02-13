import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground md:flex-row lg:px-8">
        <p>
          &copy; {new Date().getFullYear()} La<span className="text-primary font-semibold">Zard</span>. All rights reserved.
        </p>
        <nav className="flex items-center gap-6">
          <Link href="/" className="transition-colors hover:text-foreground">Home</Link>
          <Link href="/#bonuses" className="transition-colors hover:text-foreground">Bonuses</Link>
          <Link href="/#leaderboards" className="transition-colors hover:text-foreground">Leaderboards</Link>
        </nav>
      </div>
    </footer>
  )
}
