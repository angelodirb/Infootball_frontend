'use client';

// Frontend - src/app/partidos/page.tsx

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, Calendar, Zap, MapPin, Users } from 'lucide-react';
import { matchesApi } from '@/lib/api';
import Navbar from '@/components/Navbar';

// Tipos de datos
interface Match {
  fixture: {
    id: number;
    date: string;
    status: {
      short: string;
      long: string;
    };
    venue?: {
      name: string;
      city: string;
    };
  };
  teams: {
    home: {
      id: number;
      name: string;
      logo: string;
    };
    away: {
      id: number;
      name: string;
      logo: string;
    };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  league: {
    id: number;
    name: string;
    logo: string;
    country: string;
  };
  score?: {
    halftime?: {
      home: number | null;
      away: number | null;
    };
  };
}

// Competiciones disponibles para filtrar - Ligas Europeas Principales
const competitions = [
  { name: "Todos", icon: "🌍" },
  { name: "La Liga", icon: "🇪🇸" },
  { name: "Premier League", icon: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { name: "Serie A", icon: "🇮🇹" },
  { name: "Bundesliga", icon: "🇩🇪" },
  { name: "Ligue 1", icon: "🇫🇷" },
  { name: "Champions League", icon: "🏆" }
];

export default function PartidosPage() {
  const [selectedCompetition, setSelectedCompetition] = useState("Todos");
  const [activeTab, setActiveTab] = useState<'live' | 'today' | 'upcoming' | 'finished'>('live');
  const [matches, setMatches] = useState<Match[]>([]);
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos
  const loadMatches = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let matchesData: Match[] = [];
      
      switch (activeTab) {
        case 'live':
          matchesData = await matchesApi.getLive();
          setLiveMatches(matchesData);
          break;
        case 'today':
          matchesData = await matchesApi.getByDate(selectedDate);
          break;
        case 'upcoming':
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          matchesData = await matchesApi.getByDate(tomorrow.toISOString().split('T')[0]);
          break;
        case 'finished':
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          matchesData = await matchesApi.getByDate(yesterday.toISOString().split('T')[0]);
          break;
        default:
          matchesData = await matchesApi.getByDate(selectedDate);
      }
      
      setMatches(matchesData || []);
      
    } catch (err) {
      console.error('Error loading matches:', err);
      setError('Error al cargar partidos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatches();
    
    // Auto-refresh para partidos en vivo cada 30 segundos
    if (activeTab === 'live') {
      const interval = setInterval(loadMatches, 30000);
      return () => clearInterval(interval);
    }
  }, [activeTab, selectedDate]);

  // Funciones auxiliares
  const formatMatchTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatMatchDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const getMatchStatus = (status: string, homeGoals: number | null, awayGoals: number | null) => {
    switch (status) {
      case 'NS': return 'Próximo';
      case '1H': return 'Primer tiempo';
      case '2H': return 'Segundo tiempo';
      case 'HT': return 'Descanso';
      case 'FT': return 'Finalizado';
      case 'LIVE': return 'En vivo';
      default: return status;
    }
  };

  const isLive = (status: string) => {
    return ['1H', '2H', 'HT', 'LIVE'].includes(status);
  };

  const getStatusColor = (status: string) => {
    if (isLive(status)) return 'from-red-500 to-red-600';
    if (status === 'FT') return 'from-gray-500 to-gray-600';
    return 'from-green-500 to-green-600';
  };

  // Filtrar partidos por competición
  const filteredMatches = selectedCompetition === "Todos" 
    ? matches 
    : matches.filter(match => match.league.name.includes(selectedCompetition));

  const filteredLiveMatches = selectedCompetition === "Todos"
    ? liveMatches
    : liveMatches.filter(match => match.league.name.includes(selectedCompetition));

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-8 pb-12 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 via-transparent to-transparent"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-8 bg-gradient-to-b from-green-400 to-green-600 rounded-full"></div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                  Partidos
                </span>
              </h1>
            </div>
            <p className="text-gray-400 text-lg ml-5">Sigue todos los partidos en vivo y próximos encuentros</p>
          </div>

          {/* Filtros de Competición */}
          <div className="mb-6">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {competitions.map((comp) => (
                <button
                  key={comp.name}
                  onClick={() => setSelectedCompetition(comp.name)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                    selectedCompetition === comp.name
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <span>{comp.icon}</span>
                  <span className="text-sm font-medium">{comp.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tabs de navegación */}
          <div className="mb-8">
            <div className="flex gap-1 bg-gray-900/50 rounded-lg p-1">
              {[
                { key: 'live', label: '🔴 En Vivo', count: filteredLiveMatches.length },
                { key: 'today', label: '📅 Hoy', count: activeTab === 'today' ? filteredMatches.length : 0 },
                { key: 'upcoming', label: '⏰ Próximos', count: activeTab === 'upcoming' ? filteredMatches.length : 0 },
                { key: 'finished', label: '✅ Finalizados', count: activeTab === 'finished' ? filteredMatches.length : 0 },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                    activeTab === tab.key
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      activeTab === tab.key ? 'bg-green-700' : 'bg-gray-700'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Selector de fecha para tabs específicos */}
          {(activeTab === 'today' || activeTab === 'upcoming' || activeTab === 'finished') && (
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Contenido Principal */}
      <section className="px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-gray-900 rounded-lg p-6 animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-700 rounded w-32"></div>
                        <div className="h-4 bg-gray-700 rounded w-20"></div>
                      </div>
                    </div>
                    <div className="h-8 bg-gray-700 rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-8 text-center">
              <div className="text-red-400 text-lg mb-4">❌ {error}</div>
              <button
                onClick={loadMatches}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Intentar de nuevo
              </button>
            </div>
          ) : (
            <>
              {/* Partidos en Vivo Destacados */}
              {activeTab === 'live' && filteredLiveMatches.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {filteredLiveMatches.slice(0, 2).map((match) => (
                    <div key={match.fixture.id} className="group relative cursor-pointer transform transition-all duration-500 hover:scale-[1.02]">
                      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 border border-gray-700">
                        {/* Estado en vivo */}
                        <div className="absolute top-4 right-4 flex items-center space-x-1 bg-red-500 px-3 py-1 rounded-full">
                          <Zap className="w-3 h-3 text-white" />
                          <span className="text-xs font-bold text-white">EN VIVO</span>
                        </div>

                        {/* Competición */}
                        <div className="flex items-center space-x-2 mb-4">
                          <img 
                            src={match.league.logo} 
                            alt={match.league.name} 
                            className="w-6 h-6"
                            onError={(e) => {e.currentTarget.src = '/icons/default-league.png'}}
                          />
                          <span className="text-sm font-medium text-gray-300">{match.league.name}</span>
                        </div>

                        {/* Equipos y marcador */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <img 
                                src={match.teams.home.logo} 
                                alt={match.teams.home.name} 
                                className="w-10 h-10"
                                onError={(e) => {e.currentTarget.src = '/icons/default-team.png'}}
                              />
                              <span className="font-semibold text-white text-lg">{match.teams.home.name}</span>
                            </div>
                            <span className="text-3xl font-bold text-white">
                              {match.goals.home ?? 0}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <img 
                                src={match.teams.away.logo} 
                                alt={match.teams.away.name} 
                                className="w-10 h-10"
                                onError={(e) => {e.currentTarget.src = '/icons/default-team.png'}}
                              />
                              <span className="font-semibold text-white text-lg">{match.teams.away.name}</span>
                            </div>
                            <span className="text-3xl font-bold text-white">
                              {match.goals.away ?? 0}
                            </span>
                          </div>
                        </div>

                        {/* Info del partido */}
                        <div className="mt-4 pt-4 border-t border-gray-700 flex items-center justify-between">
                          <span className="text-green-400 font-medium">
                            {getMatchStatus(match.fixture.status.short, match.goals.home, match.goals.away)}
                          </span>
                          {match.fixture.venue && (
                            <div className="flex items-center space-x-1 text-gray-400">
                              <MapPin className="w-4 h-4" />
                              <span className="text-sm">{match.fixture.venue.name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Lista de partidos */}
              <div className="space-y-4">
                {filteredMatches.length === 0 && filteredLiveMatches.length === 0 ? (
                  <div className="bg-gray-900 rounded-lg p-8 text-center">
                    <div className="text-gray-400 text-lg">
                      📅 No hay partidos disponibles
                    </div>
                    <p className="text-gray-500 mt-2">
                      {activeTab === 'live' ? 'No hay partidos en vivo en este momento' : 'Prueba seleccionando otra fecha o competición'}
                    </p>
                  </div>
                ) : (
                  (activeTab === 'live' ? filteredLiveMatches : filteredMatches).map((match) => (
                    <div key={match.fixture.id} className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-colors border border-gray-800 hover:border-gray-700">
                      <div className="flex items-center justify-between">
                        {/* Info básica del partido */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-3">
                            <img 
                              src={match.league.logo} 
                              alt={match.league.name} 
                              className="w-5 h-5"
                              onError={(e) => {e.currentTarget.src = '/icons/default-league.png'}}
                            />
                            <span className="text-sm text-gray-400">{match.league.name}</span>
                            {isLive(match.fixture.status.short) && (
                              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">EN VIVO</span>
                            )}
                          </div>

                          {/* Equipos */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <img 
                                  src={match.teams.home.logo} 
                                  alt={match.teams.home.name} 
                                  className="w-8 h-8"
                                  onError={(e) => {e.currentTarget.src = '/icons/default-team.png'}}
                                />
                                <span className="font-medium text-white">{match.teams.home.name}</span>
                              </div>
                              <span className="text-xl font-bold text-white min-w-[2rem] text-center">
                                {match.goals.home !== null ? match.goals.home : '-'}
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <img 
                                  src={match.teams.away.logo} 
                                  alt={match.teams.away.name} 
                                  className="w-8 h-8"
                                  onError={(e) => {e.currentTarget.src = '/icons/default-team.png'}}
                                />
                                <span className="font-medium text-white">{match.teams.away.name}</span>
                              </div>
                              <span className="text-xl font-bold text-white min-w-[2rem] text-center">
                                {match.goals.away !== null ? match.goals.away : '-'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Hora y estado */}
                        <div className="text-right ml-6">
                          <div className="flex items-center space-x-2 mb-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-300">{formatMatchTime(match.fixture.date)}</span>
                          </div>
                          <span className={`inline-block px-3 py-1 rounded text-xs font-medium ${
                            isLive(match.fixture.status.short) 
                              ? 'bg-red-500 text-white' 
                              : match.fixture.status.short === 'FT'
                              ? 'bg-gray-600 text-gray-200'
                              : 'bg-green-600 text-white'
                          }`}>
                            {getMatchStatus(match.fixture.status.short, match.goals.home, match.goals.away)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}