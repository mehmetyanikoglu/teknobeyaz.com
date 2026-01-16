/**
 * API Client - Frontend
 * Backend API ile iletişim için
 */

class ApiClient {
    constructor(baseUrl = '/api/index.php?url=') {
        this.baseUrl = baseUrl;
        this.token = localStorage.getItem('adminToken');
    }

    /**
     * API request yap
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        if (this.token) {
            config.headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'API hatası');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    /**
     * GET request
     */
    async get(endpoint, params = {}) {
        const query = new URLSearchParams(params).toString();
        const url = query ? `${endpoint}?${query}` : endpoint;
        
        return this.request(url, {
            method: 'GET'
        });
    }

    /**
     * POST request
     */
    async post(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    /**
     * PUT request
     */
    async put(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    /**
     * DELETE request
     */
    async delete(endpoint) {
        return this.request(endpoint, {
            method: 'DELETE'
        });
    }

    // ============ Çeviriler ============
    async getTranslations(page = 1, per_page = 10) {
        return this.get('translations', { page, per_page });
    }

    async getTranslation(id) {
        return this.get(`translations/${id}`);
    }

    async addTranslation(key, tr, en, ar, ru) {
        return this.post('translations', { key, tr, en, ar, ru });
    }

    async updateTranslation(id, data) {
        return this.put(`translations/${id}`, data);
    }

    async deleteTranslation(id) {
        return this.delete(`translations/${id}`);
    }

    // ============ Mesajlar ============
    async getMessages(page = 1, per_page = 10, status = null) {
        const params = { page, per_page };
        if (status) params.status = status;
        return this.get('messages', params);
    }

    async getMessage(id) {
        return this.get(`messages/${id}`);
    }

    async addMessage(name, email, phone, service, message) {
        return this.post('messages', { 
            name, email, phone, service, message 
        });
    }

    async updateMessageStatus(id, status) {
        return this.put(`messages/${id}`, { status });
    }

    async deleteMessage(id) {
        return this.delete(`messages/${id}`);
    }

    // ============ İstatistikler ============
    async getStats() {
        return this.get('stats');
    }
}

// Global instance
const apiClient = new ApiClient();