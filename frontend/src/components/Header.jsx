import React from 'react'
import { LogOut, User } from 'lucide-react'

export default function Header({ onNavigate, currentPage, user, onLogout }) {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <button 
            onClick={() => onNavigate('demo')}
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
            {(currentPage === 'demo' || currentPage === 'learn') && (
              <>
                <button
                  onClick={() => onNavigate('demo')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentPage === 'demo'
                      ? 'bg-blue-600 text-white'
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
              </>
            )}
            
            <div className="ml-4 flex items-center gap-2 pl-4 border-l border-slate-700">
              {user ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-lg">
                    <User className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-slate-300">{user.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      onLogout()
                      onNavigate('demo')
                    }}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => onNavigate('login')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      currentPage === 'login'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => onNavigate('register')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      currentPage === 'register'
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
