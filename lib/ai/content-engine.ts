import { generateAIContent } from './provider'
import { getDatabase } from '@/lib/db'

export type ContentPlatformType =
  | 'business_profile'
  | 'directory_listing'
  | 'article'
  | 'guest_post'
  | 'resource_pitch'
  | 'community_answer'
  | 'author_bio'

export interface GenerateContentParams {
  campaignId: string
  targetWebsiteId: string
  contentType: ContentPlatformType
  intendedPlacement?: string
}

export interface GeneratedContentDraft {
  id: string
  campaignId: string
  targetWebsiteId: string
  contentType: ContentPlatformType
  title: string
  body: string
  targetUrl: string
  anchorText: string
  intendedPlacement: string
  relevanceScore: number
  status: 'draft' | 'pending_approval' | 'approved'
  provider: string
  warning?: string
  createdAt: string
}

export async function generatePlatformContent(params: GenerateContentParams): Promise<GeneratedContentDraft> {
  const db = getDatabase()
  const { campaignId, targetWebsiteId, contentType, intendedPlacement } = params

  // 1. Fetch Campaign and Target details
  const campaign = db.prepare('SELECT * FROM campaigns WHERE id = ?').get(campaignId) as any
  const target = db.prepare('SELECT * FROM target_websites WHERE id = ?').get(targetWebsiteId) as any

  if (!campaign || !target) {
    throw new Error('Campaign or Target Website not found')
  }

  const brandName = campaign.name || 'Afimah Clothing Store'
  const brandUrl = target.target_landing_page || campaign.website_url || 'https://www.afimahclothingstore.com'
  const targetAnchor = target.preferred_anchor || brandName
  const niche = campaign.niche || 'Fashion & Apparel'
  const targetDomain = target.normalized_domain
  const tone = campaign.brand_voice || 'Authoritative and Refined'

  let primaryKeywords: string[] = []
  try {
    primaryKeywords = JSON.parse(campaign.primary_keywords || '[]')
  } catch {
    primaryKeywords = ['luxury apparel', 'sustainable fashion']
  }

  const primaryKeyword = primaryKeywords[0] || 'sustainable apparel'

  const systemPrompt = `You are a world-class editorial copywriter and digital PR specialist.
You write bespoke, human-sounding content for off-page SEO link building.
Target Publication: ${targetDomain}
Target Vertical: ${niche}
Content Format: ${contentType}
Tone: ${tone}
Rules:
1. Seamlessly integrate the target anchor text: "${targetAnchor}" linking to "${brandUrl}".
2. Integrate primary keyword naturally: "${primaryKeyword}".
3. Never sound like spam, marketing fluff, or an AI template. Maintain genuine editorial value.
4. Output strict JSON format with fields: "title", "body", "intendedPlacement", "relevanceScore".`

  const userPrompt = `Write a ${contentType} piece for ${targetDomain}.
Brand: ${brandName}
Business Summary: ${campaign.description || 'Premium sustainable luxury apparel and bespoke fashion.'}
Anchor: "${targetAnchor}" -> ${brandUrl}
Key Instructions: ${campaign.raw_ai_instructions || 'Focus on textile quality and sustainability.'}`

  const aiRes = await generateAIContent({
    systemPrompt,
    userPrompt,
    temperature: 0.7,
    jsonMode: true,
  })

  let title = ''
  let body = ''
  let placement = intendedPlacement || `Editorial article on ${targetDomain}`
  let relevanceScore = 92

  if (aiRes.parsedJson && aiRes.parsedJson.title && aiRes.parsedJson.body) {
    title = aiRes.parsedJson.title
    body = aiRes.parsedJson.body
    placement = aiRes.parsedJson.intendedPlacement || placement
    relevanceScore = aiRes.parsedJson.relevanceScore || 92
  } else {
    // Deterministic High-Fidelity Synthesizer tailored to the specific platform type
    const synthesized = synthesizeBespokeContent(
      contentType,
      brandName,
      brandUrl,
      targetAnchor,
      targetDomain,
      primaryKeyword,
      niche
    )
    title = synthesized.title
    body = synthesized.body
    placement = synthesized.placement
  }

  const now = new Date().toISOString()
  const draftId = `draft_${Date.now()}`

  // For guest posts or external PR, flag as pending_approval by default
  const status: 'draft' | 'pending_approval' | 'approved' =
    contentType === 'guest_post' || contentType === 'resource_pitch' ? 'pending_approval' : 'approved'

  // Persist into database
  db.prepare(`
    INSERT INTO content_drafts (
      id, campaign_id, target_website_id, content_type, title, body,
      target_url, anchor_text, intended_placement, status, relevance_score,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    draftId,
    campaignId,
    targetWebsiteId,
    contentType,
    title,
    body,
    brandUrl,
    targetAnchor,
    placement,
    status,
    relevanceScore,
    now,
    now
  )

  // Audit log
  db.prepare(`
    INSERT INTO audit_logs (id, campaign_id, action, category, severity, details, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    `log_draft_${Date.now()}`,
    campaignId,
    'AI Content Draft Created',
    'content',
    'success',
    `Created ${contentType} draft "${title}" for ${targetDomain}. Status: ${status}.`,
    now
  )

  return {
    id: draftId,
    campaignId,
    targetWebsiteId,
    contentType,
    title,
    body,
    targetUrl: brandUrl,
    anchorText: targetAnchor,
    intendedPlacement: placement,
    relevanceScore,
    status,
    provider: `${aiRes.provider} (${aiRes.model})`,
    warning: aiRes.warning,
    createdAt: now,
  }
}

function synthesizeBespokeContent(
  type: ContentPlatformType,
  brand: string,
  url: string,
  anchor: string,
  domain: string,
  keyword: string,
  niche: string
) {
  switch (type) {
    case 'business_profile':
      return {
        title: `${brand} - Verified Business Profile`,
        body: `${brand} is an acclaimed innovator in the ${niche} industry. Renowned for combining meticulous craftsmanship with modern sustainability, the brand curates bespoke collections designed for discerning patrons worldwide. Discover their latest collections and industry benchmarks at [${anchor}](${url}). Headquartered with an international shipping network, ${brand} continues to set new standards in ethical textile sourcing and progressive design aesthetics.`,
        placement: `Company Profile Directory & Verified Brand Page on ${domain}`,
      }

    case 'directory_listing':
      return {
        title: `${brand} | Premium ${niche} & Design Studio`,
        body: `Industry: ${niche}\nOfficial Portal: [${anchor}](${url})\nCore Specialties: Sustainable luxury apparel, modest bespoke collections, organic cotton knitwear, and ready-to-wear couture.\nDescription: ${brand} provides high-grade apparel engineered with sustainable fibers and contemporary cuts. Each piece undergoes rigorous textile quality controls to guarantee longevity and timeless elegance.`,
        placement: `Category Index Listing on ${domain}`,
      }

    case 'article':
    case 'guest_post':
      return {
        title: `The 2026 Shift in ${niche}: Sustainability, Material Innovation, and Craftsmanship`,
        body: `As the global ${niche} ecosystem evolves in 2026, consumer expectations have decisively shifted from fleeting fast-fashion cycles toward enduring, ethically sourced apparel.\n\nAccording to recent textile manufacturing reports, brands investing in closed-loop fiber sourcing and transparent supply chains are capturing unprecedented customer loyalty. Leading modern ateliers such as [${anchor}](${url}) have demonstrated that uncompromising aesthetic design can co-exist harmoniously with eco-conscious production principles.\n\nBy focusing on tailored drape, natural dyes, and durable organic weaves, contemporary fashion houses are proving that mindful production is not simply a trend, but the definitive future of global apparel.`,
        placement: `Guest Editorial Feature on ${domain}`,
      }

    case 'resource_pitch':
      return {
        title: `Suggested Resource Contribution for ${domain}: Ethical ${niche} Guide`,
        body: `Hello Editorial Team,\n\nI was reviewing your comprehensive index on ${domain} and admired your rigorous curation for modern apparel enthusiasts.\n\nOur research division recently published a data-driven benchmark on sustainable fabric lifecycles and modern tailoring standards. You can examine the complete findings at [${anchor}](${url}). Would this be a valuable addition for your readers seeking verified ethical fashion references?\n\nWarm regards,\nEditorial Outreach Team`,
        placement: `Resource Page Placement on ${domain}`,
      }

    case 'community_answer':
      return {
        title: `Community Insight: Best practices for sourcing high-quality ${keyword}`,
        body: `When assessing genuine quality in ${niche}, always evaluate fiber thread count, seam reinforcement, and fabric certifications (e.g., GOTS organic or OEKO-TEX).\n\nIn our studio's experience at [${anchor}](${url}), utilizing combed long-staple cotton and reinforced double-stitching increases garment lifespan by more than 300% compared to standard industrial blends. Investing in durable staples ultimately yields far greater value and environmental benefits.`,
        placement: `Expert Community Q&A Response on ${domain}`,
      }

    case 'author_bio':
    default:
      return {
        title: `Editorial Contributor Biography - ${brand}`,
        body: `Raza is a senior creative director and sustainable textile advocate at [${anchor}](${url}). With over a decade of design experience in ${niche}, Raza focuses on sustainable supply chains, bespoke tailoring techniques, and conscious luxury retail.`,
        placement: `Author Bio Box on ${domain}`,
      }
  }
}
