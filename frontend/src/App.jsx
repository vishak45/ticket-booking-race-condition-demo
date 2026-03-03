import React, { useState } from 'react'
import Header from './components/Header'
import HomePage from './components/HomePage'
import RaceConditionAnimation from './components/RaceConditionAnimation'
import EventCard from './components/EventCard'
import BookingDemo from './components/BookingDemo'

const defaultEvent = {
  id: 1,
  name: "Tech Conference 2026",
  date: "2026-03-15",
  location: "Virtual Event",
  totalTickets: 10,
  image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=500&h=300&fit=crop"
}

function App() {
  const [page, setPage] = useState('home') // 'home', 'demo', or 'learn'
  const [selectedEvent] = useState(defaultEvent)

  return (
    <div className="min-h-screen bg-slate-950">
      <Header onNavigate={setPage} currentPage={page} />
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        {page === 'home' && (
          <HomePage onNavigate={setPage} />
        )}

        {page === 'demo' && selectedEvent && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Event Details - Compact */}
              <div className="xl:col-span-1">
                <EventCard event={selectedEvent} />
              </div>

              {/* Booking Demo - Main */}
              <div className="xl:col-span-3">
                <BookingDemo event={selectedEvent} />
              </div>
            </div>
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
      </main>
    </div>
  )
}

export default App