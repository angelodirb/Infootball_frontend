'use client'

import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function HeroBanner() {
  return (
    <div className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 text-white overflow-hidden">
      {/* Decorative Globe */}
      <div className="absolute right-0 top-0 w-96 h-96 opacity-10">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="1"/>
          <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="1"/>
          <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="1"/>
          <line x1="20" y1="100" x2="180" y2="100" stroke="currentColor" strokeWidth="1"/>
          <line x1="100" y1="20" x2="100" y2="180" stroke="currentColor" strokeWidth="1"/>
        </svg>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Left: Featured Players */}
          <div className="flex-1 flex items-center space-x-4 mb-8 md:mb-0">
            <PlayerPlaceholder position="left" />
            <PlayerPlaceholder position="center" size="large" />
          </div>

          {/* Center: Main Text */}
          <div className="flex-1 text-center px-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4" 
                style={{
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3), -1px -1px 0 rgba(255,255,255,0.1), 1px -1px 0 rgba(255,255,255,0.1), -1px 1px 0 rgba(255,255,255,0.1), 1px 1px 0 rgba(255,255,255,0.1)'
                }}>
              LOS MEJORES<br />PARTIDOS DE HOY
            </h1>
            <p className="text-xl md:text-2xl text-blue-100">
              Sigue en vivo todos los resultados
            </p>
          </div>

          {/* Right: Featured Player */}
          <div className="flex-1 flex justify-end items-center">
            <PlayerPlaceholder position="right" />
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12">
          <path d="M0,0 C300,80 900,80 1200,0 L1200,120 L0,120 Z" fill="white" opacity="0.1"/>
        </svg>
      </div>
    </div>
  )
}

interface PlayerPlaceholderProps {
  position: 'left' | 'center' | 'right'
  size?: 'normal' | 'large'
}

function PlayerPlaceholder({ position, size = 'normal' }: PlayerPlaceholderProps) {
  const sizeClass = size === 'large' ? 'w-32 h-32 md:w-40 md:h-40' : 'w-24 h-24 md:w-28 md:h-28'
  
  return (
    <div className={`${sizeClass} rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center shadow-xl`}>
      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 flex items-center justify-center">
        <svg className="w-8 h-8 md:w-10 md:h-10 text-white/50" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  )
}
