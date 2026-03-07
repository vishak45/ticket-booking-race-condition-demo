import React, { useState } from 'react'
import Header from './components/Header'
import RaceConditionAnimation from './components/RaceConditionAnimation'
import BookingDemo from './components/BookingDemo'
import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage'

const defaultEvent = {
  id: 1,
  name: "Tech Conference 2026",
  date: "2026-03-15",
  location: "Virtual Event",
  totalTickets: 10,
  image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=500&h=300&fit=crop"
}

function App() {
  const [page, setPage] = useState('demo') // 'demo', 'learn', 'login', or 'register'
  const [selectedEvent] = useState(defaultEvent)
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })

  return (
    <div className="min-h-screen bg-slate-950">
      <Header onNavigate={setPage} currentPage={page} user={user} onLogout={() => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
        setPage('demo')
      }} />
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        {page === 'login' && (
          <LoginPage onNavigate={(newPage) => {
            setUser(JSON.parse(localStorage.getItem('user')))
            setPage(newPage)
          }} />
        )}

        {page === 'register' && (
          <RegisterPage onNavigate={(newPage) => {
            const stored = localStorage.getItem('user')
            if (stored) setUser(JSON.parse(stored))
            setPage(newPage)
          }} />
        )}

        {(page === 'demo' || page === 'learn') && (
          <>
            {page === 'demo' && selectedEvent && (
              <div className="max-w-4xl mx-auto">
                <BookingDemo event={selectedEvent} />
              </div>
            )}

            {page === 'learn' && (
              <>
                {/* Detailed Explanation Page */}
                <div className="mb-6">
                  <button
                    onClick={() => setPage('demo')}
                    className="text-slate-400 hover:text-white text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    ← Back to Demo
                  </button>
                </div>
                <RaceConditionAnimation />
              </>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default App