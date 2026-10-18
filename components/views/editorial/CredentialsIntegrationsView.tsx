'use client'

import React, { useState, useEffect } from 'react'
import {
  KeyRound,
  Mail,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ExternalLink,
  Save,
  Server,
} from 'lucide-react'

export interface CredentialsIntegrationsViewProps {
  settings: any
  onSettingsUpdated: () => void
}

export const CredentialsIntegrationsView: React.FC<CredentialsIntegrationsViewProps> = ({
  settings,
  onSettingsUpdated,
}) => {
  const [smtpStatus, setSmtpStatus] = useState<{
    connected: boolean
    message: string
  } | null>(null)
  const [isTestingSmtp, setIsTestingSmtp] = useState(false)

  // Test SMTP connection via GET /api/outreach/send
  const handleTestSmtp = async () => {
    setIsTestingSmtp(true)
    try {
      const res = await fetch('/api/outreach/send')
      const data = await res.json()
      setSmtpStatus(data)
    } catch (err: any) {
      setSmtpStatus({ connected: false, message: `Failed to ping SMTP: ${err.message}` })
    } finally {
      setIsTestingSmtp(false)
    }
  }

  useEffect(() => {
    handleTestSmtp()
  }, [])

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-sm space-y-1">
        <h2 className="text-base font-bold text-stone-900 tracking-tight flex items-center gap-2">
          <span>Credentials & API Integrations</span>
          <span className="text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono font-medium">
            AES-256 Encrypted
          </span>
        </h2>
        <p className="text-xs text-stone-500">
          Manage external model providers, SEO metrics connectors, and authenticated SMTP email relays.
        </p>
      </div>

      {/* SMTP Email Dispatch Settings */}
      <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-sm text-stone-900">
              Outbound SMTP Outreach Relay
            </h3>
          </div>

          <button
            onClick={handleTestSmtp}
            disabled={isTestingSmtp}
            className="px-3 py-1 text-xs border border-stone-300 rounded text-stone-700 hover:bg-stone-50 flex items-center gap-1 font-mono transition"
          >
            {isTestingSmtp ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Server className="w-3 h-3" />}
            <span>Test Connection</span>
          </button>
        </div>

        {/* Live SMTP Status Banner */}
        {smtpStatus && (
          <div
            className={`p-3.5 rounded-md border text-xs flex items-center gap-2.5 ${
              smtpStatus.connected
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-amber-50 border-amber-200 text-amber-950'
            }`}
          >
            {smtpStatus.connected ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-amber-600 shrink-0" />
            )}
            <div className="min-w-0 font-mono text-[11px]">
              <span className="font-bold block">
                {smtpStatus.connected ? 'SMTP RELAY CONNECTED & VERIFIED' : 'LOCAL SANDBOX MODE ACTIVE'}
              </span>
              <span className="text-stone-600 block mt-0.5 truncate">
                {smtpStatus.message}
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-stone-700 mb-1">
              Sender Name
            </label>
            <input
              type="text"
              defaultValue={settings?.sender_name || 'Raza'}
              className="w-full px-2.5 py-1.5 border border-stone-300 rounded font-mono"
              readOnly
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-700 mb-1">
              Sender Email
            </label>
            <input
              type="email"
              defaultValue={settings?.sender_email || 'an3710828@gmail.com'}
              className="w-full px-2.5 py-1.5 border border-stone-300 rounded font-mono"
              readOnly
            />
          </div>
        </div>
      </div>

      {/* External AI & Search Engine API Integrations */}
      <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
          <KeyRound className="w-4 h-4 text-stone-500" />
          <h3 className="font-bold text-sm text-stone-900">
            External API Connectors
          </h3>
        </div>

        <div className="space-y-3 text-xs">
          {[
            {
              name: 'OpenAI API (GPT-4o / GPT-4o-mini)',
              envVar: 'OPENAI_API_KEY',
              status: process.env.OPENAI_API_KEY ? 'Configured' : 'Fallback Synthesizer Active',
              desc: 'Used for autonomous editorial pitch synthesis and natural language campaign parsing.',
            },
            {
              name: 'Google Gemini API',
              envVar: 'GEMINI_API_KEY',
              status: 'Ready / Supported',
              desc: 'Alternative multi-modal and fast text generation engine.',
            },
            {
              name: 'SerpApi / DataForSEO',
              envVar: 'SERPAPI_API_KEY',
              status: 'Ready / Supported',
              desc: 'Direct search engine discovery and real-time live SERP harvesting.',
            },
            {
              name: 'Ahrefs / Moz Domain Metrics',
              envVar: 'AHREFS_API_KEY',
              status: 'Ready / Supported',
              desc: 'Direct DR, DA, and referring domain authority verification.',
            },
          ].map((int) => (
            <div
              key={int.name}
              className="p-3.5 rounded bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div>
                <span className="font-bold text-stone-900 block">{int.name}</span>
                <span className="text-[11px] text-stone-500 block">{int.desc}</span>
              </div>

              <div className="text-right shrink-0">
                <span className="font-mono text-[10px] text-stone-500 block">
                  {int.envVar}
                </span>
                <span className="text-[11px] font-mono font-semibold text-emerald-700 block">
                  {int.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
