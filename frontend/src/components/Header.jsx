import React from 'react'

export default function Header({ onNavigate, currentPage }) {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <button 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">TB</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">TicketFlow</h1>
              <p className="text-xs text-slate-400">Concurrency Demo</p>
            </div>
          </button>
          <nav className="flex items-center gap-1">
            <button
              onClick={() => onNavigate('home')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentPage === 'home'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('demo')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentPage === 'demo'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Demo
            </button>
            <button
              onClick={() => onNavigate('learn')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentPage === 'learn'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Learn
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}
