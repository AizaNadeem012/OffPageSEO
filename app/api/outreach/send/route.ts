import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  try {
    const { to, subject, body, senderName, senderEmail, smtpConfig } = await req.json()

    if (!to || !subject || !body) {
      return NextResponse.json(
        { success: false, error: 'Recipient (to), subject, and body are required.' },
        { status: 400 }
      )
    }

    // Check environment variables or client-provided SMTP config
    const host = smtpConfig?.host || process.env.SMTP_HOST
    const port = parseInt(smtpConfig?.port || process.env.SMTP_PORT || '587', 10)
    const user = smtpConfig?.user || process.env.SMTP_USER
    const pass = smtpConfig?.pass || process.env.SMTP_PASS
    const fromEmail = senderEmail || process.env.SMTP_FROM_EMAIL || user || 'outreach@afimahclothingstore.com'
    const fromName = senderName || process.env.SMTP_FROM_NAME || 'Afimah Clothing Store'

    // If SMTP credentials are configured, execute REAL email dispatch!
    if (host && user && pass) {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
          user,
          pass,
        },
      })

      const info = await transporter.sendMail({
        from: `"${fromName}" <${fromEmail}>`,
        to,
        subject,
        text: body,
        html: `<div style="font-family: sans-serif; line-height: 1.6; color: #1e293b;">
          ${body.replace(/\n/g, '<br/>')}
        </div>`,
      })

      return NextResponse.json({
        success: true,
        mode: 'real',
        messageId: info.messageId,
        message: `Real email successfully dispatched to ${to} via ${host}!`,
      })
    }

    // If no SMTP configured, return sandbox simulated delivery
    return NextResponse.json({
      success: true,
      mode: 'simulated',
      message: `Simulated delivery logged for ${to}. To send real live emails, add your SMTP credentials in Settings or .env.local.`,
    })
  } catch (err: any) {
    console.error('Email dispatch error:', err)
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to dispatch email' },
      { status: 500 }
    )
  }
}

// SMTP Connection Verification Ping
export async function GET(req: NextRequest) {
  const host = process.env.SMTP_HOST
  const port = parseInt(process.env.SMTP_PORT || '587', 10)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) {
    return NextResponse.json({
      connected: false,
      message: 'SMTP credentials not configured in .env.local yet. Running in Local Sandbox mode.',
    })
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    })

    await transporter.verify()
    return NextResponse.json({
      connected: true,
      message: `Successfully connected to SMTP server ${host}! Ready for live delivery.`,
    })
  } catch (err: any) {
    return NextResponse.json({
      connected: false,
      error: err.message,
      message: `Failed to connect to ${host}: ${err.message}`,
    })
  }
}
