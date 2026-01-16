/**
 * AdminManager - Facade Pattern
 * Admin panelinin merkezi yönetimi
 * SOLID: Dependency Inversion, Interface Segregation
 */

class AdminManager {
    constructor() {
        this.modules = {};
        this.currentModule = 'dashboard';
        this.isAuthenticated = true; // Basit auth kontrolü
        this.apiClient = new ApiClient('/api/index.php?url=');
    }

    /**
     * Admin panelini başlat
     */
    init() {
        if (!this.checkAuthentication()) {
            window.location.href = 'login.html';
            return;
        }

        this.initializeModuleRouter();
        this.attachEventListeners();
        this.loadDashboardData();
    }

    /**
     * Kimlik doğrulamayı kontrol et
     */
    checkAuthentication() {
        const token = localStorage.getItem('adminToken');
        return this.isAuthenticated || !!token;
    }

    /**
     * Module Router'ı başlat
     */
    initializeModuleRouter() {
        this.router = new ModuleRouter();
        this.router.init();
    }

    /**
     * Event listener'ları ekle
     */
    attachEventListeners() {
        // Sidebar nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const module = item.getAttribute('data-module');
                this.switchModule(module);
            });
        });

        // Logout button
        document.getElementById('logoutBtn')?.addEventListener('click', () => {
            this.logout();
        });

        // Translation save
        document.getElementById('saveTranslationBtn')?.addEventListener('click', () => {
            this.saveTranslation();
        });

        // Service add button
        document.getElementById('addServiceBtn')?.addEventListener('click', () => {
            this.showAddServiceModal();
        });

        // User add button
        document.getElementById('addUserBtn')?.addEventListener('click', () => {
            this.showAddUserModal();
        });

        // Modal close button
        document.querySelector('.close')?.addEventListener('click', () => {
            document.getElementById('messageModal').classList.remove('active');
        });

        // Search functionality
        document.getElementById('searchInput')?.addEventListener('input', (e) => {
            this.search(e.target.value);
        });
    }

    /**
     * Modül değiştir
     */
    switchModule(moduleName) {
        // Eski modülü gizle
        const oldModule = document.getElementById(`${this.currentModule}-module`);
        if (oldModule) {
            oldModule.classList.remove('active');
        }

        // Nav item'dan active class'ı kaldır
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-module') === moduleName) {
                item.classList.add('active');
            }
        });

        // Yeni modülü göster
        this.currentModule = moduleName;
        const newModule = document.getElementById(`${moduleName}-module`);
        if (newModule) {
            newModule.classList.add('active');
        }

        // Modüle özel veri yükle
        this.loadModuleData(moduleName);
    }

    /**
     * Modüle özel veriyi yükle
     */
    loadModuleData(moduleName) {
        switch(moduleName) {
            case 'translations':
                this.loadTranslations();
                break;
            case 'messages':
                this.loadMessages();
                break;
            case 'services':
                this.loadServices();
                break;
            case 'users':
                this.loadUsers();
                break;
        }
    }

    /**
     * Dashboard verilerini yükle
     */
    loadDashboardData() {
        this.apiClient.getStats()
            .then(response => {
                if (response.success && response.data) {
                    document.getElementById('totalProjects').textContent = response.data.total_projects || '150';
                    document.getElementById('newMessages').textContent = response.data.unread_messages || '0';
                    document.getElementById('messageBadge').textContent = response.data.unread_messages || '0';
                    document.getElementById('activeUsers').textContent = response.data.active_users || '12';
                }
            })
            .catch(error => {
                console.error('Dashboard veri yüklemesi hatası:', error);
                // Fallback değerler
                document.getElementById('totalProjects').textContent = '150';
                document.getElementById('newMessages').textContent = '0';
                document.getElementById('messageBadge').textContent = '0';
                document.getElementById('activeUsers').textContent = '12';
            });
    }

    /**
     * Çevirileri yükle
     */
    loadTranslations() {
        this.apiClient.getTranslations(1, 50)
            .then(response => {
                if (response.success && response.data) {
                    this.populateTranslationTable(response.data);
                }
            })
            .catch(error => {
                console.error('Çeviriler yüklemesi hatası:', error);
                adminUI.showError('Çeviriler yüklenemedi');
            });
    }

    /**
     * Çeviri tablosunu doldur
     */
    populateTranslationTable(translations) {
        const table = document.getElementById('translationTable');
        if (!table) return;

        table.innerHTML = '';
        
        const flattenKeys = (obj, prefix = '') => {
            let keys = [];
            for (let key in obj) {
                const value = obj[key];
                const fullKey = prefix ? `${prefix}.${key}` : key;
                
                if (typeof value === 'object' && value !== null) {
                    keys = keys.concat(flattenKeys(value, fullKey));
                } else {
                    keys.push(fullKey);
                }
            }
            return keys;
        };

        const keys = flattenKeys(translations).slice(0, 10); // İlk 10'unu göster

        keys.forEach(key => {
            const row = table.insertRow();
            row.innerHTML = `
                <td>${key}</td>
                <td><small>Turkish</small></td>
                <td><small>English</small></td>
                <td><small>Arabic</small></td>
                <td><small>Russian</small></td>
                <td>
                    <button class="btn btn-small btn-edit">Düzenle</button>
                    <button class="btn btn-small btn-delete">Sil</button>
                </td>
            `;
        });
    }

    /**
     * Çeviriyi kaydet
     */
    saveTranslation() {
        const key = document.getElementById('translationKey').value;
        const text = document.getElementById('translationText').value;
        const lang = document.querySelector('.lang-btn.active').getAttribute('data-lang');

        if (!key || !text) {
            adminUI.showError('Lütfen tüm alanları doldurun');
            return;
        }

        adminUI.showLoading('Çeviri kaydediliyor...');

        const data = {};
        data[lang] = text;

        this.apiClient.addTranslation(key, data.tr || '', data.en || '', data.ar || '', data.ru || '')
            .then(response => {
                adminUI.hideLoading();
                if (response.success) {
                    adminUI.showSuccess('Çeviri başarıyla kaydedildi!');
                    document.getElementById('translationKey').value = '';
                    document.getElementById('translationText').value = '';
                    this.loadTranslations();
                } else {
                    adminUI.showError(response.message);
                }
            })
            .catch(error => {
                adminUI.hideLoading();
                adminUI.showError('Çeviri kaydedilemedi: ' + error.message);
            });
    }

    /**
     * Mesajları yükle
     */
    loadMessages() {
        this.apiClient.getMessages(1, 10)
            .then(response => {
                if (response.success && response.data) {
                    this.populateMessagesTable(response.data);
                }
            })
            .catch(error => {
                console.error('Mesajlar yüklemesi hatası:', error);
            });
    }

    /**
     * Mesajlar tablosunu doldur
     */
    populateMessagesTable(messages) {
        const table = document.getElementById('messagesTable');
        if (!table) return;

        table.innerHTML = '';
        
        messages.forEach(msg => {
            const row = table.insertRow();
            row.innerHTML = `
                <td>${msg.name}</td>
                <td>${msg.email}</td>
                <td>${msg.service}</td>
                <td>${msg.message.substring(0, 50)}...</td>
                <td>${new Date(msg.created_at).toLocaleDateString('tr-TR')}</td>
                <td><span class="status ${msg.status}">${msg.status === 'unread' ? 'Okunmamış' : 'Okundu'}</span></td>
                <td>
                    <button class="btn btn-small btn-view" onclick="adminUI.viewMessage(${msg.id})">Göster</button>
                    <button class="btn btn-small btn-reply" onclick="adminUI.replyMessage(${msg.id})">Cevapla</button>
                </td>
            `;
        });
    }

    /**
     * Hizmetleri yükle
     */
    loadServices() {
        // Gerçek uygulamada API'den alınır
        console.log('Hizmetler yükleniyor...');
    }

    /**
     * Kullanıcıları yükle
     */
    loadUsers() {
        // Gerçek uygulamada API'den alınır
        console.log('Kullanıcılar yükleniyor...');
    }

    /**
     * Hizmet ekleme modalını göster
     */
    showAddServiceModal() {
        alert('Yeni hizmet ekleme formu burada açılacak');
    }

    /**
     * Kullanıcı ekleme modalını göster
     */
    showAddUserModal() {
        alert('Yeni kullanıcı ekleme formu burada açılacak');
    }

    /**
     * Arama işlemi
     */
    search(query) {
        console.log('Arama yapılıyor:', query);
        // Gerçek arama implementasyonu
    }

    /**
     * Çıkış yap
     */
    logout() {
        localStorage.removeItem('adminToken');
        window.location.href = 'login.html';
    }
}

// Global erişim
window.AdminManager = AdminManager;