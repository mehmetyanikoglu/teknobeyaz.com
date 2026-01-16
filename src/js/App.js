/**
 * App - Facade Pattern
 * Uygulama başlatmayı ve yönetimi kolaylaştır
 * SOLID: Dependency Inversion, Interface Segregation
 */

class App {
    constructor() {
        this.i18n = null;
        this.languageController = null;
        this.formHandler = null;
    }

    /**
     * Uygulamayı başlat
     */
    async bootstrap() {
        try {
            // I18nManager'ı başlat (Singleton)
            this.i18n = window.I18nManager.getInstance();
            
            // Dil dosyalarını yükle
            await this.i18n.loadLanguages();
            
            // Controllerları ve handler'ları başlat
            this.languageController = new window.LanguageController(this.i18n);
            this.formHandler = new window.FormHandler('#contactForm', this.i18n);
            
            // Smooth scroll için linki ekle
            this.setupSmoothScroll();
            
            console.log('✅ Aplikasyon başlatıldı');
        } catch (error) {
            console.error('❌ Uygulama başlatma hatası:', error);
        }
    }

    /**
     * Smooth scroll desteği
     */
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }
}

// Global erişim
window.App = App;
