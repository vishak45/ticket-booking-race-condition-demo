import React, { useState } from 'react'
import { Zap, RefreshCw } from 'lucide-react'
import BookingSection from './BookingSection'

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

  const [concurrentUsers, setConcurrentUsers] = useState(5)
  const [isLoading, setIsLoading] = useState(false)

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

  const handleSimulateConcurrent = async () => {
    setIsLoading(true)
    // TODO: Replace with actual API calls
    // This will send concurrent requests to both endpoints
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Simulate results for now
    for (let i = 0; i < concurrentUsers; i++) {
      handleVulnerableBook()
      handleFixedBook()
    }
    setIsLoading(false)
  }

  const handleReset = () => {
    setVulnerableStats({ totalRequests: 0, successfulBookings: 0, oversold: 0 })
    setFixedStats({ totalRequests: 0, successfulBookings: 0, failedRequests: 0 })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Race Condition Demo</h2>
        <p className="text-slate-400">Book tickets in both systems to see how race conditions cause overselling</p>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-center gap-4 bg-slate-800/50 border border-slate-700 rounded-xl p-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">Concurrent users:</span>
          <div className="flex items-center gap-1 bg-slate-900 rounded-lg px-2 py-1">
            <button 
              onClick={() => setConcurrentUsers(prev => Math.max(1, prev - 1))}
              className="w-6 h-6 text-slate-400 hover:text-white transition-colors"
            >
              −
            </button>
            <span className="text-white font-mono w-6 text-center">{concurrentUsers}</span>
            <button 
              onClick={() => setConcurrentUsers(prev => Math.min(20, prev + 1))}
              className="w-6 h-6 text-slate-400 hover:text-white transition-colors"
            >
              +
            </button>
          </div>
        </div>
        
        <button
          onClick={handleSimulateConcurrent}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white text-sm font-medium rounded-lg transition-all"
        >
          {isLoading ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              Simulating...
            </>
          ) : (
            <>
              <Zap size={16} />
              Simulate
            </>
          )}
        </button>

        <button
          onClick={handleReset}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors border border-slate-600"
        >
          Reset
        </button>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vulnerable System */}
        <BookingSection
          onBook={handleVulnerableBook}
          stats={vulnerableStats}
          type="vulnerable"
          maxTickets={event.totalTickets}
        />

        {/* Fixed System */}
        <BookingSection
          onBook={handleFixedBook}
          stats={fixedStats}
          type="fixed"
          maxTickets={event.totalTickets}
        />
      </div>

      {/* Event Info */}
      <div className="flex items-center justify-center gap-6 text-sm text-slate-400">
        <span><span className="text-slate-500">Event:</span> {event.name}</span>
        <span><span className="text-slate-500">Tickets:</span> {event.totalTickets}</span>
      </div>
    </div>
  )
}
