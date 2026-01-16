/**
 * LanguageController - Strategy Pattern
 * Dil değişim işlemini yönet
 * SOLID: Single Responsibility, Open/Closed
 */

class LanguageController {
    constructor(i18nManager) {
        this.i18n = i18nManager;
        this.init();
    }

    /**
     * Controller'ı başlat
     */
    init() {
        this.attachLanguageButtonListeners();
        this.i18n.subscribe(() => this.onLanguageChanged());
    }

    /**
     * Dil butonlarına event listener ekle
     */
    attachLanguageButtonListeners() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = btn.getAttribute('data-lang');
                this.switchLanguage(lang);
            });
        });
    }

    /**
     * Dili değiştir
     */
    switchLanguage(lang) {
        this.i18n.setLanguage(lang);
    }

    /**
     * Dil değişimi sonrası tetiklenen event
     */
    onLanguageChanged() {
        this.i18n.updatePageContent();
        this.i18n.updateActiveButton();
        this.i18n.updateDirection();
    }
}

// Global erişim
window.LanguageController = LanguageController;
