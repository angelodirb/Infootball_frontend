// Frontend - lib/api.ts - CORREGIDO

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// Helper para manejar errores
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error en la petición' }));
    throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
};

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// MATCHES API - ESTRUCTURA CORREGIDA
export const matchesApi = {
  // Obtener todos los partidos
  getAll: async () => {
    const response = await fetch(`${API_URL}/matches`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },
  
  // Obtener partidos en vivo  
  getLive: async () => {
    const response = await fetch(`${API_URL}/matches/live`);
    return handleResponse(response);
  },
  
  // Obtener partidos por fecha específica
  getByDate: async (date: string) => {
    const response = await fetch(`${API_URL}/matches/date?date=${date}`);
    return handleResponse(response);
  },
  
  // Obtener partidos destacados - MÉTODO CORREGIDO
  getFeatured: async () => {
    const response = await fetch(`${API_URL}/matches/featured`);
    return handleResponse(response);
  },
  
  // Test de conexión API
  testApi: async () => {
    const response = await fetch(`${API_URL}/matches/test-api`);
    return handleResponse(response);
  },
  
  // Por ID
  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/matches/${id}`);
    return handleResponse(response);
  },
  
  // Por equipo
  getByTeam: async (teamId: string) => {
    const response = await fetch(`${API_URL}/matches/team/${teamId}`);
    return handleResponse(response);
  }
};

// COMPETITIONS API
export const competitionsApi = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/competitions`);
    return handleResponse(response);
  },
  
  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/competitions/${id}`);
    return handleResponse(response);
  },
  
  getActive: async () => {
    const response = await fetch(`${API_URL}/competitions/active`);
    return handleResponse(response);
  },
  
  getBySlug: async (slug: string) => {
    const response = await fetch(`${API_URL}/competitions/slug/${slug}`);
    return handleResponse(response);
  }
};

// NEWS API
export const newsApi = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/news`);
    return handleResponse(response);
  },
  
  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/news/${id}`);
    return handleResponse(response);
  },
  
  getByCategory: async (category: string) => {
    const response = await fetch(`${API_URL}/news/category/${category}`);
    return handleResponse(response);
  },
  
  search: async (query: string) => {
    const response = await fetch(`${API_URL}/news/search?q=${encodeURIComponent(query)}`);
    return handleResponse(response);
  }
};

// TEAMS API
export const teamsApi = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/teams`);
    return handleResponse(response);
  },
  
  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/teams/${id}`);
    return handleResponse(response);
  },
  
  search: async (query: string) => {
    const response = await fetch(`${API_URL}/teams/search?q=${encodeURIComponent(query)}`);
    return handleResponse(response);
  },
  
  getByCompetition: async (competitionId: string) => {
    const response = await fetch(`${API_URL}/teams/competition/${competitionId}`);
    return handleResponse(response);
  }
};

// TRANSFERS API
export const transfersApi = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/transfers`);
    return handleResponse(response);
  },
  
  getTop: async (limit: number = 10) => {
    const response = await fetch(`${API_URL}/transfers/top?limit=${limit}`);
    return handleResponse(response);
  },
  
  getBySeason: async (season: string) => {
    const response = await fetch(`${API_URL}/transfers/season/${season}`);
    return handleResponse(response);
  },
  
  getByPlayer: async (playerId: string) => {
    const response = await fetch(`${API_URL}/transfers/player/${playerId}`);
    return handleResponse(response);
  }
};

// PLAYERS API
export const playersApi = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/players`);
    return handleResponse(response);
  },
  
  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/players/${id}`);
    return handleResponse(response);
  },
  
  search: async (query: string) => {
    const response = await fetch(`${API_URL}/players/search?q=${encodeURIComponent(query)}`);
    return handleResponse(response);
  },
  
  getTopValue: async (limit: number = 10) => {
    const response = await fetch(`${API_URL}/players/top-value?limit=${limit}`);
    return handleResponse(response);
  },
  
  getByTeam: async (teamId: string) => {
    const response = await fetch(`${API_URL}/players/team/${teamId}`);
    return handleResponse(response);
  }
};

// AUTH API
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  register: async (data: { firstName: string; lastName: string; email: string; password: string }) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  }
};

// Exportación por defecto para compatibilidad
export default {
  matchesApi,
  competitionsApi,
  newsApi,
  teamsApi,
  transfersApi,
  playersApi,
  authApi
};