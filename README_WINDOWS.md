# 🚀 Windows Hızlı Başlangıç

Bu proje Windows PC'nızda çalışacak şekilde yapılandırılmıştır.

## ⚡ Süper Hızlı Başlangıç

### 1. Gerekli Programları İndirin:
- **Python 3.8+**: https://www.python.org/downloads/ (PATH'e eklemeyi unutmayın!)
- **Node.js LTS**: https://nodejs.org/
- **Tesseract OCR**: https://github.com/UB-Mannheim/tesseract/wiki (Türkçe dil paketi ile)

### 2. Otomatik Kurulum:
```cmd
setup_windows.bat
```
Bu dosyayı çift tıklayın, gerekli her şeyi kuracak!

### 3. Uygulamayı Başlatın:
```cmd
BASLAT_WINDOWS.bat
```
Bu dosyayı çift tıklayın, menüden istediğinizi seçin!

## 📱 Telefon Bağlantısı İçin

1. **IP adresinizi öğrenin** (BASLAT_WINDOWS.bat menüsünden "4" seçin)
2. `app/process.tsx` dosyasını açın
3. Bu satırları bulun:
   ```typescript
   const API_URL = Platform.select({
     ios: 'http://192.168.7.102:3001',
     android: 'http://192.168.7.102:3001',
     default: 'http://localhost:3001', // Web için localhost
   });
   ```
4. IP adreslerini Windows IP'nizle değiştirin:
   ```typescript
   const API_URL = Platform.select({
     ios: 'http://192.168.1.XXX:3001',
     android: 'http://192.168.1.XXX:3001',
     default: 'http://localhost:3001', // Web için localhost
   });
   ```

## 🆘 Sorun mu Yaşıyorsunuz?

- `WINDOWS_TROUBLESHOOTING.md` dosyasını okuyun
- Veya `BASLAT_WINDOWS.bat` menüsünden "5" seçin

## 📁 Dosya Açıklamaları

- `setup_windows.bat` - Otomatik kurulum
- `BASLAT_WINDOWS.bat` - Ana başlatıcı (En çok kullanacağınız)
- `start_backend_windows.bat` - Sadece backend başlat
- `start_frontend_windows.bat` - Sadece frontend başlat
- `WINDOWS_SETUP.md` - Detaylı kurulum rehberi
- `WINDOWS_TROUBLESHOOTING.md` - Sorun giderme

## 🎯 Kısa Adımlar

1. `setup_windows.bat` çalıştır
2. `BASLAT_WINDOWS.bat` çalıştır 
3. "3" seç (her ikisini birden başlat)
4. IP'ni güncelle (yukarıda anlatıldığı gibi)
5. Telefon uygulaması ile QR kod okut
6. Tadını çıkar! 🎉

---

**Not:** Mac'te geliştirilen bu proje Windows'a özel olarak uyarlanmıştır. Sorun yaşarsanız yukardaki rehberleri inceleyin! 