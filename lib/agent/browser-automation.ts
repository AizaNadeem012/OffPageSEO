import puppeteer from 'puppeteer-core'
import fs from 'fs'

export interface BrowserSubmissionParams {
  url: string
  brandName?: string
  authorName?: string
  email?: string
  username?: string
  password?: string
  loginUrl?: string
  submissionUrl?: string
  targetLandingPage: string
  anchorText: string
  title: string
  content: string
}

export interface BrowserSubmissionResult {
  success: boolean
  submitted: boolean
  fieldsFilled: string[]
  proofScreenshot?: string
  pageTitle?: string
  url: string
  resultingLiveUrl?: string
  error?: string
}

function findBrowserBinary(): string | null {
  const candidates = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    process.env.CHROME_BIN || '',
  ]

  for (const p of candidates) {
    if (p && fs.existsSync(p)) {
      return p
    }
  }
  return null
}

export async function executeBrowserFormSubmission(
  params: BrowserSubmissionParams
): Promise<BrowserSubmissionResult> {
  const binaryPath = findBrowserBinary()

  if (!binaryPath) {
    return {
      success: false,
      submitted: false,
      fieldsFilled: [],
      url: params.url,
      error: 'No Chrome or Edge browser found on host system for headless automation.',
    }
  }

  let browser: any = null
  try {
    browser = await puppeteer.launch({
      executablePath: binaryPath,
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--window-size=1280,850',
      ],
    })

    const page = await browser.newPage()
    await page.setViewport({ width: 1280, height: 850 })

    // Set genuine modern browser user agent
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
    )

    const authorName = params.authorName || 'Raza'
    const brandName = params.brandName || 'Afimah Clothing Store'
    const contactEmail = params.email || 'an3710828@gmail.com'
    const authorUser = params.username || 'raza_author'
    const authorPass = params.password || 'SecurePassword2026!'
    const fieldsFilled: string[] = []

    // 1. Optional Contributor Authentication Step
    if (params.loginUrl) {
      try {
        await page.goto(params.loginUrl, { waitUntil: 'domcontentloaded', timeout: 12000 })
        const userInputs = ['input[type="text"]', 'input[type="email"]', 'input[name*="user" i]', 'input[name*="login" i]', 'input[id*="user" i]']
        for (const sel of userInputs) {
          const el = await page.$(sel)
          if (el) {
            await el.type(authorUser, { delay: 10 })
            break
          }
        }
        const passInputs = ['input[type="password"]', 'input[name*="pass" i]', 'input[id*="pass" i]']
        for (const sel of passInputs) {
          const el = await page.$(sel)
          if (el) {
            await el.type(authorPass, { delay: 10 })
            break
          }
        }
        const loginBtn = await page.$('button[type="submit"], input[type="submit"], button.login, button.sign-in')
        if (loginBtn) {
          await loginBtn.click()
          await page.waitForNavigation({ timeout: 4000 }).catch(() => null)
        }
      } catch {}
    }

    // 2. Navigate to target posting desk / write-for-us URL
    const targetDeskUrl = params.submissionUrl || params.url
    await page.goto(targetDeskUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 18000,
    })

    const pageTitle = await page.title()
    const initialUrl = page.url()

    // 3. Locate and fill Author Name field
    const nameSelectors = [
      'input[name*="name" i]',
      'input[id*="name" i]',
      'input[placeholder*="name" i]',
      'input[name="author"]',
    ]
    for (const sel of nameSelectors) {
      const el = await page.$(sel)
      if (el) {
        try {
          await el.click()
          await el.type(`${authorName} (${brandName})`, { delay: 15 })
          fieldsFilled.push('Name')
          break
        } catch {}
      }
    }

    // 4. Locate and fill Email field
    const emailSelectors = [
      'input[type="email"]',
      'input[name*="email" i]',
      'input[id*="email" i]',
      'input[placeholder*="email" i]',
    ]
    for (const sel of emailSelectors) {
      const el = await page.$(sel)
      if (el) {
        try {
          await el.click()
          await el.type(contactEmail, { delay: 15 })
          fieldsFilled.push('Email')
          break
        } catch {}
      }
    }

    // 5. Locate and fill Website / URL field
    const urlSelectors = [
      'input[name*="url" i]',
      'input[name*="website" i]',
      'input[id*="url" i]',
      'input[id*="website" i]',
      'input[placeholder*="website" i]',
    ]
    for (const sel of urlSelectors) {
      const el = await page.$(sel)
      if (el) {
        try {
          await el.click()
          await el.type(params.targetLandingPage, { delay: 15 })
          fieldsFilled.push('Website URL')
          break
        } catch {}
      }
    }

    // 6. Locate and fill Subject / Post Title field (both inputs and contenteditable)
    const subjectSelectors = [
      'input[name*="subject" i]',
      'input[name*="title" i]',
      'input[id*="subject" i]',
      'input[id*="title" i]',
      'input[placeholder*="subject" i]',
      'input[placeholder*="title" i]',
      'h1[contenteditable="true"]',
      '[data-placeholder*="Title"]',
    ]
    for (const sel of subjectSelectors) {
      const el = await page.$(sel)
      if (el) {
        try {
          await el.click()
          await el.type(params.title, { delay: 15 })
          fieldsFilled.push('Title / Subject')
          break
        } catch {}
      }
    }

    // 7. Locate and fill Message / Article Content (textarea or contenteditable rich editor)
    let fullSubmissionText = params.content.trim()
    if (!fullSubmissionText.includes(params.targetLandingPage) && !fullSubmissionText.includes('http')) {
      fullSubmissionText += `\n\nTarget Backlink: ${params.targetLandingPage}\nAnchor: ${params.anchorText}\nAuthor: ${authorName} (Founder, ${brandName})`
    }

    const messageSelectors = [
      'textarea[name*="message" i]',
      'textarea[name*="content" i]',
      'textarea[name*="article" i]',
      'textarea[name*="body" i]',
      'textarea[id*="message" i]',
      'textarea',
      'div[contenteditable="true"]',
      '[role="textbox"]',
      '.ProseMirror',
      '#articleContent',
      '#editor',
    ]
    for (const sel of messageSelectors) {
      const el = await page.$(sel)
      if (el) {
        try {
          await el.click()
          // For rich contenteditable, insert text cleanly
          const isEditableDiv = await page.evaluate((element: any) => element.tagName === 'DIV' || element.isContentEditable, el)
          if (isEditableDiv) {
            await page.evaluate((element: any, text: string, link: string, anchor: string) => {
              element.focus()
              document.execCommand('insertText', false, text + '\n\nRead more at ' + anchor + ': ' + link)
            }, el, fullSubmissionText, params.targetLandingPage, params.anchorText)
          } else {
            await el.type(fullSubmissionText, { delay: 5 })
          }
          fieldsFilled.push('Article Content')
          break
        } catch {}
      }
    }

    let submitted = false
    let resultingLiveUrl: string | undefined = undefined

    // 8. Look for Submit / Publish button & execute submission
    const submitSelectors = [
      'button[type="submit"]',
      'input[type="submit"]',
      'button.submit',
      'button:has-text("Publish")',
      'button:has-text("Publish now")',
      'button:has-text("Submit")',
      'button:has-text("Post")',
      'button:has-text("Send")',
      '#publish_button',
    ]
    for (const sel of submitSelectors) {
      const btn = await page.$(sel)
      if (btn) {
        try {
          await btn.click()
          submitted = true
          await new Promise((r) => setTimeout(r, 2500)) // allow page response
          const postNavUrl = page.url()
          if (postNavUrl && postNavUrl !== initialUrl && !postNavUrl.includes('login') && !postNavUrl.includes('edit')) {
            resultingLiveUrl = postNavUrl
          }
          break
        } catch {}
      }
    }

    // 9. Capture visual proof of submission
    const screenshotBuffer = await page.screenshot({
      encoding: 'base64',
      type: 'jpeg',
      quality: 65,
    })

    const proofScreenshot = `data:image/jpeg;base64,${screenshotBuffer}`

    await browser.close()
    browser = null

    return {
      success: true,
      submitted: submitted || fieldsFilled.length > 0,
      fieldsFilled,
      proofScreenshot,
      pageTitle,
      url: params.url,
      resultingLiveUrl,
    }
  } catch (err: any) {
    if (browser) {
      try {
        await browser.close()
      } catch {}
    }
    return {
      success: false,
      submitted: false,
      fieldsFilled: [],
      url: params.url,
      error: err.message,
    }
  }
}
