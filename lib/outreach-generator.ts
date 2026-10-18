import { EmailTemplate, OutreachDraft, Prospect, AutomationSettings } from '@/types'
import { generateId } from './utils'
import { validateProspectSafety } from './seo-engine'

// Extracts clean site name from domain or URL
export function extractSiteName(domain: string): string {
  if (!domain) return 'your team'
  const clean = domain.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]
  const name = clean.split('.')[0]
  return name.charAt(0).toUpperCase() + name.slice(1)
}

// Replaces template tokens with real prospect data
export function interpolateVariables(
  text: string,
  prospect: Prospect,
  settings: AutomationSettings,
  stepNumber = 1
): string {
  const siteName = extractSiteName(prospect.domain)
  const firstName = prospect.contact?.name ? prospect.contact.name.split(' ')[0] : 'there'
  const recentArticle = prospect.pageTitle || 'your recent industry coverage'
  const topic1 = prospect.suggestedTopic || `Emerging Trends in ${prospect.niche || 'Digital Marketing'}`
  const topic2 = `Actionable Off-Page SEO Strategies for 2026: Benchmark Analysis`
  const brokenUrl = prospect.brokenLinkUrl || 'https://example-resource.com/dead-link-404'
  const replacementUrl = `https://${settings.senderCompany.toLowerCase().replace(/[^a-z0-9]/g, '')}.com/research/benchmarks-2026`

  let result = text
    .replace(/\{\{First_Name\}\}/g, firstName)
    .replace(/\{\{Site_Name\}\}/g, siteName)
    .replace(/\{\{Article_Title\}\}/g, recentArticle)
    .replace(/\{\{Recent_Article\}\}/g, recentArticle)
    .replace(/\{\{Resource_Page_Title\}\}/g, recentArticle)
    .replace(/\{\{Show_Name\}\}/g, `${siteName} Growth Show`)
    .replace(/\{\{Recent_Episode\}\}/g, recentArticle)
    .replace(/\{\{Guest_Topic\}\}/g, topic1)
    .replace(/\{\{Tool_Name\}\}/g, `${settings.senderCompany} Open Authority Index`)
    .replace(/\{\{Resource_Benefit\}\}/g, 'track non-spam link acquisition metrics without expensive software')
    .replace(/\{\{Mentioned_Brand\}\}/g, settings.senderCompany)
    .replace(/\{\{Direct_URL\}\}/g, replacementUrl)
    .replace(/\{\{Proposed_Topic_1\}\}/g, topic1)
    .replace(/\{\{Proposed_Topic_2\}\}/g, topic2)
    .replace(/\{\{Broken_URL\}\}/g, brokenUrl)
    .replace(/\{\{Replacement_URL\}\}/g, replacementUrl)
    .replace(/\{\{Sender_Name\}\}/g, settings.senderName)
    .replace(/\{\{Sender_Company\}\}/g, settings.senderCompany)

  // Append compliance footer if step 1 or not present
  if (settings.complianceFooter && !result.includes('Opt Out') && !result.includes('unsubscribe')) {
    const footer = `\n\n---\n${settings.complianceFooter.replace(/\{\{Site_Name\}\}/g, siteName)}`
    result += footer
  }

  return result
}

// Builds an outreach draft for a given prospect and template
export function generateOutreachDraft(
  prospect: Prospect,
  template: EmailTemplate,
  settings: AutomationSettings,
  sequenceStep = 1
): OutreachDraft {
  const subject = interpolateVariables(template.subject, prospect, settings, sequenceStep)
  const body = interpolateVariables(template.body, prospect, settings, sequenceStep)

  const safety = validateProspectSafety(prospect, settings)

  return {
    id: generateId('draft'),
    prospectId: prospect.id,
    templateId: template.id,
    subject,
    body,
    sequenceStep,
    status: 'draft',
    requiresApproval: settings.requireApprovalForEveryEmail,
    safetyPassed: safety.isSafe,
    safetyWarnings: safety.warnings,
  }
}

// Generates follow-up templates for multi-step sequences
export function generateFollowUpContent(
  step: number,
  initialDraft: OutreachDraft,
  prospect: Prospect,
  settings: AutomationSettings
): { subject: string; body: string } {
  const firstName = prospect.contact?.name ? prospect.contact.name.split(' ')[0] : 'there'
  const siteName = extractSiteName(prospect.domain)

  if (step === 2) {
    return {
      subject: `Re: ${initialDraft.subject}`,
      body: `Hi ${firstName},

Just following up on my previous note regarding ${siteName}. I know how busy editorial schedules get, so I wanted to bring this back to the top of your inbox.

Would you be open to a quick look at the outline for "${prospect.suggestedTopic || 'our proposed guide'}"?

Best,
${settings.senderName}
${settings.senderCompany}`,
    }
  }

  if (step === 3) {
    return {
      subject: `Re: ${initialDraft.subject}`,
      body: `Hi ${firstName},

Wanted to add one quick resource that might be helpful for your team regardless: we just summarized key findings into an interactive checklist.

If you have time to collaborate this quarter, let me know. If not, no worries at all!

Best regards,
${settings.senderName}`,
    }
  }

  // Step 4: Polite Breakup
  return {
    subject: `Closing the loop on ${siteName}`,
    body: `Hi ${firstName},

I assume your editorial calendar is currently full, so I will pause following up here.

Feel free to reach out anytime in the future if you ever need research data or insights on ${prospect.niche || 'modern SEO'}.

Thanks and all the best with ${siteName}!

Cheers,
${settings.senderName}
${settings.senderCompany}`,
  }
}
