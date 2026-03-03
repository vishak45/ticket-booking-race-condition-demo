import React, { useState } from 'react'
import { Server, Users, Zap, RefreshCw } from 'lucide-react'
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
    <div className="space-y-5">
      {/* API Testing Banner */}
      <div className="bg-gradient-to-r from-blue-950/50 to-purple-950/50 border border-blue-500/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Server size={20} className="text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-blue-400 font-semibold text-sm">Real API Testing Mode</h3>
            <p className="text-slate-400 text-xs mt-1">
              Testing is performed via actual API endpoints. The backend handles race condition logic using MongoDB atomic operations vs vulnerable read-modify-write patterns.
            </p>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-slate-500">Backend: Pending</span>
              </div>
              <div className="text-xs text-slate-600">|</div>
              <span className="text-xs text-slate-500">POST /api/book/vulnerable</span>
              <span className="text-xs text-slate-500">POST /api/book/secure</span>
            </div>
          </div>
        </div>
      </div>

      {/* Concurrent Users Simulation */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Users size={20} className="text-purple-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">Simulate Concurrent Users</h3>
              <p className="text-slate-400 text-xs">Send multiple booking requests simultaneously</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-900 rounded-lg px-3 py-2">
              <button 
                onClick={() => setConcurrentUsers(prev => Math.max(1, prev - 1))}
                className="text-slate-400 hover:text-white transition-colors"
              >
                −
              </button>
              <span className="text-white font-mono w-8 text-center">{concurrentUsers}</span>
              <button 
                onClick={() => setConcurrentUsers(prev => Math.min(20, prev + 1))}
                className="text-slate-400 hover:text-white transition-colors"
              >
                +
              </button>
            </div>
            <span className="text-xs text-slate-500">users</span>
            
            <button
              onClick={handleSimulateConcurrent}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white text-sm font-medium rounded-lg transition-all"
            >
              {isLoading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Zap size={16} />
                  Fire Requests
                </>
              )}
            </button>
          </div>
        </div>
      </div>

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

      {/* Reset Controls */}
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-slate-400">
            <span className="text-slate-500">Available Tickets:</span>{' '}
            <span className="font-mono text-white">{event.totalTickets}</span>
            <span className="text-slate-600 mx-2">|</span>
            <span className="text-slate-500">Ticket Price:</span>{' '}
            <span className="font-mono text-green-400">₹{event.price}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors duration-200 border border-slate-600 hover:border-slate-500"
            >
              Reset Stats
            </button>
            <button
              onClick={() => {
                // TODO: Call API to reset database tickets
                handleReset()
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
            >
              Reset Database
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
