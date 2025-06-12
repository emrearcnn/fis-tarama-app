# 📄 Fiş Tarama Uygulaması (Windows Sürümü)

## 🚀 Özellikler
- Türkçe fişlerden otomatik veri çıkarma (VKN/TCKN, tarih, toplam tutar, KDV)
- Excel'e aktarma
- Mobil ve web arayüzü (Expo/React Native)

## 🛠️ Windows Kurulum Adımları

### 1. Gerekli Programlar
- **Python 3.8+**: https://www.python.org/downloads/ (Kurulumda "Add to PATH" seçili olsun)
- **Node.js LTS**: https://nodejs.org/
- **Tesseract OCR**: https://github.com/UB-Mannheim/tesseract/wiki (Kurulumda Türkçe dil paketi seçili olsun)

### 2. Projeyi Klonla
```sh
git clone <repo-url>
cd fis-tarama-app-main
```

### 3. Backend Kurulumu
```sh
cd server
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

### 4. Frontend Kurulumu
```sh
npm install
```

### 5. Backend'i Başlat
```sh
cd server
venv\Scripts\activate
python app.py
```

### 6. Frontend'i Başlat
```sh
cd ..
npx expo start
```

### 7. Mobilde Kullanım
- Telefonun ve bilgisayarın aynı WiFi'da olduğundan emin ol.
- Expo Go uygulamasını indir.
- QR kodu telefonundan okut.

### 8. API Ayarı
- `app/services/api.ts` dosyasında şu satır olmalı:
  ```js
  const API_URL = 'http://192.168.1.138:3001';
  ```
- Eğer IP değişirse, kendi bilgisayarının IP'siyle güncelle.

### 9. Sorun Giderme
- Tesseract bulunamıyor: Kurulum yolunu ve PATH'i kontrol et.
- Port 3001 hatası: Başka bir uygulama kullanıyorsa kapat.
- Mobilde bağlantı yok: IP adresini ve WiFi bağlantısını kontrol et.

---

**Her şey hazır! Artık Windows ortamında fiş tarama uygulamasını kullanabilirsin.**
