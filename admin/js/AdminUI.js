/**
 * AdminUI - Component Management
 * Admin panelinin UI bileşenlerini yönet
 * SOLID: Single Responsibility, Open/Closed
 */

class AdminUI {
    constructor() {
        this.components = new Map();
        this.notifications = [];
    }

    /**
     * UI bileşenlerini başlat
     */
    init() {
        this.initializeDataTables();
        this.initializeModals();
        this.initializeToasts();
    }

    /**
     * Veri tablolarını başlat
     */
    initializeDataTables() {
        // Tablo satırlarına event listener ekle
        document.querySelectorAll('table tbody tr').forEach(row => {
            row.addEventListener('click', () => {
                row.classList.toggle('selected');
            });
        });

        // Düzenle butonları
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showEditModal(btn);
            });
        });

        // Sil butonları
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.confirmDelete(btn);
            });
        });

        // Görüntüle butonları
        document.querySelectorAll('.btn-view').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showMessageModal(btn);
            });
        });

        // Cevapla butonları
        document.querySelectorAll('.btn-reply').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showReplyModal(btn);
            });
        });
    }

    /**
     * Modal'ları başlat
     */
    initializeModals() {
        const modal = document.getElementById('messageModal');
        if (!modal) return;

        // Dışarıya tıkladığında kapat
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    /**
     * Toast notification'ları başlat
     */
    initializeToasts() {
        // Toast container oluştur
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = `
            position: fixed;
            top: 1rem;
            right: 1rem;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 1rem;
        `;
        document.body.appendChild(container);
    }

    /**
     * Başarı toast'ı göster
     */
    showSuccess(message, duration = 3000) {
        this.showToast(message, 'success', duration);
    }

    /**
     * Hata toast'ı göster
     */
    showError(message, duration = 5000) {
        this.showToast(message, 'error', duration);
    }

    /**
     * Uyarı toast'ı göster
     */
    showWarning(message, duration = 4000) {
        this.showToast(message, 'warning', duration);
    }

    /**
     * Bilgi toast'ı göster
     */
    showInfo(message, duration = 3000) {
        this.showToast(message, 'info', duration);
    }

    /**
     * Toast göster
     */
    showToast(message, type = 'info', duration = 3000) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.style.cssText = `
            background-color: ${this.getToastColor(type)};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            animation: slideIn 0.3s ease;
        `;
        toast.textContent = message;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    /**
     * Toast rengi al
     */
    getToastColor(type) {
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        return colors[type] || colors.info;
    }

    /**
     * Düzenleme modalını göster
     */
    showEditModal(btn) {
        const row = btn.closest('tr');
        const rowData = Array.from(row.cells).map(cell => cell.textContent);
        
        console.log('Düzenleme modalı açılıyor:', rowData);
        this.showSuccess('Düzenleme formu açılacak');
    }

    /**
     * Mesaj modalını göster
     */
    showMessageModal(btn) {
        const row = btn.closest('tr');
        const modal = document.getElementById('messageModal');
        const modalBody = document.getElementById('modalBody');

        // Satır verisini al
        const cells = row.cells;
        const messageData = {
            name: cells[0].textContent,
            email: cells[1].textContent,
            service: cells[2].textContent,
            message: cells[3].textContent,
            date: cells[4].textContent
        };

        // Modal içeriğini doldur
        modalBody.innerHTML = `
            <div style="margin-bottom: 1rem;">
                <p><strong>Ad Soyad:</strong> ${messageData.name}</p>
                <p><strong>E-posta:</strong> ${messageData.email}</p>
                <p><strong>Hizmet:</strong> ${messageData.service}</p>
                <p><strong>Tarih:</strong> ${messageData.date}</p>
            </div>
            <div style="border-top: 1px solid #e2e8f0; padding-top: 1rem; margin-bottom: 1rem;">
                <p><strong>Mesaj:</strong></p>
                <p>${messageData.message}</p>
            </div>
            <div style="display: flex; gap: 1rem;">
                <button class="btn btn-primary" onclick="adminUI.markAsRead()">Okundu İşaretle</button>
                <button class="btn btn-secondary" onclick="adminUI.showReplyForm()">Cevapla</button>
            </div>
        `;

        modal.classList.add('active');
    }

    /**
     * Cevap modalını göster
     */
    showReplyModal(btn) {
        const row = btn.closest('tr');
        const email = row.cells[1].textContent;
        
        const replyForm = prompt(`${email} adresine cevap gönderin:`, '');
        if (replyForm) {
            this.showSuccess('Cevap gönderildi!');
        }
    }

    /**
     * Silme işlemini onayla
     */
    confirmDelete(btn) {
        const row = btn.closest('tr');
        const itemName = row.cells[0].textContent;
        
        if (confirm(`"${itemName}" öğesini silmek istediğinizden emin misiniz?`)) {
            row.style.opacity = '0.5';
            row.style.pointerEvents = 'none';
            
            // API'ye delete request gönder (simüle)
            setTimeout(() => {
                row.remove();
                this.showSuccess('Öğe başarıyla silindi');
            }, 500);
        }
    }

    /**
     * Mesajı görüntüle
     */
    async viewMessage(messageId) {
        try {
            const response = await apiClient.getMessage(messageId);
            if (response.success) {
                const msg = response.data;
                const modal = document.getElementById('messageModal');
                const modalBody = document.getElementById('modalBody');

                modalBody.innerHTML = `
                    <div style="margin-bottom: 1rem;">
                        <p><strong>Ad Soyad:</strong> ${msg.name}</p>
                        <p><strong>E-posta:</strong> ${msg.email}</p>
                        <p><strong>Hizmet:</strong> ${msg.service}</p>
                        <p><strong>Tarih:</strong> ${new Date(msg.created_at).toLocaleDateString('tr-TR')}</p>
                    </div>
                    <div style="border-top: 1px solid #e2e8f0; padding-top: 1rem; margin-bottom: 1rem;">
                        <p><strong>Mesaj:</strong></p>
                        <p>${msg.message}</p>
                    </div>
                    <div style="display: flex; gap: 1rem;">
                        <button class="btn btn-primary" onclick="adminUI.markAsRead(${messageId})">Okundu İşaretle</button>
                        <button class="btn btn-secondary" onclick="adminUI.replyMessage(${messageId})">Cevapla</button>
                    </div>
                `;

                modal.classList.add('active');
            }
        } catch (error) {
            this.showError('Mesaj yüklenemedi: ' + error.message);
        }
    }

    /**
     * Mesajı okundu olarak işaretle
     */
    async markAsRead(messageId) {
        try {
            const response = await apiClient.updateMessageStatus(messageId, 'read');
            if (response.success) {
                this.showSuccess('Mesaj okundu olarak işaretlendi');
                document.getElementById('messageModal').classList.remove('active');
            }
        } catch (error) {
            this.showError('Durum güncellenemedi: ' + error.message);
        }
    }

    /**
     * Mesaja cevapla
     */
    replyMessage(messageId) {
        const reply = prompt('Cevapınızı yazın:');
        if (reply) {
            this.showSuccess('Cevap gönderildi!');
            document.getElementById('messageModal').classList.remove('active');
        }
    }

    /**
     * Yükleme göstergesi göster
     */
    showLoading(message = 'Yükleniyor...') {
        const loader = document.createElement('div');
        loader.id = 'global-loader';
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
        `;
        loader.innerHTML = `
            <div style="background: white; padding: 2rem; border-radius: 0.75rem; text-align: center;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">⏳</div>
                <p>${message}</p>
            </div>
        `;
        document.body.appendChild(loader);
    }

    /**
     * Yükleme göstergesi gizle
     */
    hideLoading() {
        const loader = document.getElementById('global-loader');
        if (loader) {
            loader.remove();
        }
    }
}

// Global instance
const adminUI = new AdminUI();

// CSS animations ekleme
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Page load olduğunda UI başlat
document.addEventListener('DOMContentLoaded', () => {
    adminUI.init();
});

// Global erişim
window.AdminUI = AdminUI;
window.adminUI = adminUI;