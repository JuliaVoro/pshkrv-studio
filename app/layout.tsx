import type { Metadata } from 'next'
import { Playfair_Display, Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'PSHKRV Studio — Art Direction & Digital Design',
  description:
    'PSHKRV Studio is a Milan-based art direction and digital design studio led by Sergii Pushkarov. Brand identity, digital experiences, and editorial design.',
  openGraph: {
    title: 'PSHKRV Studio',
    description: 'Art Direction & Digital Design — Milan',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} ${jetbrains.variable}`}>
      <body className="bg-bg text-fg font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
