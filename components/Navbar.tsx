'use client';

import Link from 'next/link';
import { useState } from 'react';
import { User, Settings, LogIn, UserPlus, LogOut } from 'lucide-react';

export default function Navbar() {
  const [activeTab, setActiveTab] = useState('noticias');
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Simular estado de autenticación
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Datos de usuario simulados
  const userData = {
    name: 'Juan Pérez',
    email: 'juan@example.com',
    avatar: 'JP' // Iniciales para el avatar
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowUserMenu(false);
    // Aquí iría la lógica real de logout
  };

  return (
    <nav className="bg-black text-white shadow-lg sticky top-0 z-50">
      {/* Top Bar con iconos de usuario y configuración */}
      <div className="container mx-auto px-4 py-3 flex justify-end items-center gap-4">
        {isAuthenticated ? (
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity p-2 hover:bg-gray-800 rounded-lg"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center font-bold text-sm text-black">
                {userData.avatar}
              </div>
              <span className="text-sm font-medium">{userData.name}</span>
            </button>
            
            {/* Menú desplegable de usuario */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-gray-900 rounded-xl shadow-2xl border border-gray-800 overflow-hidden">
                <div className="p-4 border-b border-gray-800">
                  <p className="font-semibold">{userData.name}</p>
                  <p className="text-sm text-gray-400">{userData.email}</p>
                </div>
                <div className="p-2">
                  <Link 
                    href="/profile"
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <User size={18} />
                    <span>Mi Perfil</span>
                  </Link>
                  <Link 
                    href="/settings"
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <Settings size={18} />
                    <span>Configuración</span>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-800 rounded-lg transition-colors text-red-400"
                  >
                    <LogOut size={18} />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link 
              href="/login"
              className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700 rounded-lg transition-all duration-300 border border-gray-700 hover:border-green-500/50"
            >
              <LogIn size={18} />
              <span className="font-semibold">Iniciar Sesión</span>
            </Link>
            <Link 
              href="/signup"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black rounded-lg transition-all duration-300 font-semibold shadow-lg shadow-green-500/50 transform hover:scale-[1.02]"
            >
              <UserPlus size={18} />
              <span>Registrarse</span>
            </Link>
          </>
        )}
      </div>

      {/* Main Navigation */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 flex items-center">
          {/* Logo */}
          <Link href="/" className="py-5 pr-8 border-r border-gray-800">
            <h1 className="text-2xl font-bold tracking-tight hover:text-green-400 transition-colors">
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