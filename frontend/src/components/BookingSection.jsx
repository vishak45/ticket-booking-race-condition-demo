import React, { useState } from 'react'

export default function BookingSection({ onBook, stats, type, maxTickets }) {
  const [isLoading, setIsLoading] = useState(false)
  const isVulnerable = type === 'vulnerable'
  const ticketsBooked = stats.successfulBookings
  const ticketsRemaining = maxTickets - ticketsBooked
  const percentBooked = Math.min((ticketsBooked / maxTickets) * 100, 100)

  const buttonDisabled = !isVulnerable && ticketsRemaining <= 0

  const handleClick = () => {
    setIsLoading(true)
    setTimeout(() => {
      onBook()
      setIsLoading(false)
    }, 200)
  }

  return (
    <div className={`rounded-lg p-5 border transition-all duration-300 ${
      isVulnerable
        ? 'bg-red-950/30 border-red-700/30 hover:border-red-700/50'
        : 'bg-green-950/30 border-green-700/30 hover:border-green-700/50'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className={`text-sm font-semibold ${
            isVulnerable ? 'text-red-300' : 'text-green-300'
          }`}>
            {isVulnerable ? '🔴 Vulnerable' : '🟢 Secure'}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {isVulnerable ? 'Race condition' : 'Atomic operation'}
          </p>
        </div>
        <span className={`text-2xl font-bold ${
          isVulnerable ? 'text-red-400' : 'text-green-400'
        }`}>
          {ticketsBooked}
        </span>
      </div>

      {/* Progress Bar with Animation */}
      <div className="mb-3">
        <div className="w-full bg-slate-900/50 rounded-full h-2 overflow-hidden border border-slate-700/50">
          <div
            className={`h-full transition-all duration-500 ease-out ${
              isVulnerable ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-green-500 to-green-600'
            }`}
            style={{ width: `${percentBooked}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-slate-400">
          <span>{ticketsRemaining} left</span>
          <span>{Math.round(percentBooked)}%</span>
        </div>
      </div>

      {/* Oversold Alert */}
      {isVulnerable && stats.oversold > 0 && (
        <div className="bg-red-900/40 border border-red-700/50 rounded px-3 py-2 mb-3 animate-pulse">
          <p className="text-red-300 text-xs font-semibold">⚠️ Oversold by {stats.oversold}</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-slate-800/40 rounded px-3 py-2 border border-slate-700/30">
          <p className="text-slate-400 text-xs">Requests</p>
          <p className="text-lg font-bold text-white">{stats.totalRequests}</p>
        </div>
        <div className={`rounded px-3 py-2 border ${
          isVulnerable
            ? 'bg-red-900/30 border-red-700/30'
            : 'bg-green-900/30 border-green-700/30'
        }`}>
          <p className={`text-xs ${
            isVulnerable ? 'text-red-300' : 'text-green-300'
          }`}>Success</p>
          <p className={`text-lg font-bold ${
            isVulnerable ? 'text-red-400' : 'text-green-400'
          }`}>{stats.successfulBookings}</p>
        </div>
      </div>

      {/* Book Button */}
      <button
        onClick={handleClick}
        disabled={buttonDisabled || isLoading}
        className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
          buttonDisabled
            ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
            : isVulnerable
            ? 'bg-red-600 hover:bg-red-700 text-white active:scale-95 shadow-lg hover:shadow-red-900/50'
            : 'bg-green-600 hover:bg-green-700 text-white active:scale-95 shadow-lg hover:shadow-green-900/50'
        }`}
      >
        {isLoading ? '⏳' : buttonDisabled ? 'Sold Out' : 'Book Now'}
      </button>
    </div>
  )
}
