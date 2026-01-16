# TeknoBeYaz - Profesyonel Web Tasarım

Modern ve çok dilli (TR/EN/AR/RU) web tasarım şirketi sitesi.

## 🚀 Özellikler

- **Çok Dilli Destek**: Türkçe, İngilizce, Arapça, Rusça
- **Responsive Tasarım**: Tüm cihazlarda mükemmel görünüm
- **Admin Paneli**: Tam özellikli içerik yönetimi
- **REST API**: Backend entegrasyonu
- **MySQL Veritabanı**: Güvenli veri saklama
- **SOLID Prensipleri**: Temiz ve sürdürülebilir kod

## 📁 Proje Yapısı

```
teknobeyaz.com/
├── index.html              # Ana sayfa
├── src/
│   ├── css/               # Stil dosyaları
│   ├── js/                # Frontend JavaScript
│   └── i18n/              # Dil dosyaları (tr, en, ar, ru)
├── admin/
│   ├── index.html         # Admin paneli
│   ├── login.html         # Giriş sayfası
│   ├── css/               # Admin stilleri
│   └── js/                # Admin JavaScript
└── api/
    ├── index.php          # API router
    ├── config/            # Veritabanı ayarları
    └── models/            # Veri modelleri
```

## 🛠️ Kurulum

### 1. Veritabanı Yapılandırması

`api/config/Database.php` dosyasındaki veritabanı bilgilerini düzenleyin:

```php
private $host = 'localhost:3306';
private $db_name = 'teknobeyaz_';
private $username = 'teknobeyaz';
private $password = 'teknobeyaz';
```

### 2. Veritabanı Tablolarını Oluşturma

Tarayıcıda şu URL'ye erişin:
```
https://yourdomain.com/api/index.php?url=init
```

### 3. Admin Paneli Giriş

- URL: `https://yourdomain.com/admin/`
- Kullanıcı: `admin@teknobeyaz.com`
- Şifre: `admin123`

## 🔌 API Endpoints

### Statistics
- `GET /api/index.php?url=stats` - Dashboard istatistikleri

### Translations
- `GET /api/index.php?url=translations` - Tüm çevirileri listele
- `POST /api/index.php?url=translations` - Yeni çeviri ekle
- `PUT /api/index.php?url=translations/{id}` - Çeviri güncelle
- `DELETE /api/index.php?url=translations/{id}` - Çeviri sil

### Messages
- `GET /api/index.php?url=messages` - Tüm mesajları listele
- `POST /api/index.php?url=messages` - Yeni mesaj ekle
- `PUT /api/index.php?url=messages/{id}` - Mesaj durumu güncelle
- `DELETE /api/index.php?url=messages/{id}` - Mesaj sil

## 🎨 Tasarım Desenleri

- **Singleton**: I18nManager, ApiClient
- **Strategy**: LanguageController
- **Command**: FormHandler
- **Facade**: App, AdminManager
- **Observer**: ModuleRouter

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🌐 Çok Dilli Sistem

Dil dosyaları `src/i18n/` klasöründe JSON formatında:
- `tr.json` - Türkçe
- `en.json` - İngilizce
- `ar.json` - Arapça (RTL desteği ile)
- `ru.json` - Rusça

## 🔒 Güvenlik

- PDO prepared statements (SQL injection koruması)
- Token-based authentication (Admin paneli)
- CORS yapılandırması
- Input validation

## 📄 Lisans

© 2026 TeknoBeYaz. Tüm hakları saklıdır.

## 🤝 İletişim

- Website: https://teknobeyaz.com
- Email: info@teknobeyaz.com
