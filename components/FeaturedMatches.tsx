'use client'

import React, { useState, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import MatchCard, { Match } from './MatchCard'

export default function FeaturedMatches() {
  const [selectedDate, setSelectedDate] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const dates = [
    { day: 'LUN', date: '28', month: 'OCT' },
    { day: 'MAR', date: '29', month: 'OCT' },
    { day: 'MIE', date: '30', month: 'OCT' },
    { day: 'JUE', date: '31', month: 'OCT' },
    { day: 'VIE', date: '1', month: 'NOV' },
    { day: 'SAB', date: '2', month: 'NOV' },
    { day: 'DOM', date: '3', month: 'NOV' },
  ]

  // Sample matches data
  const matches: Match[] = [
    {
      id: 1,
      homeTeam: 'Real Madrid',
      awayTeam: 'Barcelona',
      homeScore: 2,
      awayScore: 1,
      time: '45\' - Segundo tiempo',
      competition: 'LaLiga',
      status: 'live',
    },
    {
      id: 2,
      homeTeam: 'Manchester United',
      awayTeam: 'Liverpool',
      time: '20:00',
      competition: 'Premier League',
      status: 'scheduled',
    },
    {
      id: 3,
      homeTeam: 'Bayern Munich',
      awayTeam: 'Dortmund',
      homeScore: 3,
      awayScore: 2,
      time: 'Finalizado',
      competition: 'Bundesliga',
      status: 'finished',
    },
    {
      id: 4,
      homeTeam: 'PSG',
      awayTeam: 'Marsella',
      time: '21:45',
      competition: 'Ligue 1',
      status: 'scheduled',
    },
    {
      id: 5,
      homeTeam: 'Juventus',
      awayTeam: 'Inter',
      homeScore: 1,
      awayScore: 1,
      time: '60\' - Segundo tiempo',
      competition: 'Serie A',
      status: 'live',
    },
    {
      id: 6,
      homeTeam: 'Atletico Madrid',
      awayTeam: 'Sevilla',
      time: '18:30',
      competition: 'LaLiga',
      status: 'scheduled',
    },
  ]

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Date Navigation */}
      <div className="relative mb-8">
        <div className="flex items-center">
          <button
            onClick={scrollLeft}
            className="absolute left-0 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="text-gray-700" size={24} />
          </button>

          <div
            ref={scrollRef}
            className="flex overflow-x-auto scrollbar-hide space-x-3 px-12 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {dates.map((date, index) => (
              <button
                key={index}
                onClick={() => setSelectedDate(index)}
                className={`flex-shrink-0 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  selectedDate === index
                    ? 'bg-black text-white shadow-lg scale-105'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-xs mb-1">{date.day}</div>
                  <div className="text-2xl font-bold">{date.date}</div>
                  <div className="text-xs mt-1">{date.month}</div>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={scrollRight}
            className="absolute right-0 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="text-gray-700" size={24} />
          </button>
        </div>
      </div>

      {/* Matches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>

      {/* Load More Button */}
      <div className="text-center mt-8">
        <button className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors shadow-lg">
          Ver más partidos
        </button>
      </div>
    </div>
  )
}
