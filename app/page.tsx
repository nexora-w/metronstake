import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { BonusOffers } from "@/components/bonus-offers"
import { KickEmbed } from "@/components/kick-embed"
import { SocialLinks } from "@/components/social-links"
import { Footer } from "@/components/footer"

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <BonusOffers />
        <KickEmbed />
        <SocialLinks />
      </main>
      <Footer />
    </div>
  )
}
