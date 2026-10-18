'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { RankWaveSidebar } from '@/components/editorial/RankWaveSidebar'
import { RankWaveHeader } from '@/components/editorial/RankWaveHeader'

// 15 Editorial Views
import { CommandCenterView } from '@/components/views/editorial/CommandCenterView'
import { NewCampaignView } from '@/components/views/editorial/NewCampaignView'
import { CampaignWorkspaceView } from '@/components/views/editorial/CampaignWorkspaceView'
import { WebsiteInventoryView } from '@/components/views/editorial/WebsiteInventoryView'
import { WebsiteResearchView } from '@/components/views/editorial/WebsiteResearchView'
import { AccountManagementView } from '@/components/views/editorial/AccountManagementView'
import { ContentStudioView } from '@/components/views/editorial/ContentStudioView'
import { PublishingQueueView } from '@/components/views/editorial/PublishingQueueView'
import { BacklinkVerificationView } from '@/components/views/editorial/BacklinkVerificationView'
import { CompetitorGapView } from '@/components/views/editorial/CompetitorGapView'
import { ReportsAnalyticsView } from '@/components/views/editorial/ReportsAnalyticsView'
import { AutomationRulesView } from '@/components/views/editorial/AutomationRulesView'
import { CredentialsIntegrationsView } from '@/components/views/editorial/CredentialsIntegrationsView'
import { ActivityLogsView } from '@/components/views/editorial/ActivityLogsView'
import { HumanActionRequiredView } from '@/components/views/editorial/HumanActionRequiredView'
import { CampaignsManagerView } from '@/components/views/editorial/CampaignsManagerView'
import { AutonomousAgentCockpitView } from '@/components/agent/AutonomousAgentCockpitView'

