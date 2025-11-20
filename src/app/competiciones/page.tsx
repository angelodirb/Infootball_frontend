'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { competitionsApi } from '../../../lib/api';

interface Competition {
  id: number;
  name: string;
  country: string;
  countryFlag?: string;
  type: string;
  logo: string;
  season: string;
  isActive: boolean;
}

interface CompetitionType {
  name: string;
  icon: string;
}

const competitionTypes: CompetitionType[] = [
  { name: "Todas", icon: "🌍" },
  { name: "league", icon: "🏆" },
  { name: "cup", icon: "🏅" },
];

// Mapeo de colores por liga conocida
const getCompetitionColor = (name: string): string => {
  const colors: Record<string, string> = {
    'Premier League': 'from-purple-600 to-purple-800',
    'La Liga': 'from-red-600 to-orange-600',
    'Serie A': 'from-blue-600 to-blue-800',
    'Bundesliga': 'from-red-600 to-red-800',
    'Ligue 1': 'from-blue-500 to-blue-700',
    'UEFA Champions League': 'from-blue-800 to-indigo-900',
    'Copa Libertadores': 'from-green-600 to-green-800',
  };
  return colors[name] || 'from-gray-600 to-gray-800';
};

// Ligas destacadas (IDs de API-FOOTBALL)
const featuredLeagueIds = [39, 140, 135, 78, 61, 2]; // Premier, La Liga, Serie A, Bundesliga, Ligue 1, Champions

