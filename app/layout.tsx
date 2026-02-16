import type { Metadata } from 'next'
import { Chakra_Petch } from 'next/font/google'

import './globals.css'

const chakraPetch = Chakra_Petch({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-chakra-petch',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://metron.example.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Metron — Bonus codes & rewards',
    template: '%s | Metron',
  },
  description:
    "Use code Metron on your go-to platforms to grab special deposit rewards or complimentary cases and give me a little boost while you're at it. Activate it now and take advantage of the extra benefits waiting for you.",
  keywords: ['Metron', 'bonus code', 'promo code', 'deposit rewards', 'cases', 'giveaway'],
  authors: [{ name: 'Metron' }],
  creator: 'Metron',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Metron',
    title: 'Metron — Bonus codes & rewards',
    description:
      'Use code Metron on your go-to platforms to grab special deposit rewards or complimentary cases. Activate now for extra benefits.',
    images: [
      {
        url: 'https://metronstake.vercel.app/og.png',
        width: 1200,
        height: 630,
        alt: 'Metron — Bonus codes & rewards',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Metron — Bonus codes & rewards',
    description:
      'Use code Metron on your go-to platforms to grab special deposit rewards or complimentary cases. Activate now for extra benefits.',
    images: ['https://metronstake.vercel.app/og.png'],
  },
  icons: {
    icon: 'https://metronstake.vercel.app/favicon.ico',
  },
  alternates: {
    canonical: siteUrl,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={chakraPetch.variable}>
      <body className="font-sans antialiased min-h-screen bg-background text-foreground">{children}</body>
    </html>
  )
}
