'use client'

import React, { useState } from 'react'
import {
  Sliders,
  ShieldCheck,
  Check,
  Save,
  RefreshCw,
  AlertTriangle,
  Play,
  Pause,
  Clock,
} from 'lucide-react'

export interface AutomationRulesViewProps {
  settings: any
  onSettingsUpdated: () => void
}

export const AutomationRulesView: React.FC<AutomationRulesViewProps> = ({
  settings,
  onSettingsUpdated,
}) => {
  const [formData, setFormData] = useState({
    mode: settings?.mode || 'maximum_safe_automation',
    daily_task_limit: settings?.daily_task_limit || 15,
    monthly_backlink_target: settings?.monthly_backlink_target || 50,
    concurrent_browser_workers: settings?.concurrent_browser_workers || 2,
    retry_limit: settings?.retry_limit || 3,
    per_domain_cooldown_hours: settings?.per_domain_cooldown_hours || 72,
    duplicate_prevention: settings?.duplicate_prevention ?? 1,
    require_editorial_approval: settings?.require_editorial_approval ?? 1,
    enforce_spam_threshold: settings?.enforce_spam_threshold ?? 1,
    max_allowed_spam_score: settings?.max_allowed_spam_score || 25,
    min_domain_authority: settings?.min_domain_authority || 40,
    sender_name: settings?.sender_name || 'Raza',
    sender_email: settings?.sender_email || 'an3710828@gmail.com',
    sender_company: settings?.sender_company || 'Afimah Clothing Store',
  })

  const [isSaving, setIsSaving] = useState(false)
  const [savedNotice, setSavedNotice] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSavedNotice(false)

    try {
      const res = await fetch('/api/automation/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (data.success) {
        setSavedNotice(true)
        onSettingsUpdated()
      } else {
        alert(data.error || 'Failed to save settings')
      }
    } catch (err: any) {
      alert(`Save error: ${err.message}`)
    } finally {
      setIsSaving(false)
    }
  }

  const modes = [
    {
      id: 'research_only',
      title: 'Research Only',
      desc: 'Inspects destination websites, detects publishing opportunities and link policies without drafting or publishing.',
    },
    {
      id: 'research_drafting',
      title: 'Research + Content Drafting',
      desc: 'Performs research and synthesizes platform-tailored content drafts. Holds all submissions for human review.',
    },
    {
      id: 'assisted_publishing',
      title: 'Assisted Publishing',
      desc: 'Drafts content and prepares submission payloads. Prompts for one-click approval before each dispatch.',
    },
    {
      id: 'maximum_safe_automation',
      title: 'Maximum Safe Automation',
      desc: 'Autonomous end-to-end execution: research, registration, drafting, publishing, and verification within daily safety caps.',
    },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <form onSubmit={handleSave} className="bg-white border border-stone-200 rounded-lg p-6 shadow-sm space-y-6">
        <div>
          <h2 className="text-base font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <span>Automation Control Center & Safety Governance</span>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono font-medium">
              Strict Rate Limiting
            </span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Configure autonomous agent execution boundaries, daily action limits, and anti-spam compliance rules.
          </p>
        </div>

        {/* 1. Automation Mode Selection */}
        <div className="space-y-3 pt-3 border-t border-stone-100">
          <label className="block text-xs font-bold text-stone-900 uppercase font-mono tracking-wider">
            Operational Mode
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {modes.map((m) => {
              const isSelected = formData.mode === m.id
              return (
                <div
                  key={m.id}
                  onClick={() => setFormData({ ...formData, mode: m.id })}
                  className={`p-4 rounded-lg border text-xs cursor-pointer transition ${
                    isSelected
                      ? 'border-stone-900 bg-stone-900 text-white shadow-sm'
                      : 'border-stone-200 bg-stone-50/60 text-stone-800 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm">{m.title}</span>
                    {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <p className={`text-[11px] leading-relaxed ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                    {m.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* 2. Throttling & Limits */}
        <div className="space-y-3 pt-3 border-t border-stone-100">
          <label className="block text-xs font-bold text-stone-900 uppercase font-mono tracking-wider">
            Rate Limiting & Concurrency
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Daily Task Limit
              </label>
              <input
                type="number"
                value={formData.daily_task_limit}
                onChange={(e) => setFormData({ ...formData, daily_task_limit: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 border border-stone-300 rounded font-mono"
              />
              <span className="text-[10px] text-stone-400 mt-1 block">Maximum agent actions per 24 hours</span>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Concurrent Workers
              </label>
              <input
                type="number"
                value={formData.concurrent_browser_workers}
                onChange={(e) => setFormData({ ...formData, concurrent_browser_workers: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 border border-stone-300 rounded font-mono"
              />
              <span className="text-[10px] text-stone-400 mt-1 block">Parallel browser / audit threads</span>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Per-Domain Cooldown
              </label>
              <input
                type="number"
                value={formData.per_domain_cooldown_hours}
                onChange={(e) => setFormData({ ...formData, per_domain_cooldown_hours: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 border border-stone-300 rounded font-mono"
              />
              <span className="text-[10px] text-stone-400 mt-1 block">Hours before re-approaching same domain</span>
            </div>
          </div>
        </div>

        {/* 3. Quality & Spam Thresholds */}
        <div className="space-y-3 pt-3 border-t border-stone-100">
          <label className="block text-xs font-bold text-stone-900 uppercase font-mono tracking-wider">
            Quality & Anti-Spam Gateways
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Minimum Domain Authority (DA)
              </label>
              <input
                type="number"
                value={formData.min_domain_authority}
                onChange={(e) => setFormData({ ...formData, min_domain_authority: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 border border-stone-300 rounded font-mono"
              />
              <span className="text-[10px] text-stone-400 mt-1 block">Websites below this score are rejected</span>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Maximum Allowed Spam Score (%)
              </label>
              <input
                type="number"
                value={formData.max_allowed_spam_score}
                onChange={(e) => setFormData({ ...formData, max_allowed_spam_score: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 border border-stone-300 rounded font-mono"
              />
              <span className="text-[10px] text-stone-400 mt-1 block">Targets with higher spam rating are filtered out</span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-200">
          {savedNotice && (
            <span className="text-xs font-medium text-emerald-700 flex items-center gap-1 font-mono">
              <Check className="w-3.5 h-3.5" />
              <span>Automation rules updated successfully</span>
            </span>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm ml-auto disabled:opacity-50"
          >
            {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>{isSaving ? 'Updating...' : 'Save Automation Rules'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
