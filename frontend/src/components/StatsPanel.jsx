import React from 'react'
import { AlertTriangle, Shield, Zap, Lock } from 'lucide-react'

export default function StatsPanel({ vulnerableStats, fixedStats }) {
  const oversoldAmount = Math.max(0, vulnerableStats.oversold)

  return (
    <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-5">
      <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Live Analytics</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Volatile - Oversold */}
        <div className="bg-red-950/40 border border-red-700/30 rounded px-4 py-3 hover:border-red-700/50 transition-colors">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={14} className="text-red-500 flex-shrink-0" />
            <p className="text-xs text-red-300 font-medium">Oversold</p>
          </div>
          <p className="text-2xl font-bold text-red-400">{oversoldAmount}</p>
          <p className="text-xs text-red-400/70 mt-1">Lost items</p>
        </div>

        {/* Secure - Failed */}
        <div className="bg-green-950/40 border border-green-700/30 rounded px-4 py-3 hover:border-green-700/50 transition-colors">
          <div className="flex items-center gap-2 mb-1">
            <Shield size={14} className="text-green-500 flex-shrink-0" />
            <p className="text-xs text-green-300 font-medium">Rejected</p>
          </div>
          <p className="text-2xl font-bold text-green-400">{fixedStats.failedRequests}</p>
          <p className="text-xs text-green-400/70 mt-1">Controlled</p>
        </div>

        {/* Vulnerable UR */}
        <div className="bg-yellow-950/40 border border-yellow-700/30 rounded px-4 py-3 hover:border-yellow-700/50 transition-colors">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={14} className="text-yellow-500 flex-shrink-0" />
            <p className="text-xs text-yellow-300 font-medium">Requests</p>
          </div>
          <p className="text-2xl font-bold text-yellow-400">{vulnerableStats.totalRequests}</p>
          <p className="text-xs text-yellow-400/70 mt-1">Vulnerable</p>
        </div>

        {/* Secure UR */}
        <div className="bg-blue-950/40 border border-blue-700/30 rounded px-4 py-3 hover:border-blue-700/50 transition-colors">
          <div className="flex items-center gap-2 mb-1">
            <Lock size={14} className="text-blue-500 flex-shrink-0" />
            <p className="text-xs text-blue-300 font-medium">Requests</p>
          </div>
          <p className="text-2xl font-bold text-blue-400">{fixedStats.totalRequests}</p>
          <p className="text-xs text-blue-400/70 mt-1">Secure</p>
        </div>
      </div>

      {/* Insights */}
      {(vulnerableStats.totalRequests > 0 || fixedStats.totalRequests > 0) && (
        <div className="mt-4 pt-4 border-t border-slate-700/50">
          <p className="text-xs text-slate-400 mb-2">Race Condition Detected:</p>
          <div className="text-xs text-slate-300 leading-relaxed">
            <p>
              <strong className="text-red-400">Vulnerable:</strong> Allows {oversoldAmount > 0 ? oversoldAmount + ' overbookings' : 'potential overselling'} due to concurrent read-check-write
            </p>
            <p className="mt-1">
              <strong className="text-green-400">Secure:</strong> Prevents all issues with atomic database operations & locks
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
