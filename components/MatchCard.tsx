'use client'

import React from 'react'
import Image from 'next/image'

export interface Match {
  id: number
  homeTeam: string
  awayTeam: string
  homeScore?: number
  awayScore?: number
  time: string
  competition: string
  status: 'scheduled' | 'live' | 'finished'
  homeLogo?: string
  awayLogo?: string
}

interface MatchCardProps {
  match: Match
}

export default function MatchCard({ match }: MatchCardProps) {
  return (
    <div className="bg-gray-100 rounded-xl p-6 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
      {/* Competition Badge */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs font-semibold bg-blue-600 text-white px-3 py-1 rounded-full">
          {match.competition}
        </span>
        {match.status === 'live' && (
          <span className="flex items-center text-xs font-semibold text-red-600">
            <span className="w-2 h-2 bg-red-600 rounded-full mr-1 animate-pulse"></span>
            EN VIVO
          </span>
        )}
      </div>

      {/* Teams */}
      <div className="space-y-4">
        {/* Home Team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
              {match.homeLogo ? (
                <Image 
                  src={match.homeLogo} 
                  alt={match.homeTeam}
                  width={32}
                  height={32}
                  className="object-contain"
                />
              ) : (
                <div className="w-6 h-6 bg-gray-300 rounded"></div>
              )}
            </div>
            <span className="font-semibold text-gray-800">{match.homeTeam}</span>
          </div>
          {match.homeScore !== undefined && (
            <span className="text-2xl font-bold text-gray-900 ml-4">{match.homeScore}</span>
          )}
        </div>

        {/* Away Team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
              {match.awayLogo ? (
                <Image 
                  src={match.awayLogo} 
                  alt={match.awayTeam}
                  width={32}
                  height={32}
                  className="object-contain"
                />
              ) : (
                <div className="w-6 h-6 bg-gray-300 rounded"></div>
              )}
            </div>
            <span className="font-semibold text-gray-800">{match.awayTeam}</span>
          </div>
          {match.awayScore !== undefined && (
            <span className="text-2xl font-bold text-gray-900 ml-4">{match.awayScore}</span>
          )}
        </div>
      </div>

      {/* Time/Status */}
      <div className="mt-4 pt-4 border-t border-gray-300">
        <div className="flex justify-center">
          <span className="text-sm font-medium text-gray-600 bg-white px-4 py-2 rounded-lg shadow-sm">
            {match.time}
          </span>
        </div>
      </div>
    </div>
  )
}
