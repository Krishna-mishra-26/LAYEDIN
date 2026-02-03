import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Add cache headers for GET requests to reduce 304 responses
    if (config.method === 'get') {
      config.headers['Cache-Control'] = 'max-age=300'; // 5 minutes
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  changePassword: (data) => api.put('/auth/password', data),
  deleteAccount: (data) => api.delete('/auth/account', { data }),
};

// Profiles API
export const profilesAPI = {
  getAll: (params) => api.get('/profiles', { params }),
  searchRoles: (params) => api.get('/profiles/search-roles', { params }),
  getFeatured: () => api.get('/profiles/featured'),
  getStats: () => api.get('/profiles/stats'),
  getAnalytics: () => api.get('/profiles/analytics'),
  getFilters: () => api.get('/profiles/filters'),
  getById: (id) => api.get(`/profiles/${id}`),
  getViewers: (id) => api.get(`/profiles/${id}/viewers`),
  create: (data) => api.post('/profiles', data),
  update: (data) => api.put('/profiles', data),
  delete: () => api.delete('/profiles'),
};

// Messages API
export const messagesAPI = {
  getConversations: () => api.get('/messages/conversations'),
  getConversation: (userId) => api.get(`/messages/conversation/${userId}`),
  sendMessage: (data) => api.post('/messages', data),
  editMessage: (id, content) => api.put(`/messages/${id}`, { content }),
  deleteMessage: (id) => api.delete(`/messages/${id}/message`),
  getUnreadCount: () => api.get('/messages/unread-count'),
  markAsRead: (id) => api.put(`/messages/${id}/read`),
  archiveConversation: (convId) => api.patch(`/messages/${convId}/archive`),
  unarchiveConversation: (convId) => api.patch(`/messages/${convId}/unarchive`),
  deleteConversation: (convId) => api.delete(`/messages/${convId}`),
};

// Hiring API
export const hiringAPI = {
  getAll: (params) => api.get('/hiring', { params }),
  getFeatured: () => api.get('/hiring/featured'),
  getLatest: () => api.get('/hiring/latest'),
  getById: (id) => api.get(`/hiring/${id}`),
  getExternalJobs: () => api.get('/hiring/external/jobs'),
  create: (data) => api.post('/hiring', data),
  update: (id, data) => api.put(`/hiring/${id}`, data),
  delete: (id) => api.delete(`/hiring/${id}`),
  trackApply: (id) => api.post(`/hiring/${id}/apply`),
};

// Referrals API
export const referralsAPI = {
  getAll: (params) => api.get('/referrals', { params }),
  getStats: () => api.get('/referrals/stats'),
  getCompanies: () => api.get('/referrals/companies'),
  getById: (id) => api.get(`/referrals/${id}`),
  create: (data) => api.post('/referrals', data),
  update: (id, data) => api.put(`/referrals/${id}`, data),
  delete: (id, email) => api.delete(`/referrals/${id}`, { data: { email } }),
  request: (id) => api.post(`/referrals/${id}/request`),
};

export default api;
