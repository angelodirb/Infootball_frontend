'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { competitionsApi } from '../../../../lib/api';

interface Team {
  id: number;
  name: string;
  logo: string;
}

interface StandingEntry {
  position: number;
  team: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: string[];
}

interface TopScorer {
  player: {
    id: number;
    name: string;
    photo: string;
    nationality: string;
  };
  team: Team;
  goals: number;
  assists: number;
  matches: number;
}

interface Competition {
  id: number;
  name: string;
  logo: string;
  country: string;
  countryFlag?: string;
  season: string;
  type: string;
}

interface StandingsData {
  competition: Competition;
  standings: StandingEntry[];
}

export default function CompeticionDetalle() {
  const params = useParams();
  const compId = Number(params.id);

  const [competition, setCompetition] = useState<Competition | null>(null);
  const [standings, setStandings] = useState<StandingEntry[]>([]);
  const [topScorers, setTopScorers] = useState<TopScorer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'tabla' | 'goleadores'>('tabla');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Cargar competición y standings en paralelo
        const [compData, standingsData] = await Promise.all([
          competitionsApi.getById(compId),
          competitionsApi.getStandings(compId),
        ]);

        setCompetition(compData);

        if (standingsData && standingsData.standings) {
          setStandings(standingsData.standings);
        }

        setError(null);
      } catch (err) {
        setError('Error al cargar los datos de la competición');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (compId) {
      loadData();
    }
  }, [compId]);

  // Cargar goleadores cuando se selecciona el tab
  useEffect(() => {
    const loadScorers = async () => {
      if (activeTab === 'goleadores' && topScorers.length === 0) {
        try {
          const scorersData = await competitionsApi.getTopScorers(compId);
          setTopScorers(scorersData);
        } catch (err) {
          console.error('Error loading scorers:', err);
        }
      }
    };

    loadScorers();
  }, [activeTab, compId, topScorers.length]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando competición...</p>
        </div>
      </div>
    );
  }

  if (error || !competition) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error || 'Competición no encontrada'}</p>
          <Link
            href="/competiciones"
            className="bg-green-500 text-black px-6 py-3 rounded-lg font-bold hover:bg-green-400 transition"
          >
            Volver a competiciones
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white">

      {/* Breadcrumb */}
      <div className="border-b border-gray-800/50 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-400 hover:text-green-400 transition-colors">Inicio</Link>
            <span className="text-gray-600">▶</span>
            <Link href="/competiciones" className="text-gray-400 hover:text-green-400 transition-colors">Competiciones</Link>
            <span className="text-gray-600">▶</span>
            <span className="text-green-400 font-semibold">{competition.name}</span>
          </div>
        </div>
      </div>

      {/* Header de la competición */}
      <section className="relative py-12 px-4 overflow-hidden">
        {/* Background decorativo */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(34,197,94,0.1),transparent)]"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
            {/* Logo grande */}
            <div className="w-32 h-32 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center shadow-2xl border-2 border-gray-700 overflow-hidden">
              {competition.logo ? (
                <Image
                  src={competition.logo}
                  alt={competition.name}
                  width={96}
                  height={96}
                  className="object-contain"
                />
              ) : (
                <span className="text-7xl">🏆</span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-green-500 text-black text-sm font-bold px-4 py-1.5 rounded-full">
                  {competition.season}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-400 flex items-center gap-2">
                  {competition.countryFlag && (
                    <Image src={competition.countryFlag} alt={competition.country} width={20} height={15} />
                  )}
                  {competition.country}
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {competition.name}
              </h1>

              {/* Stats rápidas */}
              <div className="flex flex-wrap gap-4">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-700">
                  <span className="text-gray-400 text-sm">Tipo: </span>
                  <span className="text-white font-bold">{competition.type}</span>
                </div>
                {standings.length > 0 && (
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-700">
                    <span className="text-gray-400 text-sm">Equipos: </span>
                    <span className="text-white font-bold">{standings.length}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs de navegación */}
      <section className="sticky top-16 z-20 backdrop-blur-xl bg-black/80 border-y border-gray-800/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-4">
            {[
              { id: 'tabla', label: 'Tabla de Posiciones', icon: '📊' },
              { id: 'goleadores', label: 'Goleadores', icon: '⚽' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 transform hover:scale-105 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-black shadow-lg shadow-green-500/50'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{tab.icon}</span>
                  <span className="hidden md:inline">{tab.label}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Contenido según tab activo */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">

          {/* TABLA DE POSICIONES */}
          {activeTab === 'tabla' && (
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl overflow-hidden border border-gray-800">
              {standings.length > 0 ? (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-800/50">
                        <tr>
                          <th className="text-left p-4 text-sm font-bold text-gray-400">#</th>
                          <th className="text-left p-4 text-sm font-bold text-gray-400">Equipo</th>
                          <th className="text-center p-4 text-sm font-bold text-gray-400">PJ</th>
                          <th className="text-center p-4 text-sm font-bold text-gray-400">G</th>
                          <th className="text-center p-4 text-sm font-bold text-gray-400">E</th>
                          <th className="text-center p-4 text-sm font-bold text-gray-400">P</th>
                          <th className="text-center p-4 text-sm font-bold text-gray-400">GF</th>
                          <th className="text-center p-4 text-sm font-bold text-gray-400">GC</th>
                          <th className="text-center p-4 text-sm font-bold text-gray-400">DG</th>
                          <th className="text-center p-4 text-sm font-bold text-gray-400">Pts</th>
                          <th className="text-center p-4 text-sm font-bold text-gray-400">Forma</th>
                        </tr>
                      </thead>
                      <tbody>
                        {standings.map((entry, index) => (
                          <tr
                            key={entry.position}
                            className={`border-t border-gray-800 hover:bg-gray-800/50 transition-colors ${
                              index < 4 ? 'border-l-4 border-l-green-500' :
                              index < 6 ? 'border-l-4 border-l-blue-500' :
                              index >= standings.length - 3 ? 'border-l-4 border-l-red-500' : ''
                            }`}
                          >
                            <td className="p-4 text-center font-bold text-gray-400">{entry.position}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                {entry.team.logo ? (
                                  <Image
                                    src={entry.team.logo}
                                    alt={entry.team.name}
                                    width={32}
                                    height={32}
                                    className="object-contain"
                                  />
                                ) : (
                                  <span className="text-2xl">⚽</span>
                                )}
                                <span className="font-bold">{entry.team.name}</span>
                              </div>
                            </td>
                            <td className="p-4 text-center text-gray-400">{entry.played}</td>
                            <td className="p-4 text-center text-gray-400">{entry.won}</td>
                            <td className="p-4 text-center text-gray-400">{entry.drawn}</td>
                            <td className="p-4 text-center text-gray-400">{entry.lost}</td>
                            <td className="p-4 text-center text-gray-400">{entry.goalsFor}</td>
                            <td className="p-4 text-center text-gray-400">{entry.goalsAgainst}</td>
                            <td className="p-4 text-center font-bold">{entry.goalDifference > 0 ? '+' : ''}{entry.goalDifference}</td>
                            <td className="p-4 text-center font-black text-green-400 text-lg">{entry.points}</td>
                            <td className="p-4">
                              <div className="flex gap-1 justify-center">
                                {entry.form.map((result: string, i: number) => (
                                  <span
                                    key={i}
                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                      result === 'W' ? 'bg-green-500 text-black' :
                                      result === 'D' ? 'bg-gray-500 text-white' :
                                      'bg-red-500 text-white'
                                    }`}
                                  >
                                    {result}
                                  </span>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Leyenda */}
                  <div className="flex flex-wrap gap-4 p-6 bg-gray-800/30 border-t border-gray-800">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span className="text-sm text-gray-400">Champions League</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                      <span className="text-sm text-gray-400">Europa League</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-500 rounded"></div>
                      <span className="text-sm text-gray-400">Descenso</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-12 text-center">
                  <p className="text-gray-400">No hay datos de clasificación disponibles</p>
                </div>
              )}
            </div>
          )}

          {/* TABLA DE GOLEADORES */}
          {activeTab === 'goleadores' && (
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl overflow-hidden border border-gray-800">
              <div className="p-6 bg-gray-800/30 border-b border-gray-800">
                <h3 className="text-2xl font-black flex items-center gap-3">
                  <span>⚽</span>
                  Top Goleadores de la Temporada
                </h3>
              </div>

              <div className="p-6">
                {topScorers.length > 0 ? (
                  <div className="space-y-4">
                    {topScorers.map((scorer, index) => (
                      <div
                        key={scorer.player.id}
                        className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 hover:bg-gray-800/50 ${
                          index === 0 ? 'bg-gradient-to-r from-yellow-900/20 to-transparent border border-yellow-600/30' : ''
                        }`}
                      >
                        {/* Posición */}
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-xl ${
                          index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black' :
                          index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-600 text-black' :
                          index === 2 ? 'bg-gradient-to-br from-orange-600 to-orange-800 text-white' :
                          'bg-gray-800 text-gray-400'
                        }`}>
                          {index + 1}
                        </div>

                        {/* Foto del jugador */}
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-800">
                          {scorer.player.photo ? (
                            <Image
                              src={scorer.player.photo}
                              alt={scorer.player.name}
                              width={48}
                              height={48}
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl">👤</div>
                          )}
                        </div>

                        {/* Logo del equipo */}
                        <div className="w-8 h-8">
                          {scorer.team.logo ? (
                            <Image
                              src={scorer.team.logo}
                              alt={scorer.team.name}
                              width={32}
                              height={32}
                              className="object-contain"
                            />
                          ) : (
                            <span className="text-2xl">⚽</span>
                          )}
                        </div>

                        {/* Info del jugador */}
                        <div className="flex-1">
                          <div className="font-bold text-lg">{scorer.player.name}</div>
                          <div className="text-sm text-gray-400">{scorer.team.name}</div>
                        </div>

                        {/* Stats */}
                        <div className="text-center px-4">
                          <div className="text-sm text-gray-400">Asistencias</div>
                          <div className="font-bold">{scorer.assists}</div>
                        </div>

                        {/* Goles */}
                        <div className="text-right">
                          <div className="text-3xl font-black text-green-400">{scorer.goals}</div>
                          <div className="text-xs text-gray-400">goles</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Cargando goleadores...</p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* Botón volver */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <Link
          href="/competiciones"
          className="inline-flex items-center gap-3 bg-gray-800/50 hover:bg-gradient-to-r hover:from-green-500 hover:to-green-600 border border-gray-700 hover:border-green-500 text-white hover:text-black font-bold px-6 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <span className="text-xl">◀</span>
          Volver a competiciones
        </Link>
      </div>
    </div>
  );
}
