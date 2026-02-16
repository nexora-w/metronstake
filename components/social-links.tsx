import Link from "next/link"
import { FaXTwitter, FaDiscord, FaYoutube, FaTwitch } from "react-icons/fa6"

const socials = [
  { href: "https://x.com", icon: FaXTwitter, label: "X (Twitter)" },
  { href: "https://discord.gg", icon: FaDiscord, label: "Discord" },
  { href: "https://youtube.com", icon: FaYoutube, label: "YouTube" },
  { href: "https://twitch.tv", icon: FaTwitch, label: "Twitch" },
]

export function SocialLinks() {
  return (
    <section className="bg-card/30 py-12">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <h2 className="text-center text-lg font-semibold text-foreground mb-6">
          Follow us
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {socials.map(({ href, icon: Icon, label }) => (
            <Link
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="
                flex h-12 w-12 items-center justify-center rounded-full
                border-2 border-border bg-secondary/50
                text-muted-foreground
                transition-all duration-300
                hover:border-primary hover:text-primary hover:bg-primary/10
                hover:scale-110
              "
            >
              <Icon className="h-5 w-5" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
