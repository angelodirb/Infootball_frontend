/*FeaturedMatches */
'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MatchCard from './MatchCard';
import { mockMatches, mockDates } from '@/lib/mockData';

export default function FeaturedMatches() {
  const [selectedDateIndex, setSelectedDateIndex] = useState(3); // Índice de "Hoy"
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filtrar partidos por fecha seleccionada
  const selectedDate = mockDates[selectedDateIndex];
  const filteredMatches = mockMatches.filter(
    match => match.date === selectedDate.value
  );

  // Funciones de navegación
  const handlePrevDate = () => {
    if (selectedDateIndex > 0) {
      setSelectedDateIndex(selectedDateIndex - 1);
    }
  };

  const handleNextDate = () => {
    if (selectedDateIndex < mockDates.length - 1) {
      setSelectedDateIndex(selectedDateIndex + 1);
    }
  };

  // Auto-scroll al botón seleccionado
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const selectedButton = container.children[selectedDateIndex] as HTMLElement;
      
      if (selectedButton) {
        const containerWidth = container.offsetWidth;
        const buttonLeft = selectedButton.offsetLeft;
        const buttonWidth = selectedButton.offsetWidth;
        
        container.scrollTo({
          left: buttonLeft - containerWidth / 2 + buttonWidth / 2,
          behavior: 'smooth'
        });
      }
    }
  }, [selectedDateIndex]);

  return (
    <section className="bg-white rounded-xl p-6 md:p-8 shadow-lg">
      {/* Título */}
      <h2 className="text-3xl md:text-4xl font-black mb-8 uppercase tracking-tight text-gray-900">
        Destacado
      </h2>

      {/* Navegación de fechas */}
      <div className="flex items-center gap-3 mb-8">
        <button 
          onClick={handlePrevDate}
          disabled={selectedDateIndex === 0}
          className={`p-3 rounded-full transition-all duration-200 ${
            selectedDateIndex === 0 
              ? 'text-gray-300 cursor-not-allowed bg-gray-100' 
              : 'hover:bg-gray-200 text-gray-700 active:scale-95'
          }`}
          aria-label="Fecha anterior"
        >
          <ChevronLeft size={24} strokeWidth={2.5} />
        </button>

        <div 
          ref={scrollContainerRef}
          className="flex gap-2 flex-1 overflow-x-auto pb-2 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {mockDates.map((date, index) => (
            <button
              key={index}
              onClick={() => setSelectedDateIndex(index)}
              className={`px-5 py-3 rounded-lg font-bold text-sm uppercase whitespace-nowrap transition-all duration-200 ${
                selectedDateIndex === index
                  ? 'bg-gray-900 text-white shadow-lg scale-105'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 active:scale-95'
              }`}
            >
              {date.label}
            </button>
          ))}
        </div>

        <button 
          onClick={handleNextDate}
          disabled={selectedDateIndex === mockDates.length - 1}
          className={`p-3 rounded-full transition-all duration-200 ${
            selectedDateIndex === mockDates.length - 1
              ? 'text-gray-300 cursor-not-allowed bg-gray-100' 
              : 'hover:bg-gray-200 text-gray-700 active:scale-95'
          }`}
          aria-label="Fecha siguiente"
        >
          <ChevronRight size={24} strokeWidth={2.5} />
        </button>
      </div>

      {/* Grid de partidos */}
      {filteredMatches.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
          {filteredMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-500 bg-gray-50 rounded-xl">
          <div className="text-6xl mb-4">📅</div>
          <p className="text-lg font-semibold">No hay partidos programados para esta fecha</p>
          <p className="text-sm mt-2">Selecciona otra fecha para ver más partidos</p>
        </div>
      )}
    </section>
  );
}
