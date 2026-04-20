const API_BASE = 'http://localhost:3001/api/v1';

console.log('[API] Using LOCAL backend:', API_BASE);

const api = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = `${API_BASE}${endpoint}`;
    console.log('[API] Request:', options.method || 'GET', url);
    console.log('[API] Headers:', headers);
    console.log('[API] Body:', options.body);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        mode: 'cors',
        credentials: 'omit'
      });
      console.log('[API] Response status:', response.status);
      const contentType = response.headers.get('content-type');
      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw Object.assign(new Error(text.substring(0, 100) || 'Invalid response'), { status: response.status, data: null });
      }
      if (!response.ok) {
        console.log('[API] Error response:', data);
        const errorMsg = data?.message || data?.data?.message || `API Error: ${response.status}`;
        throw Object.assign(new Error(errorMsg), { status: response.status, data });
      }
      console.log('[API] Success:', data);
      return data;
    } catch (error) {
      console.log('[API] Request failed:', error.message);
      throw error;
    }
  },

  auth: {
    async register(data) {
      return api.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    async login(email, password) {
      return api.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    },

    async verifyOtp(email, code) {
      return api.request('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email, code }),
      });
    },

    async getMe() {
      return api.request('/auth/me');
    },

    async regenerateOtp(email) {
      return api.request('/auth/regenerate-otp', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    },

    async reactivate(email) {
      return api.request('/auth/reactivate', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    },

    async logout() {
      return api.request('/auth/logout', { method: 'POST' });
    },

    async me() {
      return api.request('/auth/me');
    },

    async requestPasswordReset(email) {
      return api.request('/auth/password/reset-request', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    },

    async resetPassword(email, token, newPassword) {
      return api.request('/auth/password/reset', {
        method: 'POST',
        body: JSON.stringify({ email, token, newPassword }),
      });
    },
  },

  transactions: {
    async list() {
      return api.request('/transactions');
    },

    async create(data) {
      return api.request('/transactions/create', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    async get(id) {
      return api.request(`/transactions/${id}`);
    },

    async summary() {
      return api.request('/transactions/resume');
    },

    async remaining() {
      return api.request('/transactions/remaining');
    },

    async flashback() {
      return api.request('/transactions/flashback');
    },
  },
};

window.api = api;