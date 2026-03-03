import React, { useState, useEffect } from 'react'
import { ArrowRight, Zap, Shield, Users, AlertTriangle, TrendingUp, BookOpen } from 'lucide-react'

export default function HomePage({ onNavigate }) {
  const [animatedNumber, setAnimatedNumber] = useState(5)
  const [userAState, setUserAState] = useState('idle')
  const [userBState, setUserBState] = useState('idle')
  const [showProblem, setShowProblem] = useState(false)

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  // Hero animation - demonstrates race condition visually
  useEffect(() => {
    const sequence = async () => {
      // Reset
      setAnimatedNumber(5)
      setUserAState('idle')
      setUserBState('idle')
      setShowProblem(false)

      await sleep(1500)
      
      // Both users read
      setUserAState('reading')
      setUserBState('reading')
      await sleep(1200)

      // Both users book
      setUserAState('booking')
      setUserBState('booking')
      await sleep(800)

      // User A writes
      setUserAState('success')
      setAnimatedNumber(4)
      await sleep(400)

      // User B also writes (race condition!)
      setUserBState('success')
      await sleep(600)

      // Show problem
      setShowProblem(true)
      await sleep(3000)
    }

    sequence()
    const interval = setInterval(sequence, 8000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-40 right-20 w-64 h-64 bg-red-600/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left - Text Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-300 text-sm">
              <Zap size={14} />
              Interactive Concurrency Demo
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Understanding{' '}
              <span className="bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                Race Conditions
              </span>
            </h1>

            <p className="text-lg text-slate-300 leading-relaxed max-w-xl">
              Explore how concurrent requests can cause overselling in booking systems. 
              Watch the problem unfold in real-time and learn how to fix it with atomic operations.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={() => onNavigate('demo')}
                className="group px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center gap-2"
              >
                Try the Demo
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => onNavigate('learn')}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors border border-slate-600 flex items-center gap-2"
              >
                <BookOpen size={18} />
                Learn How It Works
              </button>
            </div>
          </div>

          {/* Right - Animated Visualization */}
          <div className="relative bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
            <div className="absolute -top-3 left-6 px-3 py-1 bg-slate-700 rounded-full text-xs text-slate-300">
              Live Race Condition Demo
            </div>

            {/* Database */}
            <div className="mb-8 text-center">
              <div className="inline-block bg-blue-950/40 border border-blue-600/30 rounded-lg px-8 py-4">
                <p className="text-xs text-blue-300 uppercase tracking-wider mb-1">Database</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-4xl font-bold text-blue-400 transition-all duration-300">
                    {animatedNumber}
                  </span>
                  <span className="text-blue-300">tickets</span>
                </div>
              </div>
            </div>

            {/* Users */}
            <div className="grid grid-cols-2 gap-6">
              {/* User A */}
              <div className={`relative bg-slate-900/50 border rounded-lg p-4 transition-all duration-300 ${
                userAState === 'reading' ? 'border-yellow-500 shadow-yellow-500/20 shadow-lg' :
                userAState === 'booking' ? 'border-orange-500 shadow-orange-500/20 shadow-lg' :
                userAState === 'success' ? 'border-green-500 shadow-green-500/20 shadow-lg' :
                'border-slate-700'
              }`}>
                <div className="text-4xl mb-2">👤</div>
                <p className="font-bold text-white">User A</p>
                <p className={`text-xs mt-1 ${
                  userAState === 'idle' ? 'text-slate-400' :
                  userAState === 'reading' ? 'text-yellow-400' :
                  userAState === 'booking' ? 'text-orange-400' :
                  'text-green-400'
                }`}>
                  {userAState === 'idle' && 'Waiting...'}
                  {userAState === 'reading' && 'Reading: 5 tickets'}
                  {userAState === 'booking' && 'Booking...'}
                  {userAState === 'success' && '✓ Booked!'}
                </p>

                {/* Connection Line */}
                {(userAState === 'reading' || userAState === 'booking') && (
                  <div className="absolute -top-8 left-1/2 w-0.5 h-8 bg-gradient-to-t from-yellow-500 to-transparent animate-pulse"></div>
                )}
              </div>

              {/* User B */}
              <div className={`relative bg-slate-900/50 border rounded-lg p-4 transition-all duration-300 ${
                userBState === 'reading' ? 'border-yellow-500 shadow-yellow-500/20 shadow-lg' :
                userBState === 'booking' ? 'border-orange-500 shadow-orange-500/20 shadow-lg' :
                userBState === 'success' ? 'border-green-500 shadow-green-500/20 shadow-lg' :
                'border-slate-700'
              }`}>
                <div className="text-4xl mb-2">👤</div>
                <p className="font-bold text-white">User B</p>
                <p className={`text-xs mt-1 ${
                  userBState === 'idle' ? 'text-slate-400' :
                  userBState === 'reading' ? 'text-yellow-400' :
                  userBState === 'booking' ? 'text-orange-400' :
                  'text-green-400'
                }`}>
                  {userBState === 'idle' && 'Waiting...'}
                  {userBState === 'reading' && 'Reading: 5 tickets'}
                  {userBState === 'booking' && 'Booking...'}
                  {userBState === 'success' && '✓ Booked!'}
                </p>

                {/* Connection Line */}
                {(userBState === 'reading' || userBState === 'booking') && (
                  <div className="absolute -top-8 left-1/2 w-0.5 h-8 bg-gradient-to-t from-yellow-500 to-transparent animate-pulse"></div>
                )}
              </div>
            </div>

            {/* Problem Alert */}
            {showProblem && (
              <div className="mt-6 bg-red-950/50 border border-red-600/50 rounded-lg p-4 animate-pulse">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="text-red-500 flex-shrink-0" size={20} />
                  <div>
                    <p className="font-bold text-red-300">Race Condition Detected!</p>
                    <p className="text-xs text-red-400 mt-1">
                      Both users booked successfully, but only 1 ticket was decremented. 
                      Expected: 3 tickets, Actual: 4 tickets
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">What You'll Learn</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            This interactive demo teaches you about concurrency issues that plague high-traffic systems
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<AlertTriangle className="text-red-400" />}
            title="The Problem"
            description="See how race conditions cause overselling when multiple users book simultaneously without proper controls."
            color="red"
          />
          <FeatureCard
            icon={<Shield className="text-green-400" />}
            title="The Solution"
            description="Learn how atomic database operations and locking prevent concurrent access issues."
            color="green"
          />
          <FeatureCard
            icon={<TrendingUp className="text-blue-400" />}
            title="Real Impact"
            description="Understand the business impact: lost revenue, customer disputes, and system failures."
            color="blue"
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12">
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <StatCard number="89%" label="of high-traffic sites face concurrency issues" />
            <StatCard number="$2.1M" label="average cost of overselling incidents" />
            <StatCard number="1ms" label="window can cause race conditions" />
            <StatCard number="100%" label="preventable with atomic operations" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 text-center">
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-12">
          <Users className="mx-auto text-blue-400 mb-4" size={48} />
          <h2 className="text-3xl font-bold text-white mb-4">Ready to See It In Action?</h2>
          <p className="text-slate-300 mb-8 max-w-xl mx-auto">
            Open the demo in two browser windows and click simultaneously to experience a real race condition scenario.
          </p>
          <button
            onClick={() => onNavigate('demo')}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg rounded-lg transition-all duration-200 flex items-center gap-3 mx-auto"
          >
            Start the Demo
            <ArrowRight size={20} />
          </button>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, description, color }) {
  const borderColor = color === 'red' ? 'border-red-600/30 hover:border-red-600/50' :
                      color === 'green' ? 'border-green-600/30 hover:border-green-600/50' :
                      'border-blue-600/30 hover:border-blue-600/50'
  
  const bgColor = color === 'red' ? 'bg-red-950/20' :
                  color === 'green' ? 'bg-green-950/20' :
                  'bg-blue-950/20'

  return (
    <div className={`${bgColor} border ${borderColor} rounded-xl p-6 transition-all duration-300 hover:scale-105`}>
      <div className="w-12 h-12 bg-slate-800/50 rounded-lg flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  )
}

function StatCard({ number, label }) {
  return (
    <div>
      <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        {number}
      </p>
      <p className="text-slate-400 text-sm mt-2">{label}</p>
    </div>
  )
}
