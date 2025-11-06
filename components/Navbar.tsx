'use client';

import Link from 'next/link';
import { useState } from 'react';
import { User, Settings } from 'lucide-react';

export default function Navbar() {
  const [activeTab, setActiveTab] = useState('noticias');

  return (
    <nav className="bg-black text-white shadow-lg">
      {/* Top Bar con iconos de usuario y configuración */}
      <div className="container mx-auto px-4 py-3 flex justify-end items-center gap-4">
        <button className="hover:opacity-80 transition-opacity p-2 hover:bg-gray-800 rounded-full">
          <User size={24} />
        </button>
        <button className="hover:opacity-80 transition-opacity p-2 hover:bg-gray-800 rounded-full">
          <Settings size={24} />
        </button>
      </div>

      {/* Main Navigation */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 flex items-center">
          {/* Logo */}
          <Link href="/" className="py-5 pr-8 border-r border-gray-800">
            <h1 className="text-2xl font-bold tracking-tight hover:text-blue-400 transition-colors">
              InFootball
            </h1>
          </Link>

          {/* Navigation Links */}
          <div className="flex flex-1">
            <Link
              href="/noticias"
              onClick={() => setActiveTab('noticias')}
              className={`px-8 lg:px-12 py-5 text-sm font-medium uppercase tracking-wide transition-colors border-r border-gray-800 hover:bg-gray-900 ${
                activeTab === 'noticias' ? 'bg-gray-900 text-white' : 'text-gray-300'
              }`}
            >
              Noticias
            </Link>
            
            <Link
              href="/competiciones"
              onClick={() => setActiveTab('competiciones')}
              className={`px-8 lg:px-12 py-5 text-sm font-medium uppercase tracking-wide transition-colors border-r border-gray-800 hover:bg-gray-900 ${
                activeTab === 'competiciones' ? 'bg-gray-900 text-white' : 'text-gray-300'
              }`}
            >
              Competiciones
            </Link>
            
            <Link
              href="/partidos"
              onClick={() => setActiveTab('partidos')}
              className={`px-8 lg:px-12 py-5 text-sm font-medium uppercase tracking-wide transition-colors hover:bg-gray-900 ${
                activeTab === 'partidos' ? 'bg-gray-900 text-white' : 'text-gray-300'
              }`}
            >
              Partidos
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
