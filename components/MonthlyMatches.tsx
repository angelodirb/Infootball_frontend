'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { matchesApi } from '@/lib/api';
import MatchCard from '@/components/MatchCard';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Match, Competition } from '@/types';

/**
 * Formatear fecha para mostrar
 */
function formatDateDisplay(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

/**
 * Obtener fecha de hoy en formato YYYY-MM-DD
 */
function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Agrupar partidos por competicion
 */
function groupMatchesByCompetition(matches: Match[]) {
  return matches.reduce((acc, match) => {
    const competitionId = match.competition.id;
    if (!acc[competitionId]) {
      acc[competitionId] = {
        competition: match.competition,
        matches: []
      };
    }
    acc[competitionId].matches.push(match);
    return acc;
  }, {} as Record<string, { competition: Competition; matches: Match[] }>);
}

export default function MonthlyMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDate());
  const [selectedCompetition, setSelectedCompetition] = useState<string | null>(null);
  const [groupedMatches, setGroupedMatches] = useState<Record<string, { competition: Competition; matches: Match[] }>>({});

  useEffect(() => {
    loadMatchesForDate(selectedDate);
  }, [selectedDate]);

  const loadMatchesForDate = async (date: string) => {
    try {
      setLoading(true);
      setError(null);

      console.log('📅 Loading matches for date:', date);

      // Usar el endpoint de fecha especifica
      const response = await matchesApi.getByDate(date);

      if (response && Array.isArray(response) && response.length > 0) {
        setMatches(response);

        // Agrupar por competicion
        const grouped = groupMatchesByCompetition(response);
        setGroupedMatches(grouped);

        // Seleccionar la primera competicion por defecto
        const firstCompetitionId = Object.keys(grouped)[0];
        setSelectedCompetition(firstCompetitionId || null);

        console.log('✅ Loaded', response.length, 'matches for', date);
      } else {
        setMatches([]);
        setGroupedMatches({});
        setSelectedCompetition(null);
        console.warn('⚠️ No matches found for', date);
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      console.error('❌ Error loading matches:', err);
      setError(errorMessage);
      setMatches([]);
      setGroupedMatches({});
    } finally {
      setLoading(false);
    }
  };

  // Cambiar fecha (dia anterior/siguiente)
  const changeDate = (days: number) => {
    const current = new Date(selectedDate + 'T00:00:00');
    current.setDate(current.getDate() + days);
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  // Obtener partidos de la competicion seleccionada
  const competitionMatches = selectedCompetition && groupedMatches[selectedCompetition]
    ? groupedMatches[selectedCompetition].matches
    : [];

  const competitionNames = Object.entries(groupedMatches).map(([id, data]) => ({
    id,
    name: data.competition.name,
    logo: data.competition.logo,
    count: data.matches.length
  }));

  return (
    <section className="py-12 px-4 bg-gradient-to-b from-gray-900 via-gray-900 to-black">
      <div className="max-w-6xl mx-auto">
        {/* Encabezado con selector de fecha */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <Calendar className="w-8 h-8 text-green-500" />
              Partidos del Dia
            </h2>
          </div>

          {/* Selector de fecha */}
          <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-2">
            <button
              onClick={() => changeDate(-1)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Dia anterior"
            >
              <ChevronLeft className="w-5 h-5 text-gray-300" />
            </button>

            <div className="flex items-center gap-2 px-4">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-white border-none outline-none cursor-pointer"
              />
            </div>

            <button
              onClick={() => changeDate(1)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Dia siguiente"
            >
              <ChevronRight className="w-5 h-5 text-gray-300" />
            </button>
          </div>
        </div>

        {/* Fecha formateada */}
        <p className="text-gray-400 text-sm mb-6 capitalize">
          {formatDateDisplay(selectedDate)}
        </p>

        {/* Estado: CARGANDO */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-800 rounded-lg p-4 animate-pulse h-48"
              />
            ))}
          </div>
        )}

        {/* Estado: ERROR */}
        {error && !loading && (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 text-red-200">
            <p className="font-semibold">Error al cargar los partidos</p>
            <p className="text-sm mt-2">{error}</p>
          </div>
        )}

        {/* Estado: SIN PARTIDOS */}
        {!loading && !error && matches.length === 0 && (
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 text-center">
            <p className="text-gray-300">No hay partidos programados para esta fecha</p>
            <p className="text-gray-500 text-sm mt-2">
              Intenta seleccionar otra fecha
            </p>
          </div>
        )}

        {/* Estado: EXITO - Mostrar partidos */}
        {!loading && !error && matches.length > 0 && (
          <>
            {/* Resumen */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-400 text-sm">
                {matches.length} partidos en {competitionNames.length} competiciones
              </p>
              <span className="text-green-400 text-sm font-mono">
                {competitionMatches.length} partidos
              </span>
            </div>

            {/* Filtro por competicion */}
            {competitionNames.length > 1 && (
              <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
                {competitionNames.map((competition) => (
                  <button
                    key={competition.id}
                    onClick={() => setSelectedCompetition(competition.id)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all
                      ${selectedCompetition === competition.id
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }
                    `}
                  >
                    {competition.logo && (
                      <Image
                        src={competition.logo}
                        alt={competition.name}
                        width={20}
                        height={20}
                        className="w-5 h-5"
                      />
                    )}
                    <span className="text-sm">{competition.name}</span>
                    <span className="text-xs bg-black/20 px-2 py-1 rounded">
                      {competition.count}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Grid de partidos */}
            {competitionMatches.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {competitionMatches.map((match, index) => (
                  <MatchCard key={`${match.id}-${index}`} match={match} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
