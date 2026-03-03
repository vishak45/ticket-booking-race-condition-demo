import React from 'react'
import { AlertTriangle, TrendingDown, Lock, Zap } from 'lucide-react'

export default function RaceConditionInfo({ onLearnMore }) {
  return (
    <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-lg p-6 mb-8">
      {/* Title */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Understanding Race Conditions</h2>
        <p className="text-slate-400 text-sm">A critical concurrency challenge in high-traffic systems</p>
      </div>

      {/* What is Race Condition */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Definition */}
        <div className="bg-slate-900/40 border border-slate-700/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-white mb-2">What is a Race Condition?</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                A race condition occurs when multiple processes/threads access shared resources simultaneously, and the final outcome depends on their timing. Without proper synchronization, unexpected results occur when operations overlap.
              </p>
            </div>
          </div>
        </div>

        {/* Real World Example */}
        <div className="bg-slate-900/40 border border-slate-700/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <TrendingDown size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-white mb-2">Real World Example: Flight Booking</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Two users simultaneously book the last available seat. Both see 1 ticket available. Both click "Book". Without atomic operations, the airline oversells the flight by 1 seat, causing customer disputes and lost revenue.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* The Problem Flow */}
      <div className="bg-slate-900/40 border border-red-600/20 rounded-lg p-4 mb-6">
        <h3 className="font-bold text-red-400 mb-3 flex items-center gap-2">
          <Zap size={18} />
          The Race Condition Timeline
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-3">
            <span className="bg-red-600/30 text-red-300 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">1</span>
            <div>
              <p className="text-white font-medium">User A & B both check availability</p>
              <p className="text-slate-400 text-xs">Database shows: 5 tickets available</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="bg-red-600/30 text-red-300 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">2</span>
            <div>
              <p className="text-white font-medium">Both proceed to purchase</p>
              <p className="text-slate-400 text-xs">Both believe they're buying valid tickets</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="bg-red-600/30 text-red-300 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">3</span>
            <div>
              <p className="text-white font-medium">Both update inventory separate instances</p>
              <p className="text-slate-400 text-xs">A: 5 → 4, B: 5 → 4 (same value)</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="bg-red-600/30 text-red-300 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">⚠️</span>
            <div>
              <p className="text-white font-medium">Result: Oversold by 1 ticket</p>
              <p className="text-slate-400 text-xs">Database should show 3, but shows 4</p>
            </div>
          </div>
        </div>
      </div>

      {/* The Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-red-950/20 border border-red-600/30 rounded-lg p-4">
          <h3 className="font-bold text-red-400 mb-2">❌ Vulnerable Approach</h3>
          <code className="text-xs text-slate-300 block bg-red-950/40 p-2 rounded border border-red-700/30">
            {`if (tickets > 0) {
  tickets = tickets - 1;
  saveDB(tickets);
}`}
          </code>
          <p className="text-xs text-slate-400 mt-2">Each read-check-write is separate → Race condition!</p>
        </div>

        <div className="bg-green-950/20 border border-green-600/30 rounded-lg p-4">
          <h3 className="font-bold text-green-400 mb-2">✅ Secure Approach</h3>
          <code className="text-xs text-slate-300 block bg-green-950/40 p-2 rounded border border-green-700/30">
            {`db.update(
  { tickets: { $gt: 0 } },
  { $inc: { tickets: -1 } }
);`}
          </code>
          <p className="text-xs text-slate-400 mt-2">Atomic operation → No race condition!</p>
        </div>
      </div>

      {/* Demo Instructions */}
      <div className="space-y-3">
        <div className="bg-blue-950/30 border border-blue-600/30 rounded-lg p-4 flex items-start gap-3">
          <Lock size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-blue-300 mb-1">How This Demo Works</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Below, you'll see two booking systems side-by-side. The <strong>Vulnerable system</strong> (left) demonstrates the race condition by allowing unlimited overbooking when multiple clicks happen simultaneously. The <strong>Secure system</strong> (right) uses atomic operations to prevent any overbooking. Try clicking "Book Now" rapidly in both panels to see the difference. Open this in multiple browser tabs and coordinate clicks to see real concurrent behavior!
            </p>
          </div>
        </div>

        <button
          onClick={onLearnMore}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          📚 Learn More with Animated Timeline
        </button>
      </div>
    </div>
  )
}
