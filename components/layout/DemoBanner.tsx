'use client'

import React from 'react'
import { ShieldCheck, Info, CheckCircle2 } from 'lucide-react'

export const DemoBanner: React.FC = () => {
  return (
    <div className="bg-emerald-50 text-emerald-950 px-4 py-2 text-xs sm:text-sm border-b border-emerald-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2.5 flex-1 min-w-[280px]">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
        </span>
        <div className="flex items-center gap-1.5 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-emerald-900 font-bold">Safe Mode Active:</span>
          <span className="text-emerald-800 hidden sm:inline">
            Human approval gate enabled. Real verified outreach with zero automated mass spam.
          </span>
          <span className="text-emerald-800 sm:hidden">
            Human approval enabled.
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white text-emerald-800 border border-emerald-200 text-xs font-semibold shadow-2xs">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> 1-Click Auto-Pilot
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200 text-xs font-medium shadow-2xs">
          <Info className="w-3 h-3 text-slate-400" /> CAN-SPAM Compliant
        </span>
      </div>
    </div>
  )
}
