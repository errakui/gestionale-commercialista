import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Aggiungi token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Gestisci 401 - DISABILITATO REDIRECT
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      // DISABILITATO: Non fare redirect automatico
      // Lascia che l'utente veda gli errori
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials: { username: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
    }
    return response;
  },
  logout: () => {
    localStorage.removeItem('access_token');
    return api.post('/auth/logout');
  },
  me: () => api.get('/auth/me'),
};

// Clienti API
export const clientiAPI = {
  getAll: (filters?: any) => api.get('/clienti', { params: filters }),
  getOne: (id: number) => api.get(`/clienti/${id}`),
  getStatistics: (id: number, year?: number) =>
    api.get(`/clienti/${id}/statistics`, { params: { year } }),
  create: (data: any) => api.post('/clienti', data),
  update: (id: number, data: any) => api.put(`/clienti/${id}`, data),
  delete: (id: number) => api.delete(`/clienti/${id}`),
};

// Scadenze API
export const scadenzeAPI = {
  getAll: (filters?: any) => api.get('/scadenze', { params: filters }),
  getOne: (id: number) => api.get(`/scadenze/${id}`),
  getImminenti: (giorni?: number) =>
    api.get('/scadenze/imminenti', { params: { giorni } }),
  create: (data: any) => api.post('/scadenze', data),
  update: (id: number, data: any) => api.put(`/scadenze/${id}`, data),
  complete: (id: number, data?: any) => api.post(`/scadenze/${id}/complete`, data),
  delete: (id: number) => api.delete(`/scadenze/${id}`),
};

// Movimenti API
export const movimentiAPI = {
  getAll: (filters?: any) => api.get('/movimenti', { params: filters }),
  getSummary: (filters?: any) => api.get('/movimenti/summary', { params: filters }),
  getStatistics: (filters?: any) =>
    api.get('/movimenti/statistics', { params: filters }),
  getOne: (id: number) => api.get(`/movimenti/${id}`),
  create: (data: any) => api.post('/movimenti', data),
  update: (id: number, data: any) => api.put(`/movimenti/${id}`, data),
  delete: (id: number) => api.delete(`/movimenti/${id}`),
};

// Note API
export const noteAPI = {
  getAll: (filters?: any) => api.get('/note', { params: filters }),
  getOne: (id: number) => api.get(`/note/${id}`),
  create: (data: any) => api.post('/note', data),
  update: (id: number, data: any) => api.put(`/note/${id}`, data),
  delete: (id: number) => api.delete(`/note/${id}`),
};

// Dashboard API
export const dashboardAPI = {
  getKPI: () => api.get('/dashboard/kpi'),
  getSummary: () => api.get('/dashboard/summary'),
  getAlerts: () => api.get('/dashboard/alerts'),
  getScadenzeImminenti: (giorni: number) => api.get(`/dashboard/scadenze-imminenti?giorni=${giorni}`),
  getScadenzeScadute: () => api.get('/dashboard/scadenze-scadute'),
  getFlussiCassa: () => api.get('/dashboard/flussi-cassa'),
  getUltimiMovimenti: (limit: number) => api.get(`/dashboard/ultimi-movimenti?limit=${limit}`),
};

// Impostazioni API
export const impostazioniAPI = {
  getTemplates: () => api.get('/impostazioni/templates'),
  getTemplate: (id: number) => api.get(`/impostazioni/templates/${id}`),
  createTemplate: (data: any) => api.post('/impostazioni/templates', data),
  updateTemplate: (id: number, data: any) =>
    api.put(`/impostazioni/templates/${id}`, data),
  deleteTemplate: (id: number) => api.delete(`/impostazioni/templates/${id}`),

  getCategorie: () => api.get('/impostazioni/categorie'),
  getCategoria: (id: number) => api.get(`/impostazioni/categorie/${id}`),
  createCategoria: (data: any) => api.post('/impostazioni/categorie', data),
  updateCategoria: (id: number, data: any) =>
    api.put(`/impostazioni/categorie/${id}`, data),
  deleteCategoria: (id: number) => api.delete(`/impostazioni/categorie/${id}`),
};

// Servizi API
export const serviziAPI = {
  getAll: (attivo?: boolean) => api.get('/servizi', { params: { attivo } }),
  getOne: (id: number) => api.get(`/servizi/${id}`),
  create: (data: any) => api.post('/servizi', data),
  update: (id: number, data: any) => api.put(`/servizi/${id}`, data),
  delete: (id: number) => api.delete(`/servizi/${id}`),
  generaMovimento: (data: any) => api.post('/servizi/genera-movimento', data),
};

// Export API
export const exportAPI = {
  exportClienti: (format: 'csv' | 'excel') =>
    api.get(`/export/clienti?format=${format}`, { responseType: 'blob' }),
  exportScadenze: (filters: any, format: 'csv' | 'excel') =>
    api.get(`/export/scadenze?format=${format}`, {
      params: filters,
      responseType: 'blob',
    }),
  exportMovimenti: (filters: any, format: 'csv' | 'excel') =>
    api.get(`/export/movimenti?format=${format}`, {
      params: filters,
      responseType: 'blob',
    }),
};
