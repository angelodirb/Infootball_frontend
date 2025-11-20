// lib/api.ts - VERSIÓN FINAL CON getByDateRange
// ================================================

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

/**
 * Helper para manejar respuestas de API
 */
const handleResponse = async (response: Response) => {
  console.log(`API Response Status: ${response.status}`);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ 
      message: 'Error en la petición' 
    }));
    throw new Error(errorData.message || `HTTP ${response.status}`);
  }
  
  return response.json();
};

/**
 * Obtener headers con autenticación
 */
const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' 
    ? localStorage.getItem('token') 
    : null;
  
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

/**
 * ============================================
 * API DE AUTENTICACIÓN
 * ============================================
 */
export const authApi = {
  /**
   * Registrar un nuevo usuario
   * POST /api/v1/auth/register
   */
  register: async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    try {
      console.log('📝 Registering user:', data.email);
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await handleResponse(response);
      console.log('✅ Registration successful');
      
      if (result.token) {
        localStorage.setItem('token', result.token);
      }
      if (result.access_token) {
        localStorage.setItem('token', result.access_token);
      }
      
      return result;
    } catch (error) {
      console.error('❌ Registration error:', error);
      throw error;
    }
  },

  /**
   * Login de usuario
   * POST /api/v1/auth/login
   */
  login: async (email: string, password: string) => {
    try {
      console.log('🔐 Logging in user:', email);
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const result = await handleResponse(response);
      console.log('✅ Login successful');
      
      if (result.token) {
        localStorage.setItem('token', result.token);
      }
      if (result.access_token) {
        localStorage.setItem('token', result.access_token);
      }
      
      return result;
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  },

  /**
   * Logout de usuario
   */
  logout: () => {
    try {
      console.log('🚪 Logging out...');
      localStorage.removeItem('token');
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout error:', error);
      throw error;
    }
  },

  /**
   * Obtener token actual
   */
  getToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  },

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated: () => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('token');
    }
    return false;
  },
};

/**
 * ============================================
 * API DE PARTIDOS ⭐ ACTUALIZADA CON getByDateRange
 * ============================================
 */
