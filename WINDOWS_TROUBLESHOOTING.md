# Windows Sorun Giderme Rehberi

## Yaygın Hatalar ve Çözümleri

### 1. "Python is not recognized" Hatası

**Sebep:** Python PATH'e eklenmemiş

**Çözüm:**
```cmd
# Python kurulu mu kontrol et
python --version

# Eğer hata alıyorsan:
# 1. Python'u yeniden kur ve "Add Python to PATH" seçeneğini işaretle
# 2. Veya manuel olarak PATH'e ekle:
#    - Windows arama: "Environment Variables"
#    - PATH değişkenine Python yolunu ekle: C:\Python39\Scripts\;C:\Python39\
```

### 2. "Tesseract is not installed" Hatası

**Sebep:** Tesseract kurulu değil veya PATH'te değil

**Çözüm:**
```cmd
# 1. Tesseract'i indir ve kur:
# https://github.com/UB-Mannheim/tesseract/wiki

# 2. Türkçe dil paketi dahil et

# 3. PATH'e ekle veya uygulama otomatik bulacak:
# C:\Program Files\Tesseract-OCR\
```

### 3. "Port 3001 is already in use" Hatası

**Sebep:** Port başka bir uygulama tarafından kullanılıyor

**Çözüm:**
```cmd
# Portu kullanan uygulamayı bul
netstat -ano | findstr 3001

# Process ID'yi al ve uygulamayı sonlandır
taskkill /PID [PROCESS_ID] /F

# Veya farklı port kullan (server/app.py'de port=3002 yap)
```

### 4. "ModuleNotFoundError" Hatası

**Sebep:** Python paketleri kurulmamış

**Çözüm:**
```cmd
cd server
pip install -r requirements.txt

# Eğer hala hata alıyorsan:
python -m pip install --upgrade pip
pip install flask flask-cors pytesseract Pillow pandas openpyxl
```

### 5. "No module named 'cv2'" Hatası

**Sebep:** OpenCV kurulu değil (isteğe bağlı)

**Çözüm:**
```cmd
pip install opencv-python
```

### 6. Expo/React Native Hataları

**Sebep:** Node.js bağımlılıkları eksik

**Çözüm:**
```cmd
# Node modules'ı temizle ve yeniden yükle
rmdir /s node_modules
del package-lock.json
npm install

# Expo CLI güncel değilse:
npm install -g @expo/cli@latest
```

### 7. IP Adresi Bağlantı Sorunu

**Sebep:** Güvenlik duvarı veya yanlış IP

**Çözüm:**
```cmd
# IP adresini doğru al
ipconfig | findstr IPv4

# Güvenlik duvarında port 3001'i aç:
# Windows Defender Firewall > Advanced settings > Inbound Rules > New Rule > Port > TCP > 3001

# app/index.tsx'te API_URL'yi güncelle:
# API_URL = 'http://192.168.1.XXX:3001'
```

### 8. OCR Sonuçları Gelmiyor

**Sebep:** Tesseract dil paketi veya görüntü kalitesi

**Çözüm:**
- Tesseract kurulumunda Turkish (tur) dil paketini seç
- Görüntü kalitesini artır
- Işık iyi olan ortamda fotoğraf çek

### 9. Excel Export Çalışmıyor

**Sebep:** openpyxl paketi eksik

**Çözüm:**
```cmd
pip install openpyxl
```

### 10. Metro bundler başlamıyor

**Sebep:** Cache sorunu

**Çözüm:**
```cmd
npx expo start --clear
# veya
npx expo start -c
```

## Hızlı Test Adımları

1. **Backend Test:**
```cmd
cd server
python app.py
# Tarayıcıda: http://localhost:3001/health
```

2. **Frontend Test:**
```cmd
npx expo start
# QR kod görünmeli
```

3. **Bağlantı Test:**
```cmd
# Windows IP'ni al
ipconfig | findstr IPv4

# app/process.tsx'te kontrol et:
# ios: 'http://[WINDOWS_IP]:3001',
# android: 'http://[WINDOWS_IP]:3001',
```

## Acil Durum Komutları

```cmd
# Tüm Python process'lerini sonlandır
taskkill /f /im python.exe

# Tüm node process'lerini sonlandır  
taskkill /f /im node.exe

# Port 3001'i kullanan process'i sonlandır
for /f "tokens=5" %a in ('netstat -ano ^| findstr 3001') do taskkill /PID %a /F

# Projeyi sıfırdan başlat
rmdir /s node_modules
del package-lock.json
npm install
cd server
pip install -r requirements.txt
``` 