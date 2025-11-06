'use client'

import React from 'react'
import Link from 'next/link'
import { Home, Newspaper, Users, Trophy, TrendingUp, Search, Bell, User } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="bg-black text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">i</span>
            </div>
            <span className="text-xl font-bold">InFootball</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink href="/" icon={<Home size={18} />} text="Destacado" />
            <div className="w-px h-6 bg-gray-700 mx-2"></div>
            <NavLink href="/noticias" icon={<Newspaper size={18} />} text="Noticias" />
            <div className="w-px h-6 bg-gray-700 mx-2"></div>
            <NavLink href="/partidos" icon={<Trophy size={18} />} text="Partidos" />
            <div className="w-px h-6 bg-gray-700 mx-2"></div>
            <NavLink href="/competiciones" icon={<Trophy size={18} />} text="Competiciones" />
            <div className="w-px h-6 bg-gray-700 mx-2"></div>
            <NavLink href="/jugadores" icon={<Users size={18} />} text="Jugadores" />
            <div className="w-px h-6 bg-gray-700 mx-2"></div>
            <NavLink href="/fichajes" icon={<TrendingUp size={18} />} text="Fichajes" />
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <button className="hover:text-green-400 transition-colors p-2 rounded-lg hover:bg-gray-800">
              <Search size={20} />
            </button>
            <button className="hover:text-green-400 transition-colors p-2 rounded-lg hover:bg-gray-800">
              <Bell size={20} />
            </button>
            <button className="hover:text-green-400 transition-colors p-2 rounded-lg hover:bg-gray-800">
              <User size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

interface NavLinkProps {
  href: string
  icon: React.ReactNode
  text: string
}

function NavLink({ href, icon, text }: NavLinkProps) {
  return (
    <Link 
      href={href}
      className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-800 hover:text-green-400 transition-all duration-200"
    >
      {icon}
      <span className="font-medium">{text}</span>
    </Link>
  )
}
