import React, { useState, useEffect, useMemo } from 'react'
import { Play, Pause, RotateCcw, ChevronRight } from 'lucide-react'

export default function RaceConditionAnimation() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [step, setStep] = useState(0)

  const totalSteps = 5
  
  // Compute values based on step (no setState needed)
  const { ticketCount, userAValue, userBValue } = useMemo(() => {
    switch (step) {
      case 0:
        return { ticketCount: 5, userAValue: null, userBValue: null }
      case 1:
        return { ticketCount: 5, userAValue: 5, userBValue: 5 }
      case 2:
        return { ticketCount: 4, userAValue: 4, userBValue: 5 }
      case 3:
        return { ticketCount: 4, userAValue: 4, userBValue: 4 }
      case 4:
      default:
        return { ticketCount: 4, userAValue: 4, userBValue: 4 }
    }
  }, [step])

  const steps = [
    {
      title: "Starting Point",
      description: "We have 5 tickets available. Two users want to buy at the same time.",
      userA: "Waiting...",
      userB: "Waiting...",
    },
    {
      title: "Both Users Check",
      description: "User A and User B both ask: 'How many tickets are left?' They both see 5.",
      userA: "Reads: 5 tickets",
      userB: "Reads: 5 tickets",
    },
    {
      title: "User A Books",
      description: "User A calculates 5 - 1 = 4 and saves it to the database.",
      userA: "Saves: 4",
      userB: "Still has: 5",
    },
    {
      title: "User B Also Books",
      description: "User B still thinks there are 5, so they also calculate 5 - 1 = 4 and save it.",
      userA: "Done ✓",
      userB: "Saves: 4",
    },
    {
      title: "The Problem!",
      description: "Both users got tickets, but the database shows 4 instead of 3. We oversold!",
      userA: "Got ticket ✓",
      userB: "Got ticket ✓",
    },
  ]

  useEffect(() => {
    if (!isPlaying) return

    const timer = setTimeout(() => {
      if (step < totalSteps - 1) {
        setStep(prev => prev + 1)
      } else {
        setIsPlaying(false)
      }
    }, 2500)

    return () => clearTimeout(timer)
  }, [isPlaying, step])

  const handleReset = () => {
    setStep(0)
    setIsPlaying(false)
  }

  const handleStepClick = (newStep) => {
    setStep(newStep)
    setIsPlaying(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
          How Race Conditions Work
        </h1>
        <p className="text-slate-400 text-lg">
          A simple step-by-step explanation
        </p>
      </div>

      {/* Main Animation Area */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 backdrop-blur-sm">
        
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleStepClick(idx)}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${
                idx === step
                  ? 'bg-blue-600 text-white scale-110'
                  : idx < step
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        {/* Current Step Info */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2 transition-all duration-300">
            {steps[step].title}
          </h2>
          <p className="text-slate-300 text-lg max-w-xl mx-auto transition-all duration-300">
            {steps[step].description}
          </p>
        </div>

        {/* Visual Animation */}
        <div className="relative">
          {/* Database */}
          <div className="flex justify-center mb-12">
            <div className={`px-12 py-6 rounded-xl border-2 transition-all duration-500 ${
              step === 4 
                ? 'bg-red-950/50 border-red-500 shadow-lg shadow-red-500/20' 
                : 'bg-blue-950/50 border-blue-500'
            }`}>
              <p className="text-sm text-slate-400 uppercase tracking-wider mb-1">Database</p>
              <div className="flex items-baseline gap-2">
                <span className={`text-5xl font-bold transition-all duration-500 ${
                  step === 4 ? 'text-red-400' : 'text-blue-400'
                }`}>
                  {ticketCount}
                </span>
                <span className="text-slate-300">tickets</span>
              </div>
              {step === 4 && (
                <p className="text-red-400 text-sm mt-2 animate-pulse">
                  Should be 3!
                </p>
              )}
            </div>
          </div>

          {/* Connection Lines */}
          <div className="absolute top-24 left-1/2 -translate-x-1/2 flex gap-32">
            <div className={`w-0.5 h-16 transition-all duration-500 ${
              step >= 1 && step <= 2 ? 'bg-yellow-500' : 'bg-slate-700'
            }`}></div>
            <div className={`w-0.5 h-16 transition-all duration-500 ${
              step >= 1 && (step === 1 || step === 3) ? 'bg-yellow-500' : 'bg-slate-700'
            }`}></div>
          </div>

          {/* Users */}
          <div className="flex justify-center gap-16 md:gap-32 mt-8">
            {/* User A */}
            <div className={`text-center p-6 rounded-xl border-2 transition-all duration-500 min-w-[160px] ${
              step === 2 
                ? 'bg-green-950/50 border-green-500 scale-105 shadow-lg shadow-green-500/20'
                : step >= 1 
                ? 'bg-slate-800/50 border-slate-600' 
                : 'bg-slate-900/50 border-slate-700'
            }`}>
              <div className="text-4xl mb-3">👤</div>
              <p className="font-bold text-white text-lg">User A</p>
              <p className={`text-sm mt-2 h-6 transition-all duration-300 ${
                step === 2 ? 'text-green-400 font-semibold' : 'text-slate-400'
              }`}>
                {steps[step].userA}
              </p>
              {userAValue !== null && step >= 1 && (
                <div className={`mt-3 px-3 py-1 rounded-full text-sm font-medium transition-all duration-500 ${
                  step >= 4 ? 'bg-green-600/30 text-green-300' : 'bg-slate-700 text-slate-300'
                }`}>
                  Memory: {userAValue}
                </div>
              )}
            </div>

            {/* User B */}
            <div className={`text-center p-6 rounded-xl border-2 transition-all duration-500 min-w-[160px] ${
              step === 3 
                ? 'bg-orange-950/50 border-orange-500 scale-105 shadow-lg shadow-orange-500/20'
                : step >= 1 
                ? 'bg-slate-800/50 border-slate-600' 
                : 'bg-slate-900/50 border-slate-700'
            }`}>
              <div className="text-4xl mb-3">👤</div>
              <p className="font-bold text-white text-lg">User B</p>
              <p className={`text-sm mt-2 h-6 transition-all duration-300 ${
                step === 3 ? 'text-orange-400 font-semibold' : 'text-slate-400'
              }`}>
                {steps[step].userB}
              </p>
              {userBValue !== null && step >= 1 && (
                <div className={`mt-3 px-3 py-1 rounded-full text-sm font-medium transition-all duration-500 ${
                  step >= 4 ? 'bg-green-600/30 text-green-300' : 'bg-slate-700 text-slate-300'
                }`}>
                  Memory: {userBValue}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Problem Explanation */}
        {step === 4 && (
          <div className="mt-8 bg-red-950/30 border border-red-600/50 rounded-xl p-6">
            <h3 className="text-red-400 font-bold text-lg mb-2">🚨 This is the Race Condition!</h3>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-red-400">•</span>
                <span>Both users read the <strong>same value (5)</strong> at the same time</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">•</span>
                <span>Both calculated <strong>5 - 1 = 4</strong> independently</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">•</span>
                <span>User B&apos;s write <strong>overwrote</strong> User A&apos;s update</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">•</span>
                <span>Result: <strong>1 ticket sale was lost!</strong></span>
              </li>
            </ul>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={step === totalSteps - 1 && !isPlaying}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              step === totalSteps - 1 && !isPlaying
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            {isPlaying ? 'Pause' : step === totalSteps - 1 ? 'Finished' : 'Play'}
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-all"
          >
            <RotateCcw size={18} />
            Start Over
          </button>
        </div>
      </div>

      {/* Simple Explanation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-red-950/20 border border-red-600/30 rounded-xl p-6">
          <h3 className="text-red-400 font-bold text-lg mb-3">❌ The Problem</h3>
          <p className="text-slate-300 leading-relaxed">
            When two users check and update at the same time, the second user&apos;s update 
            <strong className="text-red-400"> overwrites </strong> 
            the first one because they both started with the same number.
          </p>
          <div className="mt-4 bg-red-950/40 rounded-lg p-3 font-mono text-sm text-slate-300">
            <p className="text-slate-500">// Bad way:</p>
            <p>tickets = getTickets(); <span className="text-slate-500">// 5</span></p>
            <p>tickets = tickets - 1;</p>
            <p>saveTickets(tickets);</p>
          </div>
        </div>

        <div className="bg-green-950/20 border border-green-600/30 rounded-xl p-6">
          <h3 className="text-green-400 font-bold text-lg mb-3">✅ The Solution</h3>
          <p className="text-slate-300 leading-relaxed">
            Use <strong className="text-green-400">atomic operations</strong> that check and update 
            in one step. The database handles the locking automatically.
          </p>
          <div className="mt-4 bg-green-950/40 rounded-lg p-3 font-mono text-sm text-slate-300">
            <p className="text-slate-500">// Good way:</p>
            <p>db.update(</p>
            <p className="pl-4">{`{ tickets > 0 },`}</p>
            <p className="pl-4">{`{ tickets: tickets - 1 }`}</p>
            <p>);</p>
          </div>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="bg-blue-950/20 border border-blue-600/30 rounded-xl p-6">
        <h3 className="text-blue-400 font-bold text-lg mb-4">💡 Remember</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">1</span>
            <p className="text-slate-300 text-sm">Race conditions happen when multiple users access the same data simultaneously</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">2</span>
            <p className="text-slate-300 text-sm">Reading and writing separately creates a gap where things can go wrong</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">3</span>
            <p className="text-slate-300 text-sm">Atomic operations combine read + check + write into one unbreakable action</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center py-6">
        <p className="text-slate-400 mb-4">Ready to see it in action?</p>
        <button
          onClick={() => window.scrollTo(0, 0)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all"
        >
          Try the Interactive Demo
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}
