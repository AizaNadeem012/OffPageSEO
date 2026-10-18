import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'RankWave | Off-Page SEO & Link Building Automation Platform',
  description: 'Autonomous Off-Page SEO, website research, multi-platform AI content generation, account onboarding, and verified link building operations.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#F8F9FA] text-stone-900 selection:bg-emerald-600 selection:text-white">
        {children}
      </body>
    </html>
  )
}
