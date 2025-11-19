'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import MatchCard from './MatchCard'
import { Match } from '../types/api-football'
import { getFixturesByDate } from '../lib/api-football'

// Generate dates for the next 7 days
function generateDates(): { day: string; date: string; month: string; fullDate: string }[] {
  const days = ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB']
  const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC']

  const dates = []
  for (let i = 0; i < 7; i++) {
    const d = new Date()
    d.setDate(d.getDate() + i)
    dates.push({
      day: days[d.getDay()],
      date: d.getDate().toString(),
      month: months[d.getMonth()],
      fullDate: d.toISOString().split('T')[0],
    })
  }
  return dates
}

export default function FeaturedMatches() {
  const [selectedDate, setSelectedDate] = useState(0)
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const dates = generateDates()

  useEffect(() => {
    async function fetchMatches() {
      setLoading(true)
      setError(null)

      try {
        const data = await getFixturesByDate(dates[selectedDate].fullDate)
        setMatches(data)
      } catch (err) {
        console.error('Error fetching matches:', err)
        setError('Error al cargar los partidos. Verifica tu API key.')
        // Fallback to sample data if API fails
        setMatches([
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
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [selectedDate])

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

      {/* Error Message */}
      {error && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
          <span className="ml-2 text-gray-500">Cargando partidos...</span>
        </div>
      ) : matches.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No hay partidos programados para esta fecha
        </div>
      ) : (
        /* Matches Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {!loading && matches.length > 0 && (
        <div className="text-center mt-8">
          <button className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors shadow-lg">
            Ver más partidos
          </button>
        </div>
      )}
    </div>
  )
}