# TeknoBeYaz - Profesyonel Web Tasarım

Modern ve çok dilli (TR/EN/AR/RU) web tasarım şirketi sitesi.

## 🚀 Özellikler

- **Çok Dilli Destek**: Türkçe, İngilizce, Arapça, Rusça
- **Responsive Tasarım**: Tüm cihazlarda mükemmel görünüm
- **Tamamen Frontend (JS/HTML/CSS)**: Sunucu tarafı olmadan çalışır
- **SOLID Prensipleri**: Temiz ve sürdürülebilir kod

## 📁 Proje Yapısı

```
teknobeyaz.com/
├── index.html              # Ana sayfa
├── src/
│   ├── css/               # Stil dosyaları
│   ├── js/                # Frontend JavaScript
│   └── i18n/              # Dil dosyaları (tr, en, ar, ru)
└── (API yok)              # PHP backend kaldırıldı
```

## 🛠️ Kurulum

Statik dosyaları bir web sunucusunda (örn. Plesk, Nginx, Apache) veya GitHub Pages gibi bir statik barındırma üzerinde yayınlayın. Sunucu tarafı gerektirmez.



## 🔌 API

Bu proje artık herhangi bir API veya PHP backend kullanmaz. Tüm içerik ve çeviriler `src/i18n/*.json` üzerinden yüklenir, iletişim formu ise frontend içinde kullanıcıya başarı bildirimi gösterir.

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

- Girdi doğrulama (istemci tarafında)
- Harici backend olmadığı için sunucu tarafı güvenlik kapsam dışıdır

## 📄 Lisans

© 2026 TeknoBeYaz. Tüm hakları saklıdır.

## 🤝 İletişim

- Website: https://teknobeyaz.com
- Email: info@teknobeyaz.com
