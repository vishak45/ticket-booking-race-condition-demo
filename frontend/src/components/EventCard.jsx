import React from 'react'
import { Clock, MapPin, Ticket } from 'lucide-react'

export default function EventCard({ event }) {
  return (
    <div className="sticky top-20 bg-slate-800/50 backdrop-blur-sm rounded-lg overflow-hidden border border-slate-700 h-fit">
      {/* Event Image */}
      <div className="relative w-full h-48 overflow-hidden group">
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
      </div>

      {/* Event Info */}
      <div className="p-4">
        <h2 className="text-lg font-bold text-white mb-4 line-clamp-2">{event.name}</h2>

        <div className="space-y-3 text-sm">
          {/* Date */}
          <div className="flex items-start gap-3">
            <Clock size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-slate-400 text-xs">Date</p>
              <p className="text-white font-medium">
                {new Date(event.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: '2-digit'
                })}
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-3">
            <MapPin size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-slate-400 text-xs">Location</p>
              <p className="text-white font-medium truncate">{event.location}</p>
            </div>
          </div>

          {/* Tickets */}
          <div className="flex items-start gap-3">
            <Ticket size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-slate-400 text-xs">Available</p>
              <p className="text-white font-medium">{event.totalTickets} Tickets</p>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="mt-4 pt-4 border-t border-slate-700">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-xs">Price</span>
            <span className="text-xl font-bold text-green-400">₹100</span>
          </div>
        </div>
      </div>
    </div>
  )
}
