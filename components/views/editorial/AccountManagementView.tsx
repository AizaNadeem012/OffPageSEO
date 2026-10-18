'use client'

import React, { useState } from 'react'
import {
  Users,
  ShieldCheck,
  KeyRound,
  ExternalLink,
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Lock,
} from 'lucide-react'

export interface AccountManagementViewProps {
  accounts: any[]
  targets: any[]
  onAccountsUpdated: () => void
  onNavigateTab: (tab: string) => void
}

export const AccountManagementView: React.FC<AccountManagementViewProps> = ({
  accounts,
  targets,
  onAccountsUpdated,
  onNavigateTab,
}) => {
  const [isOnboarding, setIsOnboarding] = useState(false)
  const [selectedTargetId, setSelectedTargetId] = useState(targets[0]?.id || '')
  const [customEmail, setCustomEmail] = useState('an3710828@gmail.com')
  const [customPassword, setCustomPassword] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Handle Onboard Account
  const handleOnboardSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTargetId) {
      alert('Please select a target website.')
      return
    }

    setIsOnboarding(true)
    try {
      const res = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetWebsiteId: selectedTargetId,
          email: customEmail,
          password: customPassword,
        }),
      })

      const data = await res.json()
      if (data.success) {
        alert(data.result.message)
        setIsModalOpen(false)
        onAccountsUpdated()
      } else {
        alert(data.error || 'Onboarding failed')
      }
    } catch (err: any) {
      alert(`Onboarding error: ${err.message}`)
    } finally {
      setIsOnboarding(false)
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <span>Authorized User Accounts & Vault</span>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono font-medium">
              AES-256 Encrypted
            </span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Manages legitimate publishing accounts across target portals. Passwords are encrypted at rest and never exposed in logs or analytics.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-md bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition shadow-sm"
        >
          <Plus className="w-3.5 h-3.5 text-emerald-400" />
          <span>Onboard New Portal Account</span>
        </button>
      </div>

      {/* Onboard Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-stone-300 rounded-lg max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-emerald-600" />
                <span>Onboard Account for Target Portal</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600 text-xs font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleOnboardSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Target Website *
                </label>
                <select
                  value={selectedTargetId}
                  onChange={(e) => setSelectedTargetId(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-stone-300 rounded bg-white font-mono"
                  required
                >
                  {targets.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.website_name || t.normalized_domain} ({t.normalized_domain})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Account Email
                </label>
                <input
                  type="email"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-stone-300 rounded focus:border-stone-900 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Password (Leave blank to generate secure password)
                </label>
                <input
                  type="password"
                  value={customPassword}
                  onChange={(e) => setCustomPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-2.5 py-1.5 border border-stone-300 rounded focus:border-stone-900 focus:outline-none"
                />
              </div>

              <div className="p-3 rounded bg-stone-50 border border-stone-200 text-[11px] text-stone-500">
                Safeguards: The agent will inspect the registration page. If a CAPTCHA or identity challenge is detected, the task will pause safely and notify you via Human Action Required.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded border border-stone-300 text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isOnboarding}
                  className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {isOnboarding ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
                  <span>{isOnboarding ? 'Registering...' : 'Register Account'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Accounts Table */}
      <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-stone-200 flex items-center justify-between">
          <h3 className="font-bold text-xs uppercase tracking-wider text-stone-500 font-mono">
            Managed User Accounts ({accounts.length})
          </h3>
          <span className="text-xs text-stone-500 font-mono">
            Zero cleartext passwords stored
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-mono text-[11px] uppercase">
                <th className="py-2.5 px-4 font-semibold">Portal Domain</th>
                <th className="py-2.5 px-4 font-semibold">Username</th>
                <th className="py-2.5 px-4 font-semibold">Account Email</th>
                <th className="py-2.5 px-4 font-semibold">Password Vault</th>
                <th className="py-2.5 px-4 font-semibold">Status</th>
                <th className="py-2.5 px-4 font-semibold">Gateway Links</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {accounts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-stone-400 font-mono">
                    No accounts registered yet. Click "Onboard New Portal Account" above or let the agent register authorized targets automatically.
                  </td>
                </tr>
              ) : (
                accounts.map((acc) => (
                  <tr key={acc.id} className="hover:bg-stone-50/80 transition">
                    <td className="py-3 px-4 font-semibold text-stone-900">
                      <span>{acc.website_name || acc.domain}</span>
                      <span className="text-[11px] text-stone-500 font-mono block">
                        {acc.domain}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono font-medium text-stone-800">
                      {acc.username}
                    </td>

                    <td className="py-3 px-4 text-stone-600 font-mono text-[11px]">
                      {acc.email}
                    </td>

                    <td className="py-3 px-4 font-mono text-stone-400">
                      {acc.maskedPassword || '••••••••'}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                          acc.account_status === 'verified' || acc.account_status === 'registered'
                            ? 'bg-emerald-100 text-emerald-900'
                            : acc.account_status === 'pending_verification'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {acc.account_status?.toUpperCase() || 'REGISTERED'}
                      </span>
                    </td>

                    <td className="py-3 px-4 space-x-2">
                      {acc.login_url && (
                        <a
                          href={acc.login_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-stone-600 hover:text-stone-900 font-mono"
                        >
                          <span>Login</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