export const matchesApi = {
  /**
   * Obtener TODOS los partidos
   * GET /api/v1/matches
   */
  getAll: async () => {
    try {
      console.log('📍 Fetching all matches from:', `${API_URL}/matches`);
      const response = await fetch(`${API_URL}/matches`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('❌ Error fetching all matches:', error);
      throw error;
    }
  },

  /**
   * Obtener partidos EN VIVO
   * GET /api/v1/matches/live
   */
  getLive: async () => {
    try {
      console.log('🔴 Fetching live matches from:', `${API_URL}/matches/live`);
      const response = await fetch(`${API_URL}/matches/live`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('❌ Error fetching live matches:', error);
      throw error;
    }
  },

  /**
   * Obtener partidos por FECHA
   * GET /api/v1/matches/date?date=YYYY-MM-DD
   */
  getByDate: async (date: string) => {
    try {
      console.log('📅 Fetching matches for date:', date);
      const response = await fetch(`${API_URL}/matches/date?date=${date}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`❌ Error fetching matches for ${date}:`, error);
      throw error;
    }
  },

  /**
   * Obtener partidos por RANGO DE FECHAS ⭐ NUEVO
   * GET /api/v1/matches/range?from=YYYY-MM-DD&to=YYYY-MM-DD
   * 
   * Ejemplo:
   * const matches = await matchesApi.getByDateRange('2025-11-01', '2025-11-30');
   */
  getByDateRange: async (from: string, to: string) => {
    try {
      console.log('📅 Fetching matches from', from, 'to', to);
      const response = await fetch(`${API_URL}/matches/date?start=${from}&end=${to}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`❌ Error fetching matches in date range:`, error);
      throw error;
    }
  },

  /**
   * Obtener partidos DESTACADOS
   * GET /api/v1/matches/featured
   */
  getFeatured: async () => {
    try {
      console.log('⭐ Fetching featured matches...');
      
      try {
        const response = await fetch(`${API_URL}/matches/featured`, {
          method: 'GET',
          headers: getAuthHeaders(),
        });
        
        if (!response.ok) {
          throw new Error('featured endpoint not available');
        }
        
        return await handleResponse(response);
        
      } catch (error) {
        console.warn('⚠️ /matches/featured not found, using /matches/live as fallback');
        return await matchesApi.getLive();
      }
      
    } catch (error) {
      console.error('❌ Error fetching featured matches:', error);
      throw error;
    }
  },

  /**
   * Test del endpoint
   * GET /api/v1/matches/test-api
   */
  testApi: async () => {
    try {
      console.log('🧪 Testing API connection...');
      const response = await fetch(`${API_URL}/matches/test-api`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('❌ Error testing API:', error);
      throw error;
    }
  },

  /**
   * Obtener partido por ID
   * GET /api/v1/matches/:id
   */
  getById: async (id: string) => {
    try {
      console.log('🎯 Fetching match by ID:', id);
      const response = await fetch(`${API_URL}/matches/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`❌ Error fetching match ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obtener partidos de un EQUIPO
   * GET /api/v1/matches/team/:teamId
   */
  getByTeam: async (teamId: string) => {
    try {
      console.log('👥 Fetching matches for team:', teamId);
      const response = await fetch(`${API_URL}/matches/team/${teamId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`❌ Error fetching matches for team ${teamId}:`, error);
      throw error;
    }
  },
};

/**
 * ============================================
 * API DE COMPETICIONES
 * ============================================
 */
export const competitionsApi = {
  /**
   * Obtener TODAS las competiciones
   * GET /api/v1/competitions
   */
  getAll: async () => {
    try {
      console.log('📊 Fetching all competitions');
      const response = await fetch(`${API_URL}/competitions`, {
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('❌ Error fetching competitions:', error);
      throw error;
    }
  },

  /**
   * Obtener competición por ID
   * GET /api/v1/competitions/:id
   */
  getById: async (id: string) => {
    try {
      console.log('📊 Fetching competition by ID:', id);
      const response = await fetch(`${API_URL}/competitions/${id}`, {
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`❌ Error fetching competition ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obtener competición por SLUG
   * GET /api/v1/competitions/slug/:slug
   */
  getBySlug: async (slug: string) => {
    try {
      console.log('📊 Fetching competition by slug:', slug);
      const response = await fetch(`${API_URL}/competitions/slug/${slug}`, {
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`❌ Error fetching competition by slug:`, error);
      throw error;
    }
  },

  /**
   * Obtener competiciones ACTIVAS
   * GET /api/v1/competitions/active
   */
  getActive: async () => {
    try {
      console.log('📊 Fetching active competitions');
      const response = await fetch(`${API_URL}/competitions/active`, {
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('❌ Error fetching active competitions:', error);
      throw error;
    }
  },
};

/**
 * ============================================
 * API DE NOTICIAS
 * ============================================
 */
export const newsApi = {
  /**
   * Obtener TODAS las noticias
   * GET /api/v1/news
   */
  getAll: async () => {
    try {
      console.log('📰 Fetching all news');
      const response = await fetch(`${API_URL}/news`, {
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('❌ Error fetching news:', error);
      throw error;
    }
  },

  /**
   * Obtener noticia por ID
   * GET /api/v1/news/:id
   */
  getById: async (id: string) => {
    try {
      console.log('📰 Fetching news by ID:', id);
      const response = await fetch(`${API_URL}/news/${id}`, {
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`❌ Error fetching news ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obtener noticias por CATEGORÍA
   * GET /api/v1/news/category/:category
   */
  getByCategory: async (category: string) => {
    try {
      console.log('📰 Fetching news by category:', category);
      const response = await fetch(`${API_URL}/news/category/${category}`, {
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`❌ Error fetching news by category:`, error);
      throw error;
    }
  },

  /**
   * Buscar noticias
   * GET /api/v1/news/search?q=query
   */
  search: async (query: string) => {
    try {
      console.log('📰 Searching news:', query);
      const response = await fetch(`${API_URL}/news/search?q=${query}`, {
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`❌ Error searching news:`, error);
      throw error;
    }
  },
};

/**
 * ============================================
 * API DE EQUIPOS
 * ============================================
 */
export const teamsApi = {
  /**
   * Obtener TODOS los equipos
   * GET /api/v1/teams
   */
  getAll: async () => {
    try {
      console.log('👥 Fetching all teams');
      const response = await fetch(`${API_URL}/teams`, {
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('❌ Error fetching teams:', error);
      throw error;
    }
  },

  /**
   * Obtener equipo por ID
   * GET /api/v1/teams/:id
   */
  getById: async (id: string) => {
    try {
      console.log('👥 Fetching team by ID:', id);
      const response = await fetch(`${API_URL}/teams/${id}`, {
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`❌ Error fetching team ${id}:`, error);
      throw error;
    }
  },

  /**
   * Buscar equipos
   * GET /api/v1/teams/search?q=query
   */
  search: async (query: string) => {
    try {
      console.log('👥 Searching teams:', query);
      const response = await fetch(`${API_URL}/teams/search?q=${query}`, {
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`❌ Error searching teams:`, error);
      throw error;
    }
  },
};

/**
 * ============================================
 * API DE JUGADORES
 * ============================================
 */
export const playersApi = {
  /**
   * Obtener TODOS los jugadores
   * GET /api/v1/players
   */
  getAll: async () => {
    try {
      console.log('🎽 Fetching all players');
      const response = await fetch(`${API_URL}/players`, {
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('❌ Error fetching players:', error);
      throw error;
    }
  },

  /**
   * Obtener jugador por ID
   * GET /api/v1/players/:id
   */
  getById: async (id: string) => {
    try {
      console.log('🎽 Fetching player by ID:', id);
      const response = await fetch(`${API_URL}/players/${id}`, {
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`❌ Error fetching player ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obtener jugadores de un equipo
   * GET /api/v1/players/team/:teamId
   */
  getByTeam: async (teamId: string) => {
    try {
      console.log('🎽 Fetching players for team:', teamId);
      const response = await fetch(`${API_URL}/players/team/${teamId}`, {
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`❌ Error fetching players for team:`, error);
      throw error;
    }
  },
};

/**
 * ============================================
 * API DE FICHAJES (TRANSFERS)
 * ============================================
 */
export const transfersApi = {
  /**
   * Obtener TODOS los fichajes
   * GET /api/v1/transfers
   */
  getAll: async () => {
    try {
      console.log('💰 Fetching all transfers');
      const response = await fetch(`${API_URL}/transfers`, {
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('❌ Error fetching transfers:', error);
      throw error;
    }
  },

  /**
   * Obtener TOP fichajes
   * GET /api/v1/transfers/top?limit=10
   */
  getTop: async (limit: number = 10) => {
    try {
      console.log('💰 Fetching top transfers');
      const response = await fetch(`${API_URL}/transfers/top?limit=${limit}`, {
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('❌ Error fetching top transfers:', error);
      throw error;
    }
  },

  /**
   * Obtener fichajes por TEMPORADA
   * GET /api/v1/transfers/season/:season
   */
  getBySeason: async (season: string) => {
    try {
      console.log('💰 Fetching transfers for season:', season);
      const response = await fetch(`${API_URL}/transfers/season/${season}`, {
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`❌ Error fetching transfers for season:`, error);
      throw error;
    }
  },
};