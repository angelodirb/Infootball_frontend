'use client';

export default function HeroBanner() {
  return (
    <div className="mb-10">
      <div 
        className="relative w-full h-[280px] rounded-xl overflow-hidden shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, #0f2557 0%, #1e40af 30%, #3b82f6 70%, #1e40af 100%)'
        }}
      >
        {/* Decoración de fondo - Globo terráqueo estilizado */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden opacity-30">
          {/* Círculo principal */}
          <div className="w-[450px] h-[450px] rounded-full border-[6px] border-white/30 absolute"></div>
          {/* Líneas horizontales del globo */}
          <div className="w-[450px] h-[450px] absolute">
            <div className="absolute top-1/4 left-0 w-full h-[3px] bg-white/20"></div>
            <div className="absolute top-1/2 left-0 w-full h-[3px] bg-white/25"></div>
            <div className="absolute top-3/4 left-0 w-full h-[3px] bg-white/20"></div>
          </div>
          {/* Líneas verticales del globo */}
          <div className="w-[450px] h-[450px] absolute">
            <div className="absolute left-1/4 top-0 h-full w-[3px] bg-white/20"></div>
            <div className="absolute left-1/2 top-0 h-full w-[3px] bg-white/25"></div>
            <div className="absolute left-3/4 top-0 h-full w-[3px] bg-white/20"></div>
          </div>
        </div>

        {/* Contenido del banner */}
        <div className="relative h-full flex items-center justify-center px-6 md:px-12 z-10">
          {/* Texto principal con borde */}
          <div className="max-w-4xl">
            <h2 className="text-white text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold uppercase tracking-wide text-center border-4 border-white px-6 md:px-10 py-4 md:py-6 shadow-2xl backdrop-blur-sm bg-black/10">
              Consulta los jugadores más valiosos del mundo
            </h2>
          </div>

          {/* Imágenes de jugadores - Placeholders con mejor diseño */}
          <div className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 hidden xl:flex gap-4 items-center">
            {/* Jugador 1 */}
            <div className="relative group">
              <div className="w-24 h-28 bg-gradient-to-br from-blue-400/40 to-blue-600/40 rounded-xl backdrop-blur-sm border-2 border-white/40 shadow-xl transform group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
                <span className="text-5xl">⚽</span>
              </div>
            </div>
            
            {/* Jugador 2 - Central (más grande) */}
            <div className="relative group">
              <div className="w-28 h-32 bg-gradient-to-br from-blue-500/50 to-blue-700/50 rounded-xl backdrop-blur-sm border-3 border-white/50 shadow-2xl transform group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
                <span className="text-6xl">🏆</span>
              </div>
            </div>
            
            {/* Jugador 3 */}
            <div className="relative group">
              <div className="w-24 h-28 bg-gradient-to-br from-blue-400/40 to-blue-600/40 rounded-xl backdrop-blur-sm border-2 border-white/40 shadow-xl transform group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
                <span className="text-5xl">⭐</span>
              </div>
            </div>
          </div>
        </div>

        {/* Efecto de brillo animado */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-700"></div>
      </div>
    </div>
  );
}
