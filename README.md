# 🌐 Off-Page SEO Automation Agent

> An ethical, high-impact Off-Page SEO Automation Agent and backlink campaign management dashboard built with Next.js, TypeScript, and Tailwind CSS.

---

## 📋 Table of Contents
1. [Overview & Core Value](#overview--core-value)
2. [Ethical Safety Guarantees & CAN-SPAM Compliance](#ethical-safety-guarantees--can-spam-compliance)
3. [Zero-Cost Local Sandbox MVP](#zero-cost-local-sandbox-mvp)
4. [Key Features & Modules](#key-features--modules)
5. [Quickstart: Launch in 2 Minutes](#quickstart-launch-in-2-minutes)
6. [Environment Variables & Optional APIs](#environment-variables--optional-apis)
7. [CSV Import / Export Guide](#csv-import--export-guide)
8. [Architecture & Folder Structure](#architecture--folder-structure)
9. [Available Commands](#available-commands)

---

## 🌟 Overview & Core Value

Off-page link acquisition is often plagued by low-quality spam blasts, PBN link farms, and unvetted outreach. **Off-Page SEO Automation Agent** replaces these harmful practices with a structured, high-authority editorial workflow:

- **Targeted SERP Discovery**: Formulates Boolean Google dorks to uncover high-intent submission pages (guest post guidelines, resource directories, broken reference links, unlinked brand mentions, and podcast interview targets).
- **Competitor Backlink Gap**: Discovers domains endorsing multiple rivals and extracts overlapping opportunities for your campaign.
- **Visual Kanban & Table Pipeline**: Tracks prospects across 11 stages from discovery to live verified backlinks.
- **Personalized Outreach Synthesizer**: Injects contextual tokens (`{{First_Name}}`, `{{Site_Name}}`, `{{Article_Title}}`, `{{Proposed_Topic}}`).
- **Human-in-the-Loop Approval Gate**: Prevents automated spam blasts. Every pitch requires human inspection and sign-off.
- **CSV Data Portability**: Full import wizard with column auto-mapping and client-ready CSV exports.
- **Audit Logs**: Transparent, timestamped logs for all autonomous actions and security checks.

---

## 🛡️ Ethical Safety Guarantees & CAN-SPAM Compliance

This project enforces strict ethical and legal safeguards:

1. **No Automated Spam or Bulk Blasting**: The agent never sends mass unsolicited emails. Outbound transmission is strictly limited by daily caps (default 12 pitches/day) and requires human review.
2. **Approval Gate for Externally Visible Actions**: All outreach drafts are routed to the **Approval Queue**. No external communications occur without explicit operator confirmation.
3. **Automated Toxic Filter**: Domains with high spam scores (> 20%) or blacklisted TLDs (`.biz`, `.xyz`, etc.) are automatically flagged or blocked.
4. **No Unauthorized Submissions**: The system never executes automated CAPTCHA bypasses, unauthorized form flooding, or fake account registrations.
5. **CAN-SPAM & GDPR Compliant**: Every outreach draft automatically includes an opt-out footer and clear physical sender identification.
6. **Transparent Data Labeling**: Simulated sandbox metrics and demo records are explicitly marked with `DEMO` and `SANDBOX` badges.

---

## ⚡ Zero-Cost Local Sandbox MVP

**You do NOT need paid API keys or subscriptions (Moz, Ahrefs, SEMrush, or Hunter.io) to run and explore this dashboard!**

- Out of the box, the app loads a realistic, pre-populated SaaS demo campaign (**RankWave SEO**).
- The built-in local sandbox simulates SERP discovery, domain authority scoring, competitor backlink intersections, and email client previews.
- All prospect adjustments, stage transitions, and custom templates persist in your browser's local storage.

---

## 🧩 Key Features & Modules

### 1. 📊 Overview & KPI Analytics
- Real-time pipeline counters: Total Prospects, Qualified Leads, Approval Queue Count, and Won Live Links.
- Visual **Acquisition Funnel** from discovery to live backlink.
- Opportunity type distribution charts and recent audit log feed.

### 2. 🔍 Opportunity Discovery Hub
- Boolean Search Dork Generator with instant copy-to-clipboard for Google/Bing operators.
- Autonomous query scanner with simulated Moz DA / Ahrefs DR equivalent authority metrics, spam score filters, and one-click "Add to Pipeline".

### 3. 🎯 Competitor Link Gap
- Domain comparison between industry rivals (Semrush, Ahrefs, Moz).
- Anchor text distribution analysis (Branded vs Exact-match vs Generic).
- Referring domain intersection table: claims multi-competitor links into your pipeline.

### 4. 🗂️ Prospect Pipeline (Kanban & Table)
- **Kanban Board**: Drag/move prospects between stages (`Discovered`, `Qualified`, `Contact Found`, `Draft Ready`, `In Review`, `Approved`, `Contacted`, `Follow-up Sent`, `Negotiating`, `Won (Live)`, `Rejected`).
- **Table View**: Filterable by opportunity type, stage, search query, and domain authority.
- **Prospect Detail Drawer**: In-depth inspection, contact info, notes editing, safety assessments, and draft generator.

### 5. ✉️ Outreach Center & Approval Gate
- Template gallery featuring 5 proven outreach frameworks:
  1. Authoritative Guest Post Pitch
  2. Helpful Broken Link Replacement
  3. Curated Resource Page Addition
  4. Unlinked Brand Mention Attribution
  5. Expert Interview / Podcast Pitch
- Dynamic token interpolation and multi-step follow-up sequences.
- Interactive **Email Client Preview** modal with built-in spam phrase deliverability analyzer.

### 6. 📁 CSV Import & Export Hub
- Upload or paste raw CSV text.
- Flexible header auto-mapping (`Domain`, `URL`, `DA`, `Type`, `Contact Email`).
- Download sample starter template or export filtered client deliverables.

### 7. 📜 Activity Logs & Audit Trail
- Timestamped audit log filterable by category (`Discovery`, `Competitor`, `Outreach`, `Safety`, `CSV`, `System`).
- Export full JSON audit report.

### 8. ⚙️ Automation & Safety Settings
- Configure daily sending quotas and domain velocity throttles.
- Adjust toxic domain spam ceilings (e.g. 20%).
- Sender profile editor & CAN-SPAM footer configuration.
- Optional API key management (masked inputs with test ping simulators).

---

## 🚀 Quickstart: Launch in 2 Minutes

### Prerequisites
- Node.js (version 18 or newer recommended).

### Running Locally

1. Open your terminal in the project directory:
   ```bash
   cd "c:\Users\H&H Traders\Downloads\OffPageSEOagent"
   ```

2. Start the local Next.js development server:
   ```bash
   npm run dev
   # Or on Windows PowerShell:
   npm.cmd run dev
   ```

3. Open your browser and visit:
   ```
   http://localhost:3000
   ```

4. The dashboard will load with full sample data ready to test!

---

## 🔐 Environment Variables & Optional APIs

To connect live search APIs or AI personalization providers in the future:

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Available environment variables (all optional):
   | Key | Purpose |
   | --- | --- |
   | `SERPAPI_API_KEY` | Live Google search query execution |
   | `AHREFS_API_KEY` | Live Ahrefs domain rating and backlink metrics |
   | `MOZ_ACCESS_ID` & `MOZ_SECRET_KEY` | Live Moz Domain Authority and Spam Score |
   | `HUNTER_API_KEY` | Live email address discovery |
   | `OPENAI_API_KEY` | AI-assisted personalized pitch generation |
   | `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` | Production email delivery configuration |

---

## 📄 CSV Import / Export Guide

A sample CSV template is included and can be downloaded directly from the **CSV Import & Export** tab.

Standard CSV Headers:
```csv
Domain,URL,Page Title,Opportunity Type,Status,Domain Authority,Spam Score (%),Monthly Traffic,Contact Name,Contact Role,Contact Email,Suggested Topic,Notes
searchenginewatch.com,https://searchenginewatch.com/write-for-us,Search Engine Watch Contributor Guidelines,guest_post,qualified,85,2,450000,Sarah Miller,Editorial Director,editorial@searchenginewatch.com,Entity-First SEO Strategies in 2026,Target editorial calendar for Q4
```

---

## 📁 Architecture & Folder Structure

```
OffPageSEOagent/
├── app/
│   ├── globals.css              # Tailwind styling and custom scrollbars
│   ├── layout.tsx               # Root layout & metadata
│   └── page.tsx                 # Master dashboard controller & state manager
├── components/
│   ├── layout/
│   │   ├── DemoBanner.tsx       # Safety status and local sandbox notice banner
│   │   ├── Navbar.tsx           # Brand header, counters, and quick actions
│   │   └── Sidebar.tsx          # Navigation sidebar with module indicators
│   ├── modals/
│   │   ├── EmailPreviewModal.tsx# Gmail/Outlook email preview & spam check
│   │   ├── NewProspectModal.tsx # Manual prospect creation modal
│   │   └── ProspectDetailModal.tsx # In-depth prospect drawer & draft inspector
│   └── views/
│       ├── CompetitorGapView.tsx# Backlink gap analysis & anchor profiles
│       ├── CSVView.tsx          # CSV import wizard & export center
│       ├── DiscoveryView.tsx    # SERP Boolean dorks & opportunity runner
│       ├── LogsView.tsx         # Audit trail & compliance history
│       ├── OutreachView.tsx     # Outreach approval queue & synthesizer
│       ├── OverviewView.tsx     # KPI cards, acquisition funnel, & launchpad
│       ├── PipelineView.tsx     # Kanban board & filterable table
│       └── SettingsView.tsx     # Safety throttles, footers, & API settings
├── lib/
│   ├── csv-helper.ts            # CSV parser, exporter, and template generator
│   ├── outreach-generator.ts   # Token interpolator & sequence generator
│   ├── sample-data.ts           # Curated demo campaign (RankWave.io)
│   ├── seo-engine.ts            # Search dork builder & safety evaluator
│   ├── storage.ts               # Local persistence manager with pub/sub
│   └── utils.ts                 # Formatting helpers and styling utilities
├── types/
│   └── index.ts                 # Full TypeScript definitions & data contracts
├── .env.example                 # Environment configuration template
├── package.json                 # Project dependencies & scripts
├── postcss.config.js            # PostCSS configuration
├── tailwind.config.js           # Tailwind CSS theme configuration
├── tsconfig.json                # TypeScript compiler configuration
└── README.md                    # Comprehensive documentation
```

---

## 🛠️ Available Commands

- `npm run dev` (or `npm.cmd run dev`): Launch local development server on port 3000.
- `npm run build` (or `npm.cmd run build`): Build optimized production Next.js bundle.
- `npm run start` (or `npm.cmd run start`): Start production server.
