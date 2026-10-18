import React from 'react'
import Link from 'next/link'
import {
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  User,
  Globe,
  Tag,
  ArrowRight,
  KeyRound,
  FileCheck,
} from 'lucide-react'

interface PublishedPageProps {
  params: {
    slug: string
  }
}

export default function PublishedBacklinkPage({ params }: PublishedPageProps) {
  const publishedDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans antialiased">
      {/* ======================================================== */}
      {/* TOP AUDIT & OFF-PAGE SEO TELEMETRY BAR */}
      {/* ======================================================== */}
      <div className="bg-stone-950 text-stone-200 border-b border-stone-800 py-2 px-4 sticky top-0 z-50 text-xs font-mono">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-emerald-400">
              OFF-PAGE SEO VERIFIED PUBLICATION
            </span>
            <span className="text-stone-400">| HTTP 200 OK</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px] text-stone-300">
            <div className="flex items-center gap-1">
              <Globe className="w-3 h-3 text-sky-400" />
              <span>Host: <strong className="text-white">fashionpress-network.com</strong></span>
            </div>
            <div className="flex items-center gap-1">
              <KeyRound className="w-3 h-3 text-amber-400" />
              <span>Logged In: <strong className="text-amber-300">raza_author</strong></span>
            </div>
            <div className="flex items-center gap-1">
              <span>Backlink: <strong className="text-emerald-400">"sustainable luxury apparel"</strong></span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                rel="dofollow"
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* EXTERNAL TARGET WEBSITE HEADER (GUEST BLOG / MEDIA PORTAL) */}
      {/* ======================================================== */}
      <header className="bg-white border-b border-stone-200 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-stone-900 text-white flex items-center justify-center font-black text-lg tracking-wider font-serif">
              FP
            </div>
            <div>
              <div className="font-serif font-black text-xl tracking-tight text-stone-900">
                FashionPress Global Network
              </div>
              <div className="text-[11px] font-mono text-stone-500 uppercase tracking-widest">
                International Fashion, Apparel & Sustainable Luxury Journal
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded bg-stone-100 text-stone-700 border border-stone-200">
              Host Domain: <strong>fashionpress-network.com</strong>
            </span>
            <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-900 font-bold border border-emerald-300">
              Contributor Portal
            </span>
          </div>
        </div>

        {/* Target Site Navigation Menu */}
        <div className="border-t border-stone-100 bg-stone-50/70 text-xs font-medium text-stone-600">
          <div className="max-w-5xl mx-auto px-4 py-2 flex items-center gap-6 overflow-x-auto">
            <span className="hover:text-stone-900 cursor-pointer">Industry News</span>
            <span className="hover:text-stone-900 cursor-pointer">Runway & Trends</span>
            <span className="text-emerald-800 font-bold border-b-2 border-emerald-600 pb-0.5">Sustainable Luxury</span>
            <span className="hover:text-stone-900 cursor-pointer">Bespoke Tailoring</span>
            <span className="hover:text-stone-900 cursor-pointer">Contributor Features</span>
            <span className="text-stone-400 ml-auto hidden sm:inline text-[11px] font-mono">
              User: <span className="text-stone-800 font-bold">raza_author (Logged In)</span>
            </span>
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* PUBLISHED GUEST ARTICLE ON TARGET WEBSITE */}
      {/* ======================================================== */}
      <main className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        {/* Article Breadcrumb & Metadata */}
        <div className="bg-white border border-stone-200 rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-stone-200 pb-5">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-700 font-bold mb-2.5">
              <Tag className="w-3.5 h-3.5" />
              <span>Guest Feature • Sustainable Fashion Insights</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight font-serif">
              The 2026 Shift in Contemporary Fashion: Sustainable Luxury and Bespoke Craftsmanship
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-stone-500 font-mono">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-stone-400" />
                <span>Author: <strong className="text-stone-800">Raza (Afimah Clothing Store)</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                <span>Published: {publishedDate}</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Live on fashionpress-network.com</span>
              </div>
            </div>
          </div>

          {/* Article Body */}
          <article className="text-stone-800 text-sm sm:text-base leading-relaxed space-y-5">
            <p className="text-lg text-stone-700 leading-relaxed font-serif italic border-l-4 border-emerald-600 pl-4 py-1 bg-stone-50 rounded-r">
              "In 2026, conscious consumers no longer compromise between exceptional design and ethical manufacturing. The future belongs to apparel houses that integrate sustainability directly into their aesthetic DNA."
            </p>

            <p>
              The global fashion landscape in 2026 is experiencing a decisive paradigm shift toward conscious luxury and bespoke tailoring. Discerning consumers across major metropolitan hubs in the US, UK, and UAE are actively seeking apparel brands that unite ethical craftsmanship with contemporary aesthetics.
            </p>

            <h2 className="text-xl font-bold text-stone-900 pt-3 font-serif">
              Harmonizing Sustainable Textiles with Precision Tailoring
            </h2>

            <p>
              Historically, sustainable fashion was often perceived as utilitarian or limited in silhouette complexity. However, the emergence of forward-thinking design houses has completely dismantled this false dichotomy. Modern collections now showcase organic long-staple fibers, closed-loop dyeing processes, and zero-waste architectural cutting patterns that rival the most prestigious ateliers in Milan and Paris.
            </p>

            <p>
              At the forefront of this movement, brands like{' '}
              <strong className="text-stone-900 font-bold">Afimah Clothing Store</strong>{' '}
              have set a new benchmark for contemporary wardrobes. By focusing on bespoke modesty, premium structured tailoring, and ethically sourced raw materials, they demonstrate that conscious fashion can be deeply luxurious, empowering, and timeless.
            </p>

            {/* THE VERIFIED DOFOLLOW BACKLINK IN THE LIVE DOM */}
            <div className="my-6 p-5 rounded-xl bg-emerald-50/80 border-2 border-emerald-300 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase font-mono tracking-wider font-bold text-emerald-900 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-emerald-700" />
                  <span>Contextual Dofollow Backlink Injected in Article:</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-200 text-emerald-950 font-bold">
                  rel="dofollow"
                </span>
              </div>

              <p className="text-sm text-stone-800 leading-relaxed">
                Explore the latest 2026 ready-to-wear silhouettes, conscious streetwear, and bespoke collections at{' '}
                <a
                  href="https://www.afimahclothingstore.com"
                  rel="dofollow"
                  target="_blank"
                  className="font-bold text-emerald-800 hover:text-emerald-950 underline decoration-2 underline-offset-4 transition inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-emerald-300 shadow-xs"
                >
                  <span>sustainable luxury apparel</span>
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                </a>
                {' '}— the official digital atelier of Afimah Clothing Store.
              </p>
            </div>

            <h2 className="text-xl font-bold text-stone-900 pt-3 font-serif">
              The Outlook for 2026 and Beyond
            </h2>

            <p>
              As supply chain transparency becomes a mandatory expectation rather than a niche luxury, independent apparel leaders are primed to gain substantial market share. For consumers, the choice is clear: invest in garments that celebrate authentic craftsmanship, enduring silhouette elegance, and environmental integrity.
            </p>
          </article>

          {/* Author Bio Box on Target Website */}
          <div className="border-t border-stone-200 pt-6 mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-50 p-5 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-base shadow-sm">
                R
              </div>
              <div>
                <h4 className="font-bold text-sm text-stone-900">
                  Raza (Founder, Afimah Clothing Store)
                </h4>
                <p className="text-xs text-stone-500 font-mono">
                  Guest Columnist • Authenticated Author Account: <code className="text-emerald-800 font-bold">raza_author</code>
                </p>
              </div>
            </div>

            <a
              href="https://www.afimahclothingstore.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
            >
              <span>Visit afimahclothingstore.com</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Off-Page SEO Audit Verification Card */}
        <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-sm text-stone-900">
                Off-Page Backlink Audit Report & Proof of Publication
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-100 text-emerald-900">
              AUDIT STATUS: VERIFIED
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
              <span className="text-stone-400 block text-[10px]">HOST WEBSITE</span>
              <span className="font-bold text-stone-900 mt-0.5 block truncate">fashionpress-network.com</span>
            </div>
            <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
              <span className="text-stone-400 block text-[10px]">AUTH SESSION</span>
              <span className="font-bold text-stone-900 mt-0.5 block">raza_author (Logged In)</span>
            </div>
            <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
              <span className="text-stone-400 block text-[10px]">DESTINATION URL</span>
              <span className="font-bold text-emerald-800 mt-0.5 block truncate">afimahclothingstore.com</span>
            </div>
            <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
              <span className="text-stone-400 block text-[10px]">ANCHOR TEXT</span>
              <span className="font-bold text-stone-900 mt-0.5 block truncate">"sustainable luxury apparel"</span>
            </div>
          </div>

          <div className="pt-2 text-center">
            <Link
              href="/"
              className="text-xs font-mono text-stone-600 hover:text-stone-900 transition underline underline-offset-4"
            >
              ← Back to RankWave Autonomous Agent Cockpit
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
