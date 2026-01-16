# TeknoBeYaz Admin Paneli

Professional web tasarım şirketi TeknoBeYaz'ın yönetici paneli. Modular, ölçeklenebilir ve bakımı kolay bir yapıya sahip.

## 📋 Özellikler

### Dashboard
- Proje istatistikleri
- Yeni mesajlar sayacı
- Memnuniyet oranı
- Son aktiviteler

### Çeviriler Yönetimi (i18n)
- Türkçe, İngilizce, Arapça, Rusça çeviri yönetimi
- Gerçek zamanlı çeviri güncelleme
- Tablo görünümü ile tüm çevirileri görüntüleme

### Hizmetler
- Hizmet ekleme/düzenleme/silme
- Hizmet açıklamaları
- Fiyat yönetimi
- Durum kontrolü

### Fiyatlandırma
- Paket fiyatları güncelleme
- Temel, Profesyonel, Kurumsal paketler
- Gerçek zamanlı fiyat değişiklikleri

### İletişim Formları
- Gelen iletişim formlarını görüntüleme
- Mesaj detaylarını inceleme
- Hızlı cevaplama sistemi
- Okundu/Okunmamış durumu

### Kullanıcı Yönetimi
- Admin ve Editor kullanıcı oluşturma
- Kullanıcı düzenleme/silme
- Yetki kontrolü

### Ayarlar
- Site adı ve açıklaması
- İletişim bilgileri
- Meta etiketleri
- SEO ayarları

## 🏗️ Mimarı

### SOLID Prensipleri
- **Single Responsibility**: Her sınıfın tek sorumluluğu
- **Open/Closed**: Yeni özelliklere açık, değişikliklere kapalı
- **Liskov Substitution**: Başkalaştırılabilir sınıflar
- **Interface Segregation**: Fokus edilmiş arayüzler
- **Dependency Inversion**: Soyutlamalara bağımlılık

### Design Patterns
- **Facade**: AdminManager - merkezi yönetim
- **Observer**: ModuleRouter - rota değişimlerini gözlemle
- **Singleton**: Modal ve UI bileşenleri
- **MVC**: Module-View-Controller mimarlığı

### Dosya Yapısı
```
admin/
├── index.html              # Ana admin paneli
├── login.html              # Giriş sayfası
├── css/
│   └── admin.css           # Admin stileri
└── js/
    ├── AdminManager.js     # Facade sınıfı
    ├── ModuleRouter.js     # Routing yönetimi
    └── AdminUI.js          # UI bileşenleri
```

## 🚀 Başlangıç

### Giriş Yapma
1. `login.html` sayfasına gidin
2. Test kullanıcısı ile giriş yapın:
   - E-posta: `admin@teknobeyaz.com`
   - Şifre: `admin123`

### Dashboard'u Açma
Giriş yaptıktan sonra otomatik olarak `/admin/index.html` açılır.

## 💻 Geliştirme

### AdminManager Sınıfı
Ana yönetim sınıfı. Tüm modüllerin koordinasyonunu sağlar.

```javascript
const admin = new AdminManager();
admin.init();
```

### ModuleRouter Sınıfı
Modüller arasında navigasyon sağlar.

```javascript
this.router.navigateTo('translations');
this.router.subscribe((route) => {
    console.log('Rota değişti:', route);
});
```

### AdminUI Sınıfı
UI bileşenlerini yönetir ve kullanıcı etkileşimini sağlar.

```javascript
adminUI.showSuccess('İşlem başarılı!');
adminUI.showError('Bir hata oluştu');
adminUI.showLoading('Yükleniyor...');
```

## 🔐 Güvenlik

- LocalStorage token kontrolü
- Basit kimlik doğrulama
- Form doğrulaması
- CSRF koruma (gelecek)
- Rate limiting (gelecek)

## 📱 Responsive Tasarım

- Desktop: Tam genişlik sidebar
- Tablet: Kompakt sidebar
- Mobile: Icon-only sidebar

## 🎨 Renk Şeması

- **Primary**: #3b82f6 (Mavi)
- **Secondary**: #10b981 (Yeşil)
- **Danger**: #ef4444 (Kırmızı)
- **Warning**: #f59e0b (Sarı)

## 📚 Dependencies

- Hiç dış bağımlılık yok! (Vanilla JS)
- Sadece Google Fonts'u kullanıyor

## 🔄 API Entegrasyonu

Şu anda tüm veriler simüle edilmiştir. Production ortamında API endpoints'lerini ekleyebilirsiniz:

```javascript
// Örnek API entegrasyonu
async loadTranslations() {
    const response = await fetch('/api/translations');
    const data = await response.json();
    // ...
}
```

## 📝 Not

Bu admin paneli modular ve ölçeklenebilir şekilde tasarlanmıştır. Yeni modüller eklemek için:

1. HTML'e yeni section ekleyin
2. AdminManager'da loadModuleData() metodunu güncelleyin
3. ModuleRouter'da yeni rota ekleyin
4. CSS ile stilini belirleyin

## 📞 İletişim

Sorunlar veya öneriler için iletişime geçin: info@teknobeyaz.com