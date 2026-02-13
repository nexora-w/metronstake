import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { BonusOffers } from "@/components/bonus-offers"
import { Footer } from "@/components/footer"

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <BonusOffers />
        
      </main>
      <Footer />
    </div>
  )
}
