/**
 * FormHandler - Command Pattern
 * Form işlemlerini yönet
 * SOLID: Single Responsibility
 */

class FormHandler {
    constructor(formSelector, i18nManager) {
        this.form = document.querySelector(formSelector);
        this.i18n = i18nManager;
        this.init();
    }

    /**
     * Form handler'ı başlat
     */
    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    /**
     * Form gönderimini işle
     */
    async handleSubmit(e) {
        e.preventDefault();
        
        // Form verilerini al
        const formData = this.getFormData();
        
        try {
            // API'ye gönder
            const response = await frontendApi.sendContactForm(
                formData.get('name') || '',
                formData.get('email') || '',
                formData.get('phone') || '',
                formData.get('service') || '',
                formData.get('message') || ''
            );

            if (response.success) {
                this.showSuccess();
                this.resetForm();
            } else {
                console.error('Form gönderilemedi:', response.message);
            }
        } catch (error) {
            console.error('Form gönderme hatası:', error);
        }
    }

    /**
     * Başarı mesajı göster
     */
    showSuccess() {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        const successMessages = {
            tr: 'Gönderildi!',
            en: 'Sent!',
            ar: 'تم الإرسال!',
            ru: 'Отправлено!'
        };
        
        submitBtn.textContent = successMessages[this.i18n.getCurrentLanguage()] || 'Sent!';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    /**
     * Formu sıfırla
     */
    resetForm() {
        this.form.reset();
    }

    /**
     * Form verisini al
     */
    getFormData() {
        return new FormData(this.form);
    }
}

// Global erişim
window.FormHandler = FormHandler;
