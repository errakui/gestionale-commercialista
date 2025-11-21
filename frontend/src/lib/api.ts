import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: false, // ✅ NON SERVE PIÙ - SOLO BEARER TOKEN
  headers: {
    'Content-Type': 'application/json',
  },
});

// Aggiungi token automaticamente
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('🔑 Token aggiunto alla richiesta:', config.url);
      } else {
        console.warn('⚠️ Token mancante per richiesta:', config.url);
      }
    }
    return config;
  },
  (error) => {
    console.error('❌ Errore request interceptor:', error);
    return Promise.reject(error);
  }
);

// Gestisci 401 con redirect al login
api.interceptors.response.use(
  (response) => {
    console.log('✅ Risposta OK:', response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Errore risposta:', error.config?.url, error.response?.status);
    
    if (error.response?.status === 401) {
      console.warn('🔒 401 Unauthorized - Redirect al login');
      localStorage.removeItem('access_token');
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
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
  getMiglioriClienti: (anno?: number) => api.get('/dashboard/migliori-clienti', { params: { anno } }),
  getSpesePrincipali: (anno?: number) => api.get('/dashboard/spese-principali', { params: { anno } }),
};

// Impostazioni API
export const impostazioniAPI = {
  getGenerali: () => api.get('/impostazioni/generali'),
  updateGenerali: (data: any) => api.put('/impostazioni/generali', data),
  
  getTemplates: () => api.get('/impostazioni/template-scadenze'),
  getTemplate: (id: number) => api.get(`/impostazioni/template-scadenze/${id}`),
  createTemplate: (data: any) => api.post('/impostazioni/template-scadenze', data),
  updateTemplate: (id: number, data: any) =>
    api.put(`/impostazioni/template-scadenze/${id}`, data),
  deleteTemplate: (id: number) => api.delete(`/impostazioni/template-scadenze/${id}`),

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
  exportMandato: (data: any) =>
    api.post('/export/mandato', data, { responseType: 'blob' }),
};

// Mandati API
export const mandatiAPI = {
  getAll: () => api.get('/mandati'),
  getOne: (id: number) => api.get(`/mandati/${id}`),
  create: (data: any) => api.post('/mandati', data),
  update: (id: number, data: any) => api.put(`/mandati/${id}`, data),
  delete: (id: number) => api.delete(`/mandati/${id}`),
};
