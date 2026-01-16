/**
 * Frontend API Client - Ana site
 * İletişim formları ve diğer işlemler
 */

class FrontendApiClient {
    constructor(baseUrl = '/api/index.php?v=20260116b&url=') {
        this.baseUrl = baseUrl;
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
     * POST request
     */
    async post(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    /**
     * İletişim formu gönder
     */
    async sendContactForm(name, email, phone, service, message) {
        return this.post('messages', { 
            name, email, phone, service, message 
        });
    }
}

// Global instance
const frontendApi = new FrontendApiClient();