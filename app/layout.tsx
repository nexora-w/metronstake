import type { Metadata } from 'next'
import { Chakra_Petch } from 'next/font/google'

import './globals.css'

const chakraPetch = Chakra_Petch({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-chakra-petch',
})

export const metadata: Metadata = {
  title: 'Metron',
  description: 'Use code Metron on your go-to platforms to grab special deposit rewards or complimentary cases and give me a little boost while you’re at it. Activate it now and take advantage of the extra benefits waiting for you.',
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
