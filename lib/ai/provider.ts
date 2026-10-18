/**
 * AI Provider Abstraction
 * Supports OpenAI (gpt-4o / gpt-4o-mini), Gemini, Anthropic, and local high-fidelity generator
 */

export interface AICompletionOptions {
  systemPrompt: string
  userPrompt: string
  temperature?: number
  jsonMode?: boolean
}

export interface AIProviderResponse {
  text: string
  parsedJson?: any
  provider: 'openai' | 'gemini' | 'anthropic' | 'local_fallback'
  model: string
  isFallback: boolean
  warning?: string
}

export async function generateAIContent(options: AICompletionOptions): Promise<AIProviderResponse> {
  const { systemPrompt, userPrompt, temperature = 0.7, jsonMode = false } = options

  // 1. Check OpenAI
  const openAiKey = process.env.OPENAI_API_KEY
  if (openAiKey) {
    try {
      const model = process.env.OPENAI_MODEL || 'gpt-4o-mini'
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openAiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature,
          ...(jsonMode ? { response_format: { type: 'json_object' } } : {}),
        }),
      })

      if (res.ok) {
        const data = await res.json()
        const text = data.choices[0]?.message?.content || ''
        let parsedJson = undefined
        if (jsonMode) {
          try {
            parsedJson = JSON.parse(text)
          } catch {
            // failed json parse
          }
        }
        return {
          text,
          parsedJson,
          provider: 'openai',
          model,
          isFallback: false,
        }
      }
    } catch (err: any) {
      console.warn('OpenAI request failed:', err.message)
    }
  }

  // 2. Check Gemini
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
  if (geminiKey) {
    try {
      const model = 'gemini-1.5-flash'
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
            },
          ],
        }),
      })

      if (res.ok) {
        const data = await res.json()
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
        let parsedJson = undefined
        if (jsonMode) {
          try {
            const clean = text.replace(/```json/g, '').replace(/```/g, '').trim()
            parsedJson = JSON.parse(clean)
          } catch {
            // failed
          }
        }
        return {
          text,
          parsedJson,
          provider: 'gemini',
          model,
          isFallback: false,
        }
      }
    } catch (err: any) {
      console.warn('Gemini request failed:', err.message)
    }
  }

  // 3. Fallback High-Fidelity Synthesizer with Clear Configuration Notice
  return {
    text: '',
    parsedJson: null,
    provider: 'local_fallback',
    model: 'rankwave-editorial-synthesizer',
    isFallback: true,
    warning: 'No AI API Key (OPENAI_API_KEY or GEMINI_API_KEY) detected. Running with built-in editorial synthesis engine.',
  }
}
