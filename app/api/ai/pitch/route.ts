import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { brandName, domain, recipientName, articleTitle, niche, apiKey } = await req.json()
    const openAiKey = apiKey || process.env.OPENAI_API_KEY

    if (openAiKey) {
      const prompt = `You are a high-level digital PR and ethical SEO outreach specialist.
Write a personalized, concise, respectful, non-spam editorial outreach email.
- Sender Brand: ${brandName || 'Afimah Clothing Store'}
- Recipient: ${recipientName || 'Editor'}
- Publishing Domain: ${domain || 'Fashion Magazine'}
- Target Article Title: ${articleTitle || 'Style & Apparel Guide'}
- Niche: ${niche || 'Clothing & Fashion'}

Requirements:
1. Subject line must be catchy, relevant, and editorial.
2. Tone must be humble, polite, and value-first.
3. Keep under 120 words.
4. Do NOT offer to buy links or sound salesy.
5. Provide response as JSON: { "subject": "...", "body": "..." }`

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openAiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
          temperature: 0.7,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        const parsed = JSON.parse(data.choices[0].message.content)
        return NextResponse.json({
          success: true,
          mode: 'real_openai_gpt4o',
          subject: parsed.subject,
          body: parsed.body,
        })
      }
    }

    // Default template synthesizer fallback
    return NextResponse.json({
      success: true,
      mode: 'template_synthesizer',
      subject: `Collaboration proposal for ${domain}: 2026 ${niche} trends`,
      body: `Hi ${recipientName ? recipientName.split(' ')[0] : 'there'},\n\nI loved your recent coverage on ${domain}.\n\nAt ${brandName}, we recently published new design insights and benchmarks for ${niche}. Would you be open to an exclusive guest contribution for your readers?\n\nBest regards,\n${brandName} Team`,
    })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'AI synthesis error' },
      { status: 500 }
    )
  }
}
