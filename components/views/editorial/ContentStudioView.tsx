'use client'

import React, { useState } from 'react'
import {
  PenTool,
  Sparkles,
  Check,
  X,
  RefreshCw,
  ExternalLink,
  Edit3,
  Save,
  CheckCircle2,
  FileText,
} from 'lucide-react'

export interface ContentStudioViewProps {
  drafts: any[]
  targets: any[]
  onDraftsUpdated: () => void
  onNavigateTab: (tab: string) => void
}

export const ContentStudioView: React.FC<ContentStudioViewProps> = ({
  drafts,
  targets,
  onDraftsUpdated,
  onNavigateTab,
}) => {
  const [selectedTargetId, setSelectedTargetId] = useState(targets[0]?.id || '')
  const [contentType, setContentType] = useState('article')
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeDraft, setActiveDraft] = useState<any | null>(drafts[0] || null)
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editBody, setEditBody] = useState('')

  // Generate Content
  const handleGenerateContent = async () => {
    if (!selectedTargetId) {
      alert('Please select a target portal')
      return
    }

    setIsGenerating(true)
    try {
      const res = await fetch('/api/content/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId: 'camp_master_default',
          targetWebsiteId: selectedTargetId,
          contentType,
        }),
      })

      const data = await res.json()
      if (data.success) {
        setActiveDraft(data.draft)
        setIsEditing(false)
        onDraftsUpdated()
      } else {
        alert(data.error || 'Generation failed')
      }
    } catch (err: any) {
      alert(`Generation error: ${err.message}`)
    } finally {
      setIsGenerating(false)
    }
  }

  // Update Status (Approve / Reject)
  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/content/generate', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      const data = await res.json()
      if (data.success) {
        onDraftsUpdated()
        if (activeDraft?.id === id) {
          setActiveDraft({ ...activeDraft, status })
        }
      }
    } catch (err: any) {
      alert(`Status update error: ${err.message}`)
    }
  }

  // Save manual edits
  const handleSaveEdits = async () => {
    if (!activeDraft) return
    try {
      const res = await fetch('/api/content/generate', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: activeDraft.id,
          title: editTitle,
          body: editBody,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setActiveDraft({ ...activeDraft, title: editTitle, body: editBody })
        setIsEditing(false)
        onDraftsUpdated()
      }
    } catch (err: any) {
      alert(`Save edit error: ${err.message}`)
    }
  }

  const startEditing = () => {
    if (!activeDraft) return
    setEditTitle(activeDraft.title)
    setEditBody(activeDraft.body)
    setIsEditing(true)
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Generator Bar */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-sm space-y-4">
        <div>
          <h2 className="text-base font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <span>AI Content Studio & Placement Synthesizer</span>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono font-medium">
              Multi-Format Engine
            </span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Generates platform-tailored articles, company profiles, directory descriptions, and guest posts adhering strictly to your master campaign voice and anchor targets.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end pt-2 border-t border-stone-100">
          <div className="sm:col-span-5">
            <label className="block text-[11px] font-semibold text-stone-700 mb-1">
              Destination Target Website
            </label>
            <select
              value={selectedTargetId}
              onChange={(e) => setSelectedTargetId(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-stone-300 rounded bg-white font-mono"
            >
              {targets.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.website_name || t.normalized_domain} ({t.normalized_domain})
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-4">
            <label className="block text-[11px] font-semibold text-stone-700 mb-1">
              Content Format / Placement Type
            </label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-stone-300 rounded bg-white"
            >
              <option value="article">Editorial Article (Informational)</option>
              <option value="business_profile">Business & Brand Profile</option>
              <option value="directory_listing">Directory Listing & Index Entry</option>
              <option value="guest_post">Guest Post & Case Study</option>
              <option value="resource_pitch">Resource Page Outreach Pitch</option>
              <option value="community_answer">Community & Forum Answer</option>
              <option value="author_bio">Author Biography & Contributor Bio</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <button
              onClick={handleGenerateContent}
              disabled={isGenerating}
              className="w-full px-4 py-1.5 rounded bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-sm disabled:opacity-50"
            >
              {isGenerating ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span>{isGenerating ? 'Synthesizing...' : 'Generate with AI'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Studio Workspace: Saved Drafts on Left (4 cols), Live Preview & Editor on Right (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Drafts Library (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-stone-500 font-mono">
            Drafts Repository ({drafts.length})
          </h3>

          <div className="space-y-2 max-h-[650px] overflow-y-auto pr-1">
            {drafts.length === 0 ? (
              <div className="bg-white border border-stone-200 rounded-lg p-6 text-center text-xs text-stone-400 font-mono">
                No drafts yet. Select a destination above to generate.
              </div>
            ) : (
              drafts.map((d) => {
                const isSelected = activeDraft?.id === d.id
                return (
                  <div
                    key={d.id}
                    onClick={() => {
                      setActiveDraft(d)
                      setIsEditing(false)
                    }}
                    className={`p-3 rounded-lg border text-xs cursor-pointer transition ${
                      isSelected
                        ? 'border-stone-900 bg-white ring-1 ring-stone-900 shadow-sm'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-stone-900 block truncate">
                        {d.title}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold shrink-0 ${
                          d.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-900'
                            : d.status === 'pending_approval'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {d.status?.toUpperCase()}
                      </span>
                    </div>

                    <div className="mt-1.5 flex items-center justify-between text-[11px] text-stone-500 font-mono">
                      <span>{d.content_type?.replace(/_/g, ' ')}</span>
                      <span>{new Date(d.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Right Column: Content Preview & Editorial Review (8 cols) */}
        <div className="lg:col-span-8">
          {activeDraft ? (
            <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-sm space-y-5">
              {/* Draft Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-stone-100 text-stone-800 uppercase">
                      {activeDraft.content_type?.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs text-stone-500 font-mono">
                      Placement: {activeDraft.intended_placement}
                    </span>
                  </div>

                  {!isEditing ? (
                    <h3 className="font-bold text-base text-stone-900">
                      {activeDraft.title}
                    </h3>
                  ) : (
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-2.5 py-1 text-sm font-bold border border-stone-300 rounded focus:outline-none"
                    />
                  )}
                </div>

                {/* Status Badges & Edit Button */}
                <div className="flex items-center gap-2 shrink-0">
                  {!isEditing ? (
                    <button
                      onClick={startEditing}
                      className="px-2.5 py-1 text-xs border border-stone-300 rounded text-stone-700 hover:bg-stone-50 flex items-center gap-1 font-medium"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleSaveEdits}
                      className="px-3 py-1 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700 flex items-center gap-1 font-semibold"
                    >
                      <Save className="w-3 h-3" />
                      <span>Save</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Target Link Context Pill */}
              <div className="p-3 bg-stone-50 border border-stone-200 rounded text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-semibold text-stone-700">Anchor Text:</span>
                  <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono">
                    "{activeDraft.anchor_text || 'Afimah Clothing Store'}"
                  </span>
                </div>
                <div className="flex items-center gap-2 text-stone-500 font-mono text-[11px] truncate">
                  <span>Destination:</span>
                  <span className="text-stone-800">{activeDraft.target_url}</span>
                </div>
              </div>

              {/* Content Body Preview */}
              <div>
                <label className="block text-[11px] font-semibold text-stone-500 uppercase font-mono mb-1.5">
                  Proposed Publication Text
                </label>
                {!isEditing ? (
                  <div className="p-4 rounded bg-white border border-stone-200 text-xs text-stone-800 whitespace-pre-wrap leading-relaxed font-serif text-[13px]">
                    {activeDraft.body}
                  </div>
                ) : (
                  <textarea
                    rows={12}
                    value={editBody}
                    onChange={(e) => setEditBody(e.target.value)}
                    className="w-full p-3.5 text-xs border border-stone-300 rounded font-serif text-[13px] leading-relaxed focus:outline-none"
                  />
                )}
              </div>

              {/* Approval Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-200 text-xs">
                <span className="text-stone-500 font-mono">
                  Relevance Score: <strong className="text-stone-800">92/100</strong>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateStatus(activeDraft.id, 'rejected')}
                    className="px-3 py-1.5 border border-stone-300 text-rose-700 hover:bg-rose-50 rounded font-medium flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(activeDraft.id, 'approved')}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-semibold flex items-center gap-1.5 shadow-sm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve for Dispatch</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-stone-200 rounded-lg p-12 text-center text-xs text-stone-400 font-mono">
              Select or generate a draft from above to review context and approval status.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
