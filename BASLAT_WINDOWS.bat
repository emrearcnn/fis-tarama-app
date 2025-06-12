@echo off
title FisTarama - Windows Launcher
color 0A

echo ===============================================
echo           FisTarama Uygulamasi
echo ===============================================
echo.
echo 1. Backend Baslat (Python Flask)
echo 2. Frontend Baslat (Expo React Native)  
echo 3. Her ikisini birden baslat
echo 4. IP Adresimi goster
echo 5. Sorun giderme
echo 6. Cikis
echo.

set /p choice="Seciminiz (1-6): "

if "%choice%"=="1" goto backend
if "%choice%"=="2" goto frontend  
if "%choice%"=="3" goto both
if "%choice%"=="4" goto showip
if "%choice%"=="5" goto troubleshoot
if "%choice%"=="6" goto exit

:backend
echo.
echo Backend baslatiliyor...
start cmd /k "cd server && python app.py"
goto menu

:frontend
echo.
echo Frontend baslatiliyor...
echo IP adresinizi kontrol edin ve app/index.tsx dosyasinda API_URL'yi guncelleyin!
start cmd /k "npx expo start"
goto menu

:both
echo.
echo Backend baslatiliyor...
start "Backend" cmd /k "cd server && python app.py"
timeout /t 3 /nobreak >nul
echo Frontend baslatiliyor...
start "Frontend" cmd /k "npx expo start"
goto menu

:showip
echo.
echo Windows IP Adresiniz:
ipconfig | findstr IPv4
echo.
echo Bu IP'yi app/index.tsx dosyasinda kullanin:
echo API_URL = 'http://[YUKARIDAKI_IP]:3001'
echo.
pause
goto menu

:troubleshoot
echo.
echo Sorun giderme kontrolleri:
echo.
echo Python kontrol:
python --version 2>nul && echo ✓ Python mevcut || echo ✗ Python kurulu degil
echo.
echo Node.js kontrol:
node --version 2>nul && echo ✓ Node.js mevcut || echo ✗ Node.js kurulu degil
echo.
echo Tesseract kontrol:
tesseract --version 2>nul && echo ✓ Tesseract mevcut || echo ✗ Tesseract kurulu degil
echo.
echo Port 3001 kontrol:
netstat -an | findstr 3001 && echo ⚠ Port 3001 kullanilmakta || echo ✓ Port 3001 musait
echo.
echo Detayli sorun giderme icin WINDOWS_TROUBLESHOOTING.md dosyasini okuyun
echo.
pause
goto menu

:menu
echo.
echo Ana menuye donmek icin Enter'a basin...
pause >nul
cls
goto start

:exit
echo.
echo Cikiliyor... Gorusmek uzere!
timeout /t 2 /nobreak >nul
exit

:start
cls
echo ===============================================
echo           FisTarama Uygulamasi
echo ===============================================
echo.
echo 1. Backend Baslat (Python Flask)
echo 2. Frontend Baslat (Expo React Native)  
echo 3. Her ikisini birden baslat
echo 4. IP Adresimi goster
echo 5. Sorun giderme
echo 6. Cikis
echo.

set /p choice="Seciminiz (1-6): "

if "%choice%"=="1" goto backend
if "%choice%"=="2" goto frontend  
if "%choice%"=="3" goto both
if "%choice%"=="4" goto showip
if "%choice%"=="5" goto troubleshoot
if "%choice%"=="6" goto exit

goto start 