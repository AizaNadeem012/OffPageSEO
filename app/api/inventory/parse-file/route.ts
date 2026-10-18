import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const sheetName = workbook.SheetNames[0]
    if (!sheetName) {
      return NextResponse.json({ success: false, error: 'Uploaded workbook has no sheets' }, { status: 400 })
    }

    const worksheet = workbook.Sheets[sheetName]
    const rawRows = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { defval: '' })

    if (rawRows.length === 0) {
      return NextResponse.json({ success: false, error: 'Spreadsheet contains no data rows' }, { status: 400 })
    }

    // Extract headers
    const headers = Object.keys(rawRows[0])

    // Detect column mappings automatically
    const detectedMapping: Record<string, string> = {
      website_url: detectHeader(headers, ['url', 'website', 'site', 'target url', 'domain', 'web address', 'link']),
      website_name: detectHeader(headers, ['name', 'site name', 'website name', 'portal', 'publication', 'title']),
      registration_url: detectHeader(headers, ['registration', 'register', 'signup', 'register url', 'join url']),
      login_url: detectHeader(headers, ['login', 'signin', 'login url', 'auth url']),
      submission_url: detectHeader(headers, ['submission', 'submit', 'editor', 'post url', 'submission url', 'article editor']),
      category: detectHeader(headers, ['category', 'niche', 'industry', 'type', 'vertical', 'tag']),
      account_email: detectHeader(headers, ['email', 'account email', 'user email', 'username', 'login email']),
      account_password: detectHeader(headers, ['password', 'pass', 'pwd', 'credential', 'secret']),
      target_landing_page: detectHeader(headers, ['target landing page', 'landing page', 'my url', 'destination', 'target page']),
      preferred_anchor: detectHeader(headers, ['anchor', 'anchor text', 'keyword', 'preferred anchor', 'link text']),
      notes: detectHeader(headers, ['notes', 'comments', 'remarks', 'guidelines', 'instructions']),
      priority: detectHeader(headers, ['priority', 'tier', 'importance', 'rank']),
    }

    // Preview first 15 rows
    const previewRows = rawRows.slice(0, 15)

    return NextResponse.json({
      success: true,
      filename: file.name,
      totalRows: rawRows.length,
      headers,
      detectedMapping,
      previewRows,
      allRows: rawRows, // returned so client can submit confirmed mapped batch
    })
  } catch (err: any) {
    console.error('Spreadsheet parse error:', err)
    return NextResponse.json({ success: false, error: err.message || 'Failed to parse spreadsheet' }, { status: 500 })
  }
}

function detectHeader(headers: string[], candidates: string[]): string {
  for (const h of headers) {
    const clean = h.toLowerCase().trim().replace(/[^a-z0-9 ]/g, '')
    for (const c of candidates) {
      if (clean === c || clean.includes(c)) return h
    }
  }
  return ''
}
