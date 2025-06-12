@echo off
echo ===================================
echo  Frontend (Expo) Başlatılıyor
echo ===================================
echo.

REM IP adresini göster
echo Windows IP adresiniz:
for /f "tokens=2 delims=:" %%i in ('ipconfig ^| findstr /c:"IPv4"') do echo %%i
echo.

echo ÖNEMLI: app/index.tsx dosyasında API_URL'yi güncelleyin!
echo API_URL = 'http://YOUR_WINDOWS_IP:3001'
echo.

REM Frontend'i başlat
echo Frontend başlatılıyor...
echo QR kod ile telefonunuzdan bağlanabilirsiniz
echo Durdurmak için Ctrl+C kullanın
echo.
npx expo start

pause 