import React, { useState } from 'react'
import BookingSection from './BookingSection'
import StatsPanel from './StatsPanel'

export default function BookingDemo({ event }) {
  const [vulnerableStats, setVulnerableStats] = useState({
    totalRequests: 0,
    successfulBookings: 0,
    oversold: 0
  })

  const [fixedStats, setFixedStats] = useState({
    totalRequests: 0,
    successfulBookings: 0,
    failedRequests: 0
  })

  const handleVulnerableBook = () => {
    setVulnerableStats(prev => ({
      ...prev,
      totalRequests: prev.totalRequests + 1,
      successfulBookings: prev.successfulBookings + 1,
      oversold: Math.max(0, (prev.successfulBookings + 1) - event.totalTickets)
    }))
  }

  const handleFixedBook = () => {
    const canBook = fixedStats.successfulBookings < event.totalTickets
    setFixedStats(prev => ({
      ...prev,
      totalRequests: prev.totalRequests + 1,
      successfulBookings: canBook ? prev.successfulBookings + 1 : prev.successfulBookings,
      failedRequests: canBook ? prev.failedRequests : prev.failedRequests + 1
    }))
  }

  const handleReset = () => {
    setVulnerableStats({ totalRequests: 0, successfulBookings: 0, oversold: 0 })
    setFixedStats({ totalRequests: 0, successfulBookings: 0, failedRequests: 0 })
  }

  return (
    <div className="space-y-5">
      {/* Main Heading */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">Compare Booking Systems</h2>
        <p className="text-sm text-slate-400">Click "Book Now" in both systems simultaneously to see the race condition</p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Vulnerable System */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <div>
              <p className="text-xs font-semibold text-red-400 uppercase tracking-wider">Vulnerable</p>
              <p className="text-xs text-slate-500">No concurrency control</p>
            </div>
          </div>
          
          <BookingSection
            onBook={handleVulnerableBook}
            stats={vulnerableStats}
            type="vulnerable"
            maxTickets={event.totalTickets}
          />
        </div>

        {/* Fixed System */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div>
              <p className="text-xs font-semibold text-green-400 uppercase tracking-wider">Secure</p>
              <p className="text-xs text-slate-500">Atomic operations</p>
            </div>
          </div>
          
          <BookingSection
            onBook={handleFixedBook}
            stats={fixedStats}
            type="fixed"
            maxTickets={event.totalTickets}
          />
        </div>
      </div>

      {/* Stats Panel */}
      <StatsPanel
        vulnerableStats={vulnerableStats}
        fixedStats={fixedStats}
      />

      {/* Reset Button */}
      <div className="flex justify-center pt-2">
        <button
          onClick={handleReset}
          className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors duration-200 border border-slate-600 hover:border-slate-500"
        >
          Reset Demo
        </button>
      </div>
    </div>
  )
}
