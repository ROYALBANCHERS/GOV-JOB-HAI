// ===== API Configuration =====
const API_CONFIG = {
    baseURL: window.location.hostname === 'localhost' ? 'http://localhost:8000/api' : '/api',
    timeout: 10000
};

// ===== API Helper Class =====
class API {
    constructor() {
        this.baseURL = API_CONFIG.baseURL;
        this.token = localStorage.getItem('auth_token');
    }

    // Get authentication headers
    getHeaders() {
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return headers;
    }

    // Generic request method
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            ...options,
            headers: {
                ...this.getHeaders(),
                ...options.headers
            }
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // GET request
    async get(endpoint, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;
        return this.request(url, { method: 'GET' });
    }

    // POST request
    async post(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // PUT request
    async put(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    // DELETE request
    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }

    // Set authentication token
    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('auth_token', token);
        } else {
            localStorage.removeItem('auth_token');
        }
    }

    // Get current user
    async getCurrentUser() {
        return this.get('/me');
    }

    // ===== Authentication Methods =====
    async login(email, password) {
        const data = await this.post('/login', { email, password });
        if (data.token) {
            this.setToken(data.token);
        }
        return data;
    }

    async register(name, email, password, confirmPassword) {
        return this.post('/register', {
            name,
            email,
            password,
            password_confirmation: confirmPassword
        });
    }

    async logout() {
        try {
            await this.post('/logout');
        } finally {
            this.setToken(null);
        }
    }

    // ===== Job Methods =====
    async getJobs(params = {}) {
        return this.get('/jobs', params);
    }

    async getJob(id) {
        return this.get(`/jobs/${id}`);
    }

    async saveJob(id) {
        return this.post(`/save-job/${id}`);
    }

    async unsaveJob(id) {
        return this.delete(`/save-job/${id}`);
    }

    async getSavedJobs() {
        return this.get('/saved-jobs');
    }

    async applyJob(id) {
        return this.post(`/apply/${id}`);
    }

    async getApplications() {
        return this.get('/applications');
    }

    // ===== Admin Methods =====
    async createJob(jobData) {
        return this.post('/admin/jobs', jobData);
    }

    async updateJob(id, jobData) {
        return this.put(`/admin/jobs/${id}`, jobData);
    }

    async deleteJob(id) {
        return this.delete(`/admin/jobs/${id}`);
    }

    async getAnalytics() {
        return this.get('/admin/analytics');
    }
}

// ===== Initialize API =====
const api = new API();

// ===== Export for use in other files =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
}