export default function CompeticionesPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState("Todas");
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    const loadCompetitions = async () => {
      setIsLoading(true);
      try {
        const data = await competitionsApi.getAll();
        setCompetitions(data);
        setError(null);
      } catch (err) {
        setError('Error al cargar las competiciones');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCompetitions();
  }, []);

  const filteredCompetitions = selectedType === "Todas"
    ? competitions
    : competitions.filter(comp => comp.type === selectedType);

  const featuredCompetitions = filteredCompetitions.filter(comp =>
    featuredLeagueIds.includes(comp.id)
  );
  const regularCompetitions = filteredCompetitions.filter(comp =>
    !featuredLeagueIds.includes(comp.id)
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando competiciones...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-green-500 text-black px-6 py-3 rounded-lg font-bold hover:bg-green-400 transition"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white">

      {/* Hero Section - Competiciones Destacadas */}
      <section className="relative pt-8 pb-12 px-4 overflow-hidden">
        {/* Efecto de fondo */}
        <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 via-transparent to-transparent"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-8 bg-gradient-to-b from-green-400 to-green-600 rounded-full"></div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                  Competiciones
                </span>
              </h1>
            </div>
            <p className="text-gray-400 text-lg ml-5">Las principales ligas y torneos del mundo</p>
          </div>

          {/* Competiciones Destacadas */}
          {featuredCompetitions.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCompetitions.map((comp) => (
                <Link href={`/competiciones/${comp.id}`} key={comp.id}>
                  <div
                    className="group relative cursor-pointer transform transition-all duration-500 hover:scale-[1.02]"
                    onMouseEnter={() => setHoveredCard(comp.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    {/* Card Container */}
                    <div className="relative h-[300px] overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-950 shadow-2xl">
                      {/* Background decorativo */}
                      <div className="absolute inset-0">
                        <div className={`w-full h-full bg-gradient-to-br ${getCompetitionColor(comp.name)} opacity-40`}></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
                      </div>

                      {/* Badge de tipo */}
                      <div className="absolute top-6 left-6 z-10">
                        <span className="inline-flex items-center gap-2 bg-green-500 text-black text-sm font-bold px-4 py-2 rounded-full shadow-lg shadow-green-500/50">
                          <span className="w-2 h-2 bg-black rounded-full animate-pulse"></span>
                          {comp.type}
                        </span>
                      </div>

                      {/* Badge de temporada */}
                      <div className="absolute top-6 right-6 z-10">
                        <span className="bg-black/70 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full border border-gray-700">
                          {comp.season}
                        </span>
                      </div>

                      {/* Contenido */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                        {/* Logo y país */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-16 h-16 bg-gray-800/50 rounded-lg flex items-center justify-center overflow-hidden">
                            {comp.logo ? (
                              <Image
                                src={comp.logo}
                                alt={comp.name}
                                width={48}
                                height={48}
                                className="object-contain"
                              />
                            ) : (
                              <span className="text-3xl">🏆</span>
                            )}
                          </div>
                          <div>
                            <h2 className="text-2xl md:text-3xl font-black leading-tight transform transition-all duration-300 group-hover:text-green-400">
                              {comp.name}
                            </h2>
                            <p className="text-gray-400 text-sm flex items-center gap-2">
                              {comp.countryFlag && (
                                <Image src={comp.countryFlag} alt={comp.country} width={16} height={12} />
                              )}
                              {comp.country}
                            </p>
                          </div>
                        </div>

                        {/* Ver más */}
                        <div className="flex items-center gap-2 text-green-400 font-semibold text-sm group-hover:gap-4 transition-all duration-300">
                          <span>Ver tabla y estadísticas</span>
                          <span className={`text-lg transform transition-transform duration-300 ${hoveredCard === comp.id ? 'translate-x-2' : ''}`}>
                            ➜
                          </span>
                        </div>
                      </div>

                      {/* Borde brillante */}
                      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-green-500/50 transition-colors duration-300"></div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Filtros de Tipo */}
      <section className="sticky top-0 z-20 backdrop-blur-xl bg-black/80 border-y border-gray-800/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {competitionTypes.map((type) => (
              <button
                key={type.name}
                onClick={() => setSelectedType(type.name)}
                className={`group relative px-6 py-3 rounded-xl whitespace-nowrap font-bold text-sm transition-all duration-300 transform hover:scale-105 ${
                  selectedType === type.name
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-black shadow-lg shadow-green-500/50'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700/50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-lg">{type.icon}</span>
                  {type.name === 'Todas' ? 'Todas' : type.name === 'league' ? 'Ligas' : 'Copas'}
                </span>
                {selectedType === type.name && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-400 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid de Competiciones */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header de sección */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-green-400 to-green-600 rounded-full"></div>
              <h2 className="text-3xl md:text-4xl font-black">
                {selectedType === "Todas" ? "Todas las Competiciones" : `Competiciones - ${selectedType === 'league' ? 'Ligas' : 'Copas'}`}
              </h2>
            </div>
            <div className="text-sm text-gray-400">
              {regularCompetitions.length} {regularCompetitions.length === 1 ? 'competición' : 'competiciones'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularCompetitions.map((comp) => (
              <Link href={`/competiciones/${comp.id}`} key={comp.id}>
                <div className="group h-full bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl overflow-hidden border border-gray-800 hover:border-green-500/50 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-green-500/10">

                  {/* Header con logo */}
                  <div className="relative h-40 overflow-hidden">
                    <div className={`w-full h-full bg-gradient-to-br ${getCompetitionColor(comp.name)} opacity-40`}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

                    {/* Logo */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {comp.logo ? (
                        <Image
                          src={comp.logo}
                          alt={comp.name}
                          width={80}
                          height={80}
                          className="object-contain"
                        />
                      ) : (
                        <span className="text-6xl">🏆</span>
                      )}
                    </div>

                    {/* Badge de tipo */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-green-500 text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                        {comp.type}
                      </span>
                    </div>

                    {/* Temporada */}
                    <div className="absolute top-3 right-3">
                      <span className="bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                        {comp.season}
                      </span>
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="p-5">
                    {/* Nombre y país */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold mb-1 group-hover:text-green-400 transition-colors">
                        {comp.name}
                      </h3>
                      <p className="text-sm text-gray-400 flex items-center gap-2">
                        {comp.countryFlag && (
                          <Image src={comp.countryFlag} alt={comp.country} width={16} height={12} />
                        )}
                        {comp.country}
                      </p>
                    </div>

                    {/* Ver competición */}
                    <div className="flex items-center gap-2 text-green-400 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span>Ver tabla completa</span>
                      <span className="text-base">▶</span>
                    </div>
                  </div>

                  {/* Borde inferior */}
                  <div className="h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </Link>
            ))}
          </div>

          {filteredCompetitions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No se encontraron competiciones</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
