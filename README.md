# Fiş İşleme Uygulaması

Bu uygulama, fiş fotoğraflarını çekip OCR ile metin çıkarma ve bilgileri analiz etme özelliğine sahip bir React Native uygulamasıdır.

## Özellikler

- Kamera ile fiş fotoğrafı çekme
- Galeriden fiş fotoğrafı seçme
- OCR ile metin çıkarma
- Fiş bilgilerini analiz etme (VKN/TCKN, Tarih, Toplam Tutar, KDV Tutarı)
- Sonuçları görüntüleme

## Kurulum

### Gereksinimler

- Node.js
- Python 3.x
- Tesseract OCR
- Expo CLI

### Backend Kurulumu

1. Python bağımlılıklarını yükleyin:
```bash
cd server
pip install -r requirements.txt
```

2. Tesseract OCR'ı yükleyin:
- Windows: https://github.com/UB-Mannheim/tesseract/wiki
- Yükleme sırasında "Additional language data" seçeneğini işaretleyin

3. Backend'i başlatın:
```bash
python app.py
```

### Frontend Kurulumu

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. Uygulamayı başlatın:
```bash
npx expo start
```

3. Expo Go uygulamasını kullanarak test edin

## Kullanım

1. Ana ekranda "Fotoğraf Çek" veya "Galeriden Seç" butonlarını kullanın
2. Fiş fotoğrafını çekin veya seçin
3. Fotoğraf otomatik olarak işlenecek ve sonuçlar gösterilecektir

## Teknolojiler

- React Native
- Expo
- Python
- Flask
- Tesseract OCR
- TypeScript
