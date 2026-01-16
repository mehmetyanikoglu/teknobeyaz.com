# TeknoBeYaz API Dokümantasyonu

RESTful API backend. PHP + SQLite ile basit ve etkili veri yönetimi.

## 📋 Kurulum

### 1. Veritabanını Başlat
```
GET /api/init
```

Bu, SQLite veritabanını ve tüm tabloları oluşturur.

### 2. Klasör Yapısı
```
api/
├── index.php               # Ana API router
├── config/
│   ├── Database.php       # DB bağlantısı ve table init
│   └── ApiResponse.php    # Standart API responses
├── models/
│   ├── Translation.php    # Çeviriler CRUD
│   └── Message.php        # Mesajlar CRUD
├── controllers/           # (İleride)
├── routes/               # (İleride)
└── db/
    └── teknobeyaz.db     # SQLite database
```

---

## 🔌 API Endpoints

### Çeviriler

#### Tüm çevirileri al (Sayfalı)
```
GET /api/translations?page=1&per_page=10

Response:
{
    "success": true,
    "message": "Çeviriler başarıyla alındı",
    "data": [
        {
            "id": 1,
            "key": "nav.services",
            "tr": "Hizmetler",
            "en": "Services",
            "ar": "الخدمات",
            "ru": "Услуги",
            "created_at": "2026-01-16 10:30:00",
            "updated_at": "2026-01-16 10:30:00"
        }
    ],
    "pagination": {
        "total": 100,
        "page": 1,
        "per_page": 10,
        "pages": 10
    }
}
```

#### Çeviriyi ID'ye göre al
```
GET /api/translations/:id

Response:
{
    "success": true,
    "message": "Başarılı",
    "data": { ... }
}
```

#### Yeni çeviri ekle
```
POST /api/translations

Body:
{
    "key": "nav.about",
    "tr": "Hakkımızda",
    "en": "About",
    "ar": "حول",
    "ru": "О нас"
}

Response:
{
    "success": true,
    "message": "Çeviri başarıyla eklendi",
    "data": {
        "id": 101
    }
}
```

#### Çeviriyi güncelle
```
PUT /api/translations/:id

Body:
{
    "tr": "Güncellenmiş Metin",
    "en": "Updated Text"
}

Response:
{
    "success": true,
    "message": "Çeviri başarıyla güncellendi"
}
```

#### Çeviriyi sil
```
DELETE /api/translations/:id

Response:
{
    "success": true,
    "message": "Çeviri başarıyla silindi"
}
```

---

### Mesajlar (İletişim Formu)

#### Tüm mesajları al
```
GET /api/messages?page=1&per_page=10&status=unread

Response:
{
    "success": true,
    "message": "Mesajlar başarıyla alındı",
    "data": [
        {
            "id": 1,
            "name": "Ahmet Yılmaz",
            "email": "ahmet@example.com",
            "phone": "5551234567",
            "service": "Landing Page",
            "message": "Proje için fiyat bilgisi istiyorum...",
            "status": "unread",
            "created_at": "2026-01-16 14:30:00",
            "updated_at": "2026-01-16 14:30:00"
        }
    ],
    "pagination": { ... }
}
```

#### Mesajı al
```
GET /api/messages/:id

Response: { ... }
```

#### Yeni mesaj ekle
```
POST /api/messages

Body:
{
    "name": "Fatma Kaya",
    "email": "fatma@example.com",
    "phone": "5559876543",
    "service": "E-Ticaret",
    "message": "Özel ihtiyaçlar için danışmak istiyorum"
}

Response:
{
    "success": true,
    "message": "Mesaj başarıyla gönderildi",
    "data": {
        "id": 2
    }
}
```

#### Mesaj durumunu güncelle
```
PUT /api/messages/:id

Body:
{
    "status": "read"
}

Response:
{
    "success": true,
    "message": "Durum güncellendi"
}
```

#### Mesajı sil
```
DELETE /api/messages/:id

Response:
{
    "success": true,
    "message": "Mesaj silindi"
}
```

---

### İstatistikler

#### Dashboard istatistikleri al
```
GET /api/stats

Response:
{
    "success": true,
    "message": "İstatistikler alındı",
    "data": {
        "total_projects": 150,
        "unread_messages": 3,
        "active_users": 12,
        "satisfaction_rate": 98
    }
}
```

---

## 🔐 Hata Yanıtları

### 400 - Bad Request
```json
{
    "success": false,
    "message": "Zorunlu alanları doldurun",
    "timestamp": "2026-01-16 10:30:00"
}
```

### 404 - Not Found
```json
{
    "success": false,
    "message": "Çeviri bulunamadı",
    "timestamp": "2026-01-16 10:30:00"
}
```

### 422 - Validation Error
```json
{
    "success": false,
    "message": "Validasyon hatası",
    "errors": {
        "email": "Geçersiz e-posta",
        "phone": "Telefon zorunludur"
    },
    "timestamp": "2026-01-16 10:30:00"
}
```

### 500 - Server Error
```json
{
    "success": false,
    "message": "Sunucu hatası oluştu",
    "timestamp": "2026-01-16 10:30:00"
}
```

---

## 💻 Frontend Integration

### ApiClient (Admin Paneli)
```javascript
// Çevirileri al
const response = await apiClient.getTranslations(1, 10);

// Çeviri ekle
await apiClient.addTranslation('nav.about', 'Hakkımızda', 'About', 'حول', 'О нас');

// Mesaj gönder
await apiClient.addMessage('Ahmet', 'ahmet@example.com', '5551234567', 'Landing Page', 'Mesaj...');

// Mesaj durumu güncelle
await apiClient.updateMessageStatus(1, 'read');
```

### FrontendApiClient (Ana Site)
```javascript
// İletişim formu gönder
await frontendApi.sendContactForm(
    'Ahmet Yılmaz',
    'ahmet@example.com',
    '5551234567',
    'Landing Page',
    'Proje için bilgi istiyorum...'
);
```

---

## 🗄️ Veritabanı Şeması

### Translations
```sql
CREATE TABLE translations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE NOT NULL,
    tr TEXT,
    en TEXT,
    ar TEXT,
    ru TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Messages
```sql
CREATE TABLE messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    service TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Services
```sql
CREATE TABLE services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Pricing
```sql
CREATE TABLE pricing (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    package_name TEXT UNIQUE NOT NULL,
    price REAL NOT NULL,
    features TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Users
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'editor',
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Settings
```sql
CREATE TABLE settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 📝 CORS & Headers

API tüm originleri kabul eder:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

## 🚀 İleride Eklenecek

- [ ] Authentication & Authorization
- [ ] Rate Limiting
- [ ] Request Logging
- [ ] Caching
- [ ] Error Tracking
- [ ] Performance Monitoring
- [ ] API Versioning (v1, v2...)
- [ ] Database Migration Tools
- [ ] Automated Backups

---

## 📞 Kontakt

API sorularınız için: info@teknobeyaz.com