export default function DashboardPage() {
  const [isMounted, setIsMounted] = useState(false)
  const [currentTab, setCurrentTab] = useState<string>('agent_cockpit')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Real SQLite Database State
  const [analytics, setAnalytics] = useState<any>({
    totalWebsites: 0,
    totalBacklinks: 0,
    verifiedBacklinks: 0,
    pendingApprovals: 0,
    totalDrafts: 0,
    totalAccounts: 0,
    activeTasks: 0,
    averageDomainAuthority: 50,
    statusBreakdown: {},
  })

  const [campaigns, setCampaigns] = useState<any[]>([])
  const [activeCampaign, setActiveCampaign] = useState<any | null>(null)
  const [targets, setTargets] = useState<any[]>([])
  const [accounts, setAccounts] = useState<any[]>([])
  const [drafts, setDrafts] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [queueCounts, setQueueCounts] = useState<Record<string, number>>({})
  const [backlinks, setBacklinks] = useState<any[]>([])
  const [approvals, setApprovals] = useState<any[]>([])
  const [settings, setSettings] = useState<any>(null)
  const [logs, setLogs] = useState<any[]>([])
  const [isProcessingQueue, setIsProcessingQueue] = useState(false)

  // Fetch all operational data from backend
  const syncAllData = useCallback(async () => {
    try {
      const [
        analyticsRes,
        campaignsRes,
        targetsRes,
        accountsRes,
        draftsRes,
        queueRes,
        backlinksRes,
        approvalsRes,
        settingsRes,
        logsRes,
      ] = await Promise.all([
        fetch('/api/analytics').then((r) => r.json()).catch(() => ({})),
        fetch('/api/campaigns').then((r) => r.json()).catch(() => ({})),
        fetch('/api/inventory?limit=200').then((r) => r.json()).catch(() => ({})),
        fetch('/api/accounts').then((r) => r.json()).catch(() => ({})),
        fetch('/api/content/generate').then((r) => r.json()).catch(() => ({})),
        fetch('/api/queue').then((r) => r.json()).catch(() => ({})),
        fetch('/api/backlinks').then((r) => r.json()).catch(() => ({})),
        fetch('/api/human-approvals?status=all').then((r) => r.json()).catch(() => ({})),
        fetch('/api/automation/settings').then((r) => r.json()).catch(() => ({})),
        fetch('/api/audit-logs').then((r) => r.json()).catch(() => ({})),
      ])

      if (analyticsRes.success) setAnalytics(analyticsRes.analytics)
      if (campaignsRes.success) {
        setCampaigns(campaignsRes.campaigns)
        if (!activeCampaign && campaignsRes.campaigns.length > 0) {
          setActiveCampaign(campaignsRes.campaigns[0])
        }
      }
      if (targetsRes.success) setTargets(targetsRes.websites)
      if (accountsRes.success) setAccounts(accountsRes.accounts)
      if (draftsRes.success) setDrafts(draftsRes.drafts)
      if (queueRes.success) {
        setTasks(queueRes.tasks)
        setQueueCounts(queueRes.counts)
      }
      if (backlinksRes.success) setBacklinks(backlinksRes.backlinks)
      if (approvalsRes.success) setApprovals(approvalsRes.approvals)
      if (settingsRes.success) setSettings(settingsRes.settings)
      if (logsRes.success) setLogs(logsRes.logs)
    } catch (err) {
      console.error('Failed to sync data:', err)
    }
  }, [activeCampaign])

  useEffect(() => {
    setIsMounted(true)
    syncAllData()
    // Poll data every 15 seconds to update background queues smoothly
    const interval = setInterval(syncAllData, 15000)
    return () => clearInterval(interval)
  }, [syncAllData])

  // Trigger Queue Run
  const handleTriggerQueueRun = async () => {
    setIsProcessingQueue(true)
    try {
      const res = await fetch('/api/queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batchSize: 5 }),
      })
      const data = await res.json()
      if (data.success) {
        await syncAllData()
      }
    } catch (err) {
      console.error('Queue execution failed:', err)
    } finally {
      setIsProcessingQueue(false)
    }
  }

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center text-stone-900 font-sans">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-stone-500 font-mono tracking-wider">
            MOUNTING RANKWAVE OPERATIONAL PLATFORM...
          </p>
        </div>
      </div>
    )
  }

  const pendingApprovalsCount = approvals.filter((a) => a.status === 'pending').length

  return (
    <div className="min-h-screen flex bg-[#F8F9FA] text-stone-900 font-sans antialiased selection:bg-emerald-600 selection:text-white relative">
      {/* Desktop Sidebar (Permanent left docked) */}
      <div className="hidden md:flex md:w-64 md:shrink-0 md:h-screen md:sticky md:top-0">
        <RankWaveSidebar
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          pendingApprovalsCount={pendingApprovalsCount}
          activeCampaignName={activeCampaign?.name || 'Afimah Clothing Q4 Global Fashion Expansion'}
          campaigns={campaigns}
          activeCampaign={activeCampaign}
          onSelectCampaign={(camp) => setActiveCampaign(camp)}
        />
      </div>

      {/* Mobile Drawer (Slide-over with dark backdrop) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            <RankWaveSidebar
              currentTab={currentTab}
              onSelectTab={(tab) => {
                setCurrentTab(tab)
                setIsMobileMenuOpen(false)
              }}
              pendingApprovalsCount={pendingApprovalsCount}
              activeCampaignName={activeCampaign?.name || 'Afimah Clothing Q4 Global Fashion Expansion'}
              campaigns={campaigns}
              activeCampaign={activeCampaign}
              onSelectCampaign={(camp) => setActiveCampaign(camp)}
              onCloseMobile={() => setIsMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Workspace Column */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Editorial Masthead Header */}
        <RankWaveHeader
          currentTab={currentTab}
          pendingApprovalsCount={pendingApprovalsCount}
          onNavigateTab={(tab) => setCurrentTab(tab)}
          onTriggerQueueRun={handleTriggerQueueRun}
          isProcessingQueue={isProcessingQueue}
          onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        {/* Dynamic Operational Views */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 overflow-y-auto overflow-x-hidden">
          {(currentTab === 'agent_cockpit' || currentTab === 'command_center') && (
            <div className="space-y-8">
              <AutonomousAgentCockpitView
                onTargetsUpdated={syncAllData}
                onNavigateTab={(tab) => setCurrentTab(tab)}
                campaigns={campaigns}
                activeCampaign={activeCampaign}
                onSelectCampaign={(camp) => setActiveCampaign(camp)}
              />
              {currentTab === 'command_center' && (
                <div className="pt-6 border-t border-stone-200">
                  <h3 className="text-xs font-mono font-bold text-stone-500 uppercase tracking-wider mb-4">
                    Underlying System Telemetry & Operational Analytics
                  </h3>
                  <CommandCenterView
                    analytics={analytics}
                    campaign={activeCampaign}
                    settings={settings}
                    logs={logs}
                    onNavigateTab={(tab) => setCurrentTab(tab)}
                    onRunQueue={handleTriggerQueueRun}
                    isProcessingQueue={isProcessingQueue}
                  />
                </div>
              )}
            </div>
          )}

          {currentTab === 'campaigns' && (
            <CampaignsManagerView
              campaigns={campaigns}
              activeCampaign={activeCampaign}
              onSelectCampaign={(camp) => setActiveCampaign(camp)}
              onCampaignCreated={syncAllData}
              onNavigateTab={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'new_campaign' && (
            <NewCampaignView
              onCampaignCreated={syncAllData}
              onNavigateTab={(tab) => setCurrentTab(tab)}
              existingCampaigns={campaigns}
            />
          )}

          {currentTab === 'campaign_workspace' && (
            <CampaignWorkspaceView
              campaign={activeCampaign}
              targets={targets}
              backlinks={backlinks}
              approvals={approvals}
              onNavigateTab={(tab) => setCurrentTab(tab)}
              onRunQueue={handleTriggerQueueRun}
              isProcessingQueue={isProcessingQueue}
            />
          )}

          {currentTab === 'inventory' && (
            <WebsiteInventoryView
              targets={targets}
              onTargetsUpdated={syncAllData}
              onNavigateTab={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'research' && (
            <WebsiteResearchView
              targets={targets}
              onResearchCompleted={syncAllData}
              onNavigateTab={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'accounts' && (
            <AccountManagementView
              accounts={accounts}
              targets={targets}
              onAccountsUpdated={syncAllData}
              onNavigateTab={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'content_studio' && (
            <ContentStudioView
              drafts={drafts}
              targets={targets}
              onDraftsUpdated={syncAllData}
              onNavigateTab={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'publishing_queue' && (
            <PublishingQueueView
              tasks={tasks}
              counts={queueCounts}
              settings={settings}
              onQueueUpdated={syncAllData}
              onNavigateTab={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'verification' && (
            <BacklinkVerificationView
              backlinks={backlinks}
              onVerificationCompleted={syncAllData}
              onNavigateTab={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'competitor_gap' && (
            <CompetitorGapView
              onTargetsUpdated={syncAllData}
              onNavigateTab={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'reports' && (
            <ReportsAnalyticsView
              analytics={analytics}
              backlinks={backlinks}
              targets={targets}
            />
          )}

          {currentTab === 'automation_rules' && (
            <AutomationRulesView
              settings={settings}
              onSettingsUpdated={syncAllData}
            />
          )}

          {currentTab === 'credentials' && (
            <CredentialsIntegrationsView
              settings={settings}
              onSettingsUpdated={syncAllData}
            />
          )}

          {currentTab === 'logs' && (
            <ActivityLogsView
              logs={logs}
              onLogsCleared={syncAllData}
            />
          )}

          {currentTab === 'human_action' && (
            <HumanActionRequiredView
              approvals={approvals}
              onApprovalResolved={syncAllData}
              onNavigateTab={(tab) => setCurrentTab(tab)}
            />
          )}
        </main>
      </div>
    </div>
  )
}
