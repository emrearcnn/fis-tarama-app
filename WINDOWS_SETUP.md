# Windows Kurulum Rehberi

## 1. Python Kurulumu
1. Python 3.8+ indirin: https://www.python.org/downloads/
2. Kurulum sırasında "Add Python to PATH" seçeneğini işaretleyin
3. CMD'de test edin: `python --version`

## 2. Tesseract OCR Kurulumu
1. Tesseract OCR'i indirin: https://github.com/UB-Mannheim/tesseract/wiki
2. Varsayılan yola kurun: `C:\Program Files\Tesseract-OCR\`
3. Türkçe dil paketi yüklendiğinden emin olun
4. CMD'de test edin: `tesseract --version`

## 3. Node.js Kurulumu
1. Node.js indirin: https://nodejs.org/
2. LTS versiyonunu seçin
3. CMD'de test edin: `node --version` ve `npm --version`

## 4. Git Kurulumu
1. Git indirin: https://git-scm.com/download/win
2. CMD'de test edin: `git --version`

## 5. Projeyi Klonlama ve Kurulum

### Backend (Python Flask):
```cmd
cd server
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### Frontend (React Native):
```cmd
npm install
```

## 6. Projeyi Çalıştırma

### Backend'i başlatın:
```cmd
cd server
python app.py
```

### Frontend'i başlatın (yeni terminal):
```cmd
npx expo start
```

## 7. IP Adresi Ayarları

Windows'ta IP adresinizi bulun:
```cmd
ipconfig | findstr IPv4
```

`app/index.tsx` dosyasında API URL'ini güncelleyin:
```typescript
const API_URL = 'http://YOUR_WINDOWS_IP:3001';
```

## 8. Güvenlik Duvarı Ayarları

Windows Defender Firewall'da 3001 portunu açın:
1. Windows Defender Güvenlik Duvarı'nı açın
2. Gelişmiş ayarlar
3. Gelen kurallar → Yeni kural
4. Port → TCP → 3001
5. Bağlantıya izin ver

## 9. Sorun Giderme

### Tesseract bulunamıyor hatası:
- Tesseract'in doğru yolda kurulu olduğundan emin olun
- Windows ortam değişkenlerine Tesseract yolunu ekleyin

### Port 3001 kullanımda hatası:
- `netstat -ano | findstr 3001` ile portu kontrol edin
- Çakışan süreci sonlandırın

### Python modülü bulunamıyor:
```cmd
pip install --upgrade pip
pip install -r requirements.txt
```

### Expo çalışmıyor:
```cmd
npm install -g @expo/cli
expo install
``` 