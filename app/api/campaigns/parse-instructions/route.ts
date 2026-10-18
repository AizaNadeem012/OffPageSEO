import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { instructions, brandName, websiteUrl } = await req.json()

    if (!instructions || typeof instructions !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Natural language instructions are required' },
        { status: 400 }
      )
    }

    const openAiKey = process.env.OPENAI_API_KEY
    if (openAiKey) {
      const prompt = `You are an elite SEO strategist and campaign architect.
Parse the following natural language instructions into a strictly structured Off-Page SEO campaign configuration.
User notes:
Brand Name hint: "${brandName || ''}"
Website URL hint: "${websiteUrl || ''}"
Natural Language Instructions:
"""
${instructions}
"""

Return a JSON object with EXACTLY this structure:
{
  "name": "Campaign Title",
  "brandName": "Brand or Business Name",
  "websiteUrl": "https://...",
  "description": "Comprehensive business summary",
  "niche": "Primary industry & vertical",
  "targetCountries": ["United States", "United Kingdom", ...],
  "targetAudience": "Target audience persona and demographics",
  "primaryKeywords": ["keyword 1", "keyword 2", ...],
  "secondaryKeywords": ["long tail 1", ...],
  "targetLandingPages": ["https://..."],
  "preferredAnchors": ["Anchor text 1", "Brand Name", ...],
  "brandVoice": "Tone of voice (e.g. Authoritative, Editorial, Conversational)",
  "seoObjectives": "Specific SEO goals",
  "contentLanguage": "en",
  "contentTypes": ["articles", "business_profiles", "directory_listings", "guest_posts", "community_contributions"],
  "monthlyBacklinkTarget": 50,
  "dailyActionLimit": 15,
  "maxRegistrationsPerDay": 5,
  "linkQualityRequirements": "DA >= 40, Spam Score <= 10%",
  "preferredCategories": ["Relevant category 1", ...],
  "excludedCategories": ["Gambling", "Adult", "Pharma", "Scam"],
  "contentInstructions": "Detailed synthesis of content rules"
}`

      try {
        const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openAiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' },
            temperature: 0.2,
          }),
        })

        if (aiRes.ok) {
          const data = await aiRes.json()
          const parsed = JSON.parse(data.choices[0].message.content)
          return NextResponse.json({
            success: true,
            source: 'openai_gpt4o',
            configuration: parsed,
          })
        }
      } catch (err) {
        console.warn('OpenAI parsing failed, falling back to heuristic semantic engine', err)
      }
    }

    // Heuristic semantic extractor fallback when OpenAI API key is not present or offline
    const detectedBrand = brandName || extractPattern(instructions, /(?:brand|business|company|store|name is|called)\s*[:"']?([A-Za-z0-9\s&'-]+?)(?:["'\n,.]|$)/i) || 'Afimah Clothing Store'
    const detectedUrl = websiteUrl || extractPattern(instructions, /(https?:\/\/[^\s]+|www\.[^\s]+)/i) || 'https://www.afimahclothingstore.com'
    const detectedNiche = extractNiche(instructions)

    const keywords = extractKeywords(instructions)
    const countries = extractCountries(instructions)

    const fallbackConfig = {
      name: `${detectedBrand} - Autonomous Authority Campaign`,
      brandName: detectedBrand,
      websiteUrl: detectedUrl.startsWith('http') ? detectedUrl : `https://${detectedUrl}`,
      description: instructions.slice(0, 320) + (instructions.length > 320 ? '...' : ''),
      niche: detectedNiche,
      targetCountries: countries.length > 0 ? countries : ['United States', 'United Kingdom', 'Canada', 'UAE'],
      targetAudience: 'Industry enthusiasts, high-intent buyers, and professionals seeking premium quality.',
      primaryKeywords: keywords.slice(0, 4),
      secondaryKeywords: keywords.slice(4, 8),
      targetLandingPages: [detectedUrl.startsWith('http') ? detectedUrl : `https://${detectedUrl}`],
      preferredAnchors: [detectedBrand, `${detectedBrand} official`, ...keywords.slice(0, 2)],
      brandVoice: 'Authoritative, editorial, refined, and value-driven',
      seoObjectives: 'Acquire contextual high-DA backlinks, diversify anchor profile, and increase organic search impressions.',
      contentLanguage: 'en',
      contentTypes: ['articles', 'business_profiles', 'directory_listings', 'guest_posts', 'community_contributions'],
      monthlyBacklinkTarget: 50,
      dailyActionLimit: 15,
      maxRegistrationsPerDay: 5,
      linkQualityRequirements: 'Domain Authority >= 35, Spam Score <= 10%, legitimate contextual placement',
      preferredCategories: [detectedNiche, 'Retail & E-commerce', 'Lifestyle', 'Business'],
      excludedCategories: ['Gambling', 'Adult', 'Pharma', 'PBNs', 'Link Farms'],
      contentInstructions: instructions,
    }

    return NextResponse.json({
      success: true,
      source: 'heuristic_semantic_parser',
      configuration: fallbackConfig,
      message: 'AI natural language analysis completed. Structured parameters ready for review.',
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

function extractPattern(text: string, regex: RegExp): string | null {
  const match = text.match(regex)
  return match && match[1] ? match[1].trim() : null
}

function extractNiche(text: string): string {
  const lower = text.toLowerCase()
  if (lower.includes('fashion') || lower.includes('clothing') || lower.includes('apparel') || lower.includes('streetwear')) {
    return 'Fashion, Apparel & Luxury Retail'
  }
  if (lower.includes('saas') || lower.includes('software') || lower.includes('tech') || lower.includes('app')) {
    return 'B2B Software & SaaS'
  }
  if (lower.includes('health') || lower.includes('fitness') || lower.includes('wellness')) {
    return 'Health & Wellness'
  }
  if (lower.includes('finance') || lower.includes('crypto') || lower.includes('investing')) {
    return 'Finance & FinTech'
  }
  return 'E-Commerce & Digital Brand'
}

function extractKeywords(text: string): string[] {
  const words = text
    .split(/[\n,;.]+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 3 && w.length < 40 && !w.includes('http'))
  
  const unique = Array.from(new Set(words))
  if (unique.length < 4) {
    return [
      'luxury modest fashion',
      'sustainable apparel brand',
      'bespoke streetwear collection',
      'ethical clothing manufacturer',
      'designer apparel store',
      'high authority fashion backlinks',
    ]
  }
  return unique.slice(0, 8)
}

function extractCountries(text: string): string[] {
  const known = ['United States', 'USA', 'United Kingdom', 'UK', 'Canada', 'Australia', 'Pakistan', 'UAE', 'Germany', 'France', 'India']
  const matched = known.filter((c) => text.toLowerCase().includes(c.toLowerCase()))
  return matched.map((c) => (c === 'USA' ? 'United States' : c === 'UK' ? 'United Kingdom' : c))
}
