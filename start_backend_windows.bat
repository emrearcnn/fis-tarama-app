@echo off
echo ===================================
echo  Backend (Python Flask) Başlatılıyor
echo ===================================
echo.

REM IP adresini göster
echo Windows IP adresiniz:
for /f "tokens=2 delims=:" %%i in ('ipconfig ^| findstr /c:"IPv4"') do echo %%i
echo.

REM Server klasörüne git
cd server

REM Backend'i başlat
echo Backend http://localhost:3001 adresinde başlatılıyor...
echo Durdurmak için Ctrl+C kullanın
echo.
python app.py

pause 