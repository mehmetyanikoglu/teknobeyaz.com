/**
 * I18nManager - Singleton Pattern
 * Çeviri yönetimini merkezi olarak yapan sınıf
 * SOLID Principles: Single Responsibility, Open/Closed, Dependency Inversion
 */

class I18nManager {
    constructor() {
        if (I18nManager.instance) {
            return I18nManager.instance;
        }
        
        this.currentLang = localStorage.getItem('lang') || 'tr';
        this.translations = {};
        this.supportedLanguages = ['tr', 'en', 'ar', 'ru'];
        this.observers = [];
        
        I18nManager.instance = this;
    }

    /**
     * Singleton pattern - instance al
     */
    static getInstance() {
        if (!I18nManager.instance) {
            I18nManager.instance = new I18nManager();
        }
        return I18nManager.instance;
    }

    /**
     * Dil dosyalarını yükle
     * Async/await pattern kullanarak bağımlılık azalt
     */
    async loadLanguages() {
        // Öncelik: API'den çek, hata olursa local JSON'a düş
        try {
            const promises = this.supportedLanguages.map(async (lang) => {
                try {
                    const res = await fetch(`/api/index.php?url=translations-json&lang=${lang}`);
                    if (!res.ok) throw new Error('API yanıtı başarısız');
                    const data = await res.json();
                    if (data.success && data.data) {
                        this.translations[lang] = data.data;
                        return;
                    }
                    throw new Error('API başarı döndürmedi');
                } catch (apiErr) {
                    // Fallback local JSON
                    const local = await fetch(`src/i18n/${lang}.json`).then(r => r.json());
                    this.translations[lang] = local;
                }
            });

            await Promise.all(promises);
            this.notifyObservers();
        } catch (error) {
            console.error('Dil dosyaları yükleme hatası:', error);
        }
    }

    /**
     * Çeviri al - dot notation desteğiyle
     * Örn: get('nav.services') -> Hizmetler
     */
    get(key, defaultValue = key) {
        const keys = key.split('.');
        let value = this.translations[this.currentLang];
        
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return defaultValue;
            }
        }
        
        return value || defaultValue;
    }

    /**
     * Dil değiştir
     */
    setLanguage(lang) {
        if (!this.supportedLanguages.includes(lang)) {
            console.warn(`Desteklenmeyen dil: ${lang}`);
            return;
        }
        
        this.currentLang = lang;
        localStorage.setItem('lang', lang);
        this.notifyObservers();
    }

    /**
     * Şu anki dili al
     */
    getCurrentLanguage() {
        return this.currentLang;
    }

    /**
     * Observer pattern - değişimleri gözlemle
     */
    subscribe(callback) {
        this.observers.push(callback);
    }

    unsubscribe(callback) {
        this.observers = this.observers.filter(cb => cb !== callback);
    }

    notifyObservers() {
        this.observers.forEach(callback => callback(this.currentLang));
    }

    /**
     * Sayfayı güncelle
     */
    updatePageContent() {
        document.querySelectorAll('[data-key]').forEach(element => {
            const key = element.getAttribute('data-key');
            const text = this.get(key);
            
            if (text && text !== key) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = text;
                } else if (element.tagName === 'OPTION') {
                    element.textContent = text;
                } else {
                    element.textContent = text;
                }
            }
        });
    }

    /**
     * Aktif dil butonunu güncelle
     */
    updateActiveButton() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            const btnLang = btn.getAttribute('data-lang');
            btn.classList.toggle('active', btnLang === this.currentLang);
        });
    }

    /**
     * RTL desteği (Arapça)
     */
    updateDirection() {
        const isRTL = this.currentLang === 'ar';
        document.body.classList.toggle('ar', isRTL);
        document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    }
}

// Global erişim
window.I18nManager = I18nManager;
