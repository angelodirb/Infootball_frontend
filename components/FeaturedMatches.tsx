'use client';

import { useEffect, useState } from 'react';
import { matchesApi } from '@/lib/api';
import MatchCard from '@/components/MatchCard';
import { Match } from '@/types';

export default function FeaturedMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('📍 FeaturedMatches: Starting to load matches...');

        // INTENTO 1: Obtener partidos en vivo
        try {
          console.log('📍 FeaturedMatches: Trying to load live matches...');
          const liveMatches = await matchesApi.getLive();
          
          if (liveMatches && liveMatches.length > 0) {
            console.log('✅ Found live matches:', liveMatches.length);
            setMatches(liveMatches.slice(0, 5)); // Mostrar los primeros 5
            return;
          }
        } catch (liveError) {
          console.warn('⚠️ Live matches error:', liveError);
        }

        // INTENTO 2: Si no hay live, obtener todos los partidos
        console.log('📍 FeaturedMatches: No live matches, getting all matches...');
        const allMatches = await matchesApi.getAll();
        
        if (allMatches && allMatches.length > 0) {
          console.log('✅ Found all matches:', allMatches.length);
          setMatches(allMatches.slice(0, 5)); // Mostrar los primeros 5
        } else {
          setMatches([]);
          console.warn('⚠️ No matches found');
        }

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        console.error('❌ Error loading featured matches:', err);
        setError(errorMessage);
        setMatches([]);
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, []);

  // Estado: CARGANDO
  if (loading) {
    return (
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8">Partidos Destacados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-800 rounded-lg p-4 animate-pulse h-48"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Estado: ERROR
  if (error) {
    return (
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8">Partidos Destacados</h2>
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 text-red-200">
            <p className="font-semibold">❌ Error al cargar los partidos</p>
            <p className="text-sm mt-2">{error}</p>
            <p className="text-xs mt-4 text-red-300">
              💡 Verifica que el backend esté corriendo en http://localhost:3001
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Estado: SIN PARTIDOS
  if (matches.length === 0) {
    return (
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8">Partidos Destacados</h2>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 text-center">
            <p className="text-gray-300">No hay partidos disponibles en este momento</p>
          </div>
        </div>
      </section>
    );
  }

  // Estado: ÉXITO - Mostrar partidos
  return (
    <section className="py-12 px-4 bg-gradient-to-b from-gray-900 via-gray-900 to-black">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">Partidos Destacados</h2>
          <span className="text-green-400 text-sm font-mono">
            {matches.length} partidos
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match, index) => (
            <MatchCard key={`${match.id}-${index}`} match={match} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <a
            href="/partidos"
            className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
          >
            Ver todos los partidos →
          </a>
        </div>
      </div>
    </section>
  );
}