@echo off
echo ===================================
echo  FisTarama Windows Kurulum Script
echo ===================================
echo.

REM Python kontrolü
echo [1/4] Python kontrol ediliyor...
python --version >nul 2>&1
if errorlevel 1 (
    echo HATA: Python kurulu değil!
    echo Python'u şu adresten indirin: https://www.python.org/downloads/
    echo Kurulum sırasında "Add Python to PATH" seçeneğini işaretleyin
    pause
    exit /b 1
) else (
    echo ✓ Python mevcut
)

REM Node.js kontrolü
echo [2/4] Node.js kontrol ediliyor...
node --version >nul 2>&1
if errorlevel 1 (
    echo HATA: Node.js kurulu değil!
    echo Node.js'i şu adresten indirin: https://nodejs.org/
    pause
    exit /b 1
) else (
    echo ✓ Node.js mevcut
)

REM Tesseract kontrolü
echo [3/4] Tesseract OCR kontrol ediliyor...
tesseract --version >nul 2>&1
if errorlevel 1 (
    echo UYARI: Tesseract OCR bulunamadı!
    echo Tesseract'i şu adresten indirin: https://github.com/UB-Mannheim/tesseract/wiki
    echo Türkçe dil paketi ile birlikte kurun
    echo Devam etmek için Enter'a basın...
    pause
)

REM Python bağımlılıklarını yükle
echo [4/4] Python bağımlılıkları yükleniyor...
cd server
python -m pip install --upgrade pip
pip install -r requirements.txt
if errorlevel 1 (
    echo HATA: Python bağımlılıkları yüklenemedi!
    pause
    exit /b 1
)

REM Ana dizine dön
cd ..

REM Node.js bağımlılıklarını yükle
echo Frontend bağımlılıkları yükleniyor...
npm install
if errorlevel 1 (
    echo HATA: Node.js bağımlılıkları yüklenemedi!
    pause
    exit /b 1
)

echo.
echo ===================================
echo  Kurulum tamamlandı!
echo ===================================
echo.
echo Projeyi çalıştırmak için:
echo 1. Backend: cd server && python app.py
echo 2. Frontend: npx expo start
echo.
echo IP adresinizi öğrenmek için: ipconfig
echo app/index.tsx dosyasında API_URL'yi güncelleyin
echo.
pause 