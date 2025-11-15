// ✅ API CLIENT COMPLETO
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Helper para manejar errores
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API Error');
  }
  return response.json();
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// MATCHES
export const matchesApi = {
  getAll: () => fetch(`${API_URL}/matches`, {headers: getAuthHeaders()}).then(handleResponse),
  getById: (id: number) => fetch(`${API_URL}/matches/${id}`).then(handleResponse),
  getByDate: (date: string) => fetch(`${API_URL}/matches?date=${date}`).then(handleResponse),
  getLive: () => fetch(`${API_URL}/matches/live`).then(handleResponse),
};

// COMPETITIONS
export const competitionsApi = {
  getAll: () => fetch(`${API_URL}/competitions`).then(handleResponse),
  getById: (id: number) => fetch(`${API_URL}/competitions/${id}`).then(handleResponse),
  getStandings: (id: number) => fetch(`${API_URL}/competitions/${id}/standings`).then(handleResponse),
};

// NEWS
export const newsApi = {
  getAll: () => fetch(`${API_URL}/news`).then(handleResponse),
  getById: (id: number) => fetch(`${API_URL}/news/${id}`).then(handleResponse),
  getByCategory: (category: string) => fetch(`${API_URL}/news?category=${category}`).then(handleResponse),
};

// TRANSFERS
export const transfersApi = {
  getAll: () => fetch(`${API_URL}/transfers`).then(handleResponse),
  getFeatured: () => fetch(`${API_URL}/transfers/featured`).then(handleResponse),
};

// AUTH
export const authApi = {
  login: (email: string, password: string) =>
    fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }).then(handleResponse),
  
  register: (data: any) =>
    fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
};