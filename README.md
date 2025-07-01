# 📅 Interaktif Randevu Takvimi Uygulaması

Bu proje, DOM event'lerini öğrenmek ve pekiştirmek için geliştirilmiş interaktif bir randevu takvimi uygulamasıdır.

## 🎯 Proje Amacı

- Gerçekçi bir mini proje üzerinden sık kullanılan DOM event'lerini öğrenmek
- Form elemanları, liste yönetimi ve modal kullanımıyla etkileşimleri pekiştirmek
- Modern web geliştirme tekniklerini uygulamak

## ✨ Özellikler

### 📝 Form Yönetimi
- **İsim girişi**: Metin input alanı
- **Tarih seçimi**: Date picker ile tarih seçimi
- **Saat seçimi**: Time picker ile saat seçimi
- **Hizmet seçimi**: Dropdown menü ile hizmet türü seçimi
- **Form validasyonu**: Real-time input kontrolü

### 🗓️ Randevu Yönetimi
- **Randevu ekleme**: Form ile yeni randevu oluşturma
- **Randevu listeleme**: Tarih sırasına göre randevuları görüntüleme
- **Randevu silme**: Tek tıkla randevu silme
- **Randevu detayları**: Modal ile randevu bilgilerini görüntüleme

### 🎨 Kullanıcı Arayüzü
- **Modern tasarım**: Gradient arka plan ve modern UI
- **Responsive tasarım**: Mobil ve masaüstü uyumlu
- **Animasyonlar**: Hover efektleri ve geçiş animasyonları
- **Modal sistemi**: Randevu onayı için popup pencere

### 💾 Veri Yönetimi
- **LocalStorage**: Randevuları tarayıcıda saklama
- **Otomatik sıralama**: Randevuları tarihe göre sıralama
- **Veri kalıcılığı**: Sayfa yenilendiğinde veriler korunur

## 🚀 Kullanım

1. **index.html** dosyasını bir web tarayıcısında açın
2. Form alanlarını doldurun:
   - İsim girin
   - Tarih seçin
   - Saat seçin
   - Hizmet türü seçin
3. "Randevu Ekle" butonuna tıklayın
4. Modal'da randevu detaylarını kontrol edin
5. "Onayla" butonuna tıklayarak randevuyu kaydedin

## 🛠️ Teknolojiler

- **HTML5**: Semantik yapı ve form elemanları
- **CSS3**: Modern styling, Flexbox, Grid, Animasyonlar
- **JavaScript (ES6+)**: DOM manipülasyonu, Event handling, LocalStorage

## 📁 Dosya Yapısı

```
domExamples1/
├── index.html          # Ana HTML dosyası
├── style.css           # CSS stilleri
├── script.js           # JavaScript fonksiyonları
└── README.md           # Proje dokümantasyonu
```

## 🎯 DOM Event'leri Kullanımı

### Form Event'leri
- `submit`: Form gönderimi
- `input`: Real-time input kontrolü
- `change`: Tarih ve saat değişiklikleri
- `focus/blur`: Form alanı odaklanma

### Modal Event'leri
- `click`: Modal açma/kapama
- `keydown`: ESC tuşu ile kapatma
- `window.click`: Modal dışına tıklama

### Liste Event'leri
- `click`: Randevu silme ve detay görüntüleme
- `DOMContentLoaded`: Sayfa yüklendiğinde çalışma

## 🎨 CSS Özellikleri

- **Grid Layout**: Ana sayfa düzeni
- **Flexbox**: Form ve liste elemanları
- **CSS Variables**: Renk ve boyut değişkenleri
- **Media Queries**: Responsive tasarım
- **Transitions**: Smooth animasyonlar
- **Box-shadow**: Derinlik efektleri

## 🔧 Özelleştirme

### Renk Teması Değiştirme
`style.css` dosyasında CSS değişkenlerini düzenleyebilirsiniz:

```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --success-color: #48bb78;
    --error-color: #e53e3e;
}
```

### Hizmet Türleri Ekleme
`script.js` dosyasında `serviceNames` objesini güncelleyebilirsiniz:

```javascript
const serviceNames = {
    'konsultasyon': 'Konsültasyon',
    'tedavi': 'Tedavi',
    'kontrol': 'Kontrol',
    'acil': 'Acil',
    'yeni-hizmet': 'Yeni Hizmet' // Yeni hizmet ekleyin
};
```

## 📱 Responsive Tasarım

Uygulama aşağıdaki ekran boyutlarında optimize edilmiştir:
- **Desktop**: 1200px ve üzeri
- **Tablet**: 768px - 1199px
- **Mobile**: 767px ve altı

## 🎓 Öğrenme Hedefleri

Bu proje ile aşağıdaki konuları öğrenebilirsiniz:

1. **DOM Manipülasyonu**
   - Element seçimi
   - İçerik değiştirme
   - Stil güncelleme

2. **Event Handling**
   - Form event'leri
   - Click event'leri
   - Keyboard event'leri

3. **Form Yönetimi**
   - FormData API
   - Validasyon
   - Real-time feedback

4. **Modal Kullanımı**
   - Popup pencereler
   - Overlay yönetimi
   - Accessibility

5. **LocalStorage**
   - Veri saklama
   - JSON serialization
   - Veri kalıcılığı

## 🚀 Gelecek Geliştirmeler

- [ ] Randevu düzenleme özelliği
- [ ] Takvim görünümü
- [ ] Randevu hatırlatıcıları
- [ ] Çoklu kullanıcı desteği
- [ ] Export/Import özelliği
- [ ] Tema değiştirme seçenekleri

---

**Not**: Bu proje eğitim amaçlı geliştirilmiştir ve sadece frontend teknolojileri kullanmaktadır. 