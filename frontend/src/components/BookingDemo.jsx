import React, { useState, useEffect, useCallback } from 'react'
import { Zap, RefreshCw } from 'lucide-react'
import BookingSection from './BookingSection'

const API_URL = 'http://localhost:5000'

export default function BookingDemo({ event }) {
  const [eventId, setEventId] = useState(null)
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
  const [isInitializing, setIsInitializing] = useState(true)

  const initializeEvent = useCallback(async () => {
    setIsInitializing(true)
    try {
      const res = await fetch(`${API_URL}/api/init`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: event.name,
          date: event.date,
          totalSeats: event.totalTickets
        })
      })
      const data = await res.json()
      if (data.success) {
        setEventId(data.eventId)
      }
    } catch (error) {
      console.error('Failed to initialize event:', error)
    }
    setIsInitializing(false)
  }, [event.name, event.date, event.totalTickets])

  // Initialize event with seats on mount
  useEffect(() => {
    initializeEvent()
  }, [initializeEvent])

  const handleVulnerableBook = async () => {
    if (!eventId) return
    
    setVulnerableStats(prev => ({ ...prev, totalRequests: prev.totalRequests + 1 }))
    
    try {
      const res = await fetch(`${API_URL}/api/book/vulnerable`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId })
      })
      const data = await res.json()
      
      if (data.success) {
        setVulnerableStats(prev => ({
          ...prev,
          successfulBookings: prev.successfulBookings + 1,
          oversold: Math.max(0, (prev.successfulBookings + 1) - event.totalTickets)
        }))
      }
    } catch (error) {
      console.error('Vulnerable booking error:', error)
    }
  }

  const handleFixedBook = async () => {
    if (!eventId) return
    
    setFixedStats(prev => ({ ...prev, totalRequests: prev.totalRequests + 1 }))
    
    try {
      const res = await fetch(`${API_URL}/api/book/secure`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId })
      })
      const data = await res.json()
      
      if (data.success) {
        setFixedStats(prev => ({
          ...prev,
          successfulBookings: prev.successfulBookings + 1
        }))
      } else {
        setFixedStats(prev => ({
          ...prev,
          failedRequests: prev.failedRequests + 1
        }))
      }
    } catch (error) {
      console.error('Secure booking error:', error)
    }
  }

  const handleSimulateConcurrent = async () => {
    if (!eventId) return
    setIsLoading(true)
    
    // Fire all requests concurrently (both vulnerable and secure)
    const vulnerablePromises = Array(concurrentUsers).fill().map(() => handleVulnerableBook())
    const securePromises = Array(concurrentUsers).fill().map(() => handleFixedBook())
    
    await Promise.all([...vulnerablePromises, ...securePromises])
    setIsLoading(false)
  }

  const handleReset = async () => {
    setVulnerableStats({ totalRequests: 0, successfulBookings: 0, oversold: 0 })
    setFixedStats({ totalRequests: 0, successfulBookings: 0, failedRequests: 0 })
    
    // Create a new event to reset seats
    await initializeEvent()
  }

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw size={24} className="animate-spin text-slate-400" />
        <span className="ml-2 text-slate-400">Initializing demo...</span>
      </div>
    )
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
