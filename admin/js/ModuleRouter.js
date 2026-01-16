/**
 * ModuleRouter - Observer + Routing Pattern
 * Admin panelindeki modül navigasyonunu yönet
 * SOLID: Single Responsibility, Open/Closed
 */

class ModuleRouter {
    constructor() {
        this.currentRoute = 'dashboard';
        this.routes = {
            dashboard: 'dashboard-module',
            translations: 'translations-module',
            services: 'services-module',
            pricing: 'pricing-module',
            messages: 'messages-module',
            users: 'users-module',
            settings: 'settings-module'
        };
        this.observers = [];
    }

    /**
     * Router'ı başlat
     */
    init() {
        this.attachRouteHandlers();
    }

    /**
     * Route handler'ları ekle
     */
    attachRouteHandlers() {
        // Sidebar navigation
        document.querySelectorAll('[data-module]').forEach(element => {
            element.addEventListener('click', (e) => {
                e.preventDefault();
                const route = element.getAttribute('data-module');
                this.navigateTo(route);
            });
        });

        // Hash-based routing desteği
        window.addEventListener('hashchange', () => {
            const route = window.location.hash.substring(1) || 'dashboard';
            this.navigateTo(route);
        });
    }

    /**
     * Belirtilen rotaya git
     */
    navigateTo(route) {
        if (!this.routes[route]) {
            console.warn(`Bilinmeyen rota: ${route}`);
            return;
        }

        // Eski modülü gizle
        this.hideCurrentModule();

        // Yeni modülü göster
        this.currentRoute = route;
        this.showModule(route);

        // URL'yi güncelle
        window.location.hash = route;

        // Observer'ları bilgilendir
        this.notifyObservers(route);
    }

    /**
     * Mevcut modülü gizle
     */
    hideCurrentModule() {
        const element = document.getElementById(this.routes[this.currentRoute]);
        if (element) {
            element.classList.remove('active');
        }

        // Active nav item'ı kaldır
        document.querySelectorAll('[data-module].active').forEach(item => {
            item.classList.remove('active');
        });
    }

    /**
     * Modülü göster
     */
    showModule(route) {
        const element = document.getElementById(this.routes[route]);
        if (element) {
            element.classList.add('active');
        }

        // Active nav item'ı ekle
        const navItem = document.querySelector(`[data-module="${route}"]`);
        if (navItem) {
            navItem.classList.add('active');
        }
    }

    /**
     * Observer pattern - rota değişimlerini gözlemle
     */
    subscribe(callback) {
        this.observers.push(callback);
    }

    unsubscribe(callback) {
        this.observers = this.observers.filter(cb => cb !== callback);
    }

    notifyObservers(route) {
        this.observers.forEach(callback => callback(route));
    }

    /**
     * Mevcut rotayı al
     */
    getCurrentRoute() {
        return this.currentRoute;
    }

    /**
     * Tüm rotaları al
     */
    getAvailableRoutes() {
        return Object.keys(this.routes);
    }
}

// Global erişim
window.ModuleRouter = ModuleRouter;