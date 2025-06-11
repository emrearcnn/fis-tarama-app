# 📄 Fiş Tarama Uygulaması

Türkçe fişleri tarayarak VKN/TCKN, tarih, toplam tutar ve KDV tutarını otomatik çıkaran mobil uygulama.

## 🚀 Özellikler

- ✅ **OCR Teknolojisi**: Tesseract ile Türkçe fış tarama
- ✅ **Mobil Uygulama**: Expo/React Native ile cross-platform
- ✅ **Otomatik Veri Çıkarma**: VKN/TCKN, tarih, tutarlar
- ✅ **Excel Export**: Verileri Excel dosyasına aktarma
- ✅ **Kamera & Galeri**: Fotoğraf çekme ve galeri seçimi
- ✅ **Web Arayüzü**: Tarayıcıdan da kullanılabilir

## 📱 Demo

Loglardan görüldüğü üzere başarıyla çalışıyor:
```
API Response data: {
  "Dosya Adı": "receipt_20250612_010309.jpg",
  "KDV Tutarı": "3.073,52", 
  "Tarih": "16-08-2024",
  "Toplam Tutar": "18.441,12",
  "VKN/TCKN": "Bulunamadı"
}
```

## 🛠️ Kurulum

### **📋 Gereksinimler**

#### **macOS:**
```bash
# Homebrew ile Tesseract kurulumu
brew install tesseract
brew install tesseract-lang
```

#### **Windows:**
```bash
# Chocolatey ile Tesseract kurulumu  
choco install tesseract
# VEYA manuel: https://github.com/UB-Mannheim/tesseract/wiki
```

#### **Ubuntu/Linux:**
```bash
sudo apt-get install tesseract-ocr
sudo apt-get install tesseract-ocr-tur
```

### **🔧 Proje Kurulumu**

1. **Repository'yi klonlayın:**
```bash
git clone <repository-url>
cd fisTarama-master
```

2. **Backend kurulumu:**
```bash
cd server
python -m venv venv

# macOS/Linux:
source venv/bin/activate

# Windows:
venv\Scripts\activate

pip install -r requirements.txt
```

3. **Frontend kurulumu:**
```bash
# Ana dizinde
npm install
```

### **▶️ Çalıştırma**

#### **Backend Server:**
```bash
cd server
source venv/bin/activate  # Windows: venv\Scripts\activate
python app.py
```
Server: `http://localhost:3001`

#### **Frontend:**
```bash
# Ana dizinde
npx expo start
```

### **📱 Mobil Cihazda Kullanım**

1. **Expo Go** uygulamasını indirin
2. QR kodu tarayın VEYA manuel URL: `exp://[IP]:8081`
3. Fotoğraf çekin veya galeriden seçin
4. Sonuçları görün ve Excel'e aktarın

## 🌐 Platform Uyumluluğu

| Platform | Status | Notlar |
|----------|--------|---------|
| macOS | ✅ | Tam destekli |
| Windows | ✅ | Tesseract path ayarı gerekli |
| Linux | ✅ | Tam destekli |
| iOS | ✅ | Expo Go ile |
| Android | ✅ | Expo Go ile |
| Web | ✅ | PWA desteği |

## ⚙️ Konfigürasyon

### **Windows İçin:**

`server/app.py` dosyasında Tesseract path'ini ayarlayın:

```python
# Windows için
if platform.system() == 'Windows':
    pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
```

### **IP Adresi Ayarı:**

Mobil cihazdan erişim için `app/services/api.ts`'de IP adresini güncelleyin:
```typescript
const API_URL = Platform.select({
  ios: 'http://[YOUR_IP]:3001',
  android: 'http://[YOUR_IP]:3001',
  default: 'http://localhost:3001',
});
```

## 📊 API Endpoints

- `POST /process-receipt`: Fış işleme
- `GET /export-excel`: Excel dosyası indirme  
- `GET /get-data`: Kayıtlı verileri listeleme
- `DELETE /clear-data`: Tüm verileri silme
- `GET /health`: Sağlık kontrolü

## 🗂️ Proje Yapısı

```
fisTarama-master/
├── app/                 # React Native frontend
│   ├── index.tsx       # Ana sayfa
│   ├── process.tsx     # İşlem sayfası
│   └── services/       # API servisleri
├── server/             # Python Flask backend
│   ├── app.py         # Ana server
│   ├── requirements.txt
│   └── data.json      # Veri depolamav
├── assets/            # Uygulama varlıkları
└── README.md
```

## 🔧 Sorun Giderme

### **Tesseract Bulunamadı:**
- Windows: PATH'e Tesseract dizinini ekleyin
- macOS: `brew install tesseract`
- Linux: `apt-get install tesseract-ocr`

### **Port Çakışması:**
- macOS'ta port 5000 çakışırsa → port 3001 kullanın
- Windows Firewall ayarlarını kontrol edin

### **Mobil Bağlantı:**
- Aynı WiFi ağında olduğunuzdan emin olun
- IP adresini doğru girdiğinizi kontrol edin
- Firewall ayarlarını kontrol edin

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📞 İletişim

Herhangi bir sorunuz varsa issue açabilirsiniz.

---

**✨ Proje Expo Go ile başarıyla çalışmaktadır!** 🎉
