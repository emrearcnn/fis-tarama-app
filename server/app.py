from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pytesseract
from PIL import Image
import io
import base64
import re
import pandas as pd
import os
import json
from datetime import datetime
import tempfile

app = Flask(__name__)
CORS(app)

# Veri depolama dosyası
DATA_FILE = 'receipt_data.json'

# Tesseract OCR yolu (Mac için)
# pytesseract.pytesseract.tesseract_cmd = '/opt/homebrew/bin/tesseract'  # Apple Silicon Mac
# pytesseract.pytesseract.tesseract_cmd = '/usr/local/bin/tesseract'     # Intel Mac
# Otomatik tespit
import platform
import subprocess

def find_tesseract():
    system = platform.system()
    
    if system == 'Windows':
        # Windows için varsayılan yollar
        possible_paths = [
            r'C:\Program Files\Tesseract-OCR\tesseract.exe',
            r'C:\Program Files (x86)\Tesseract-OCR\tesseract.exe',
            r'C:\tesseract\tesseract.exe',
        ]
        
        for path in possible_paths:
            if os.path.exists(path):
                print(f"Tesseract found at: {path}")
                return path
        
        print("Tesseract not found. Please install from: https://github.com/UB-Mannheim/tesseract/wiki")
        return 'tesseract'  # PATH'de bulunmasını umut et
    
    else:
        # macOS/Linux için which komutu
        try:
            result = subprocess.run(['which', 'tesseract'], capture_output=True, text=True)
            if result.returncode == 0:
                return result.stdout.strip()
        except:
            pass
        
        # Varsayılan yolları dene
        possible_paths = [
            '/opt/homebrew/bin/tesseract',  # Apple Silicon
            '/usr/local/bin/tesseract',     # Intel Mac
            '/usr/bin/tesseract'            # Linux
        ]
        
        for path in possible_paths:
            if os.path.exists(path):
                return path
        
        return 'tesseract'  # PATH'de bulunmasını umut et

pytesseract.pytesseract.tesseract_cmd = find_tesseract()

# Veri kaydetme fonksiyonu
def save_receipt_data(data):
    try:
        # Mevcut verileri oku
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                existing_data = json.load(f)
        else:
            existing_data = []
        
        # Timestamp ekle
        data['İşlem Tarihi'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        data['ID'] = len(existing_data) + 1
        
        # Yeni veriyi ekle
        existing_data.append(data)
        
        # Dosyaya kaydet
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(existing_data, f, ensure_ascii=False, indent=2)
            
        return True
    except Exception as e:
        print(f"Veri kaydetme hatası: {e}")
        return False

# Gelişmiş Regex kalıpları
vergi_no_patterns = [
    re.compile(r"(?:VKN|TCKN|Vergi\s*No|V\.?\s*No|Vergi\s*Kimlik\s*No|VD)[:\s]*([0-9]{10,11})"),
    re.compile(r"([0-9]{10,11})(?=\s*(?:VKN|TCKN|Vergi))"),
    re.compile(r"(?:Tax|VAT)\s*(?:No|ID)[:\s]*([0-9]{10,11})")
]

tarih_patterns = [
    re.compile(r"\b([0-9]{1,2})[./-]([0-9]{1,2})[./-](20[0-9]{2})\b"),
    re.compile(r"\b([0-9]{1,2})\s*(Ocak|Şubat|Mart|Nisan|Mayıs|Haziran|Temmuz|Ağustos|Eylül|Ekim|Kasım|Aralık)\s*(20[0-9]{2})\b"),
    re.compile(r"(20[0-9]{2})[./-]([0-9]{1,2})[./-]([0-9]{1,2})")
]

tutar_patterns = [
    # Türk formatı: 21.753,36 (binlik ayırıcı nokta, ondalık virgül)
    re.compile(r"(?:TOPLAM|Toplam|Tutar|TOTAL|Total)\s*[*:\s]+\s*([0-9]{1,3}(?:\.[0-9]{3})*,[0-9]{2})", re.IGNORECASE),
    re.compile(r"(?:TOPLAM|Toplam|Tutar|TOTAL|Total)\s*[*:\s]+\s*([0-9]+,[0-9]{2})", re.IGNORECASE),
    re.compile(r"(?:TOPLAM|Toplam|Tutar|TOTAL|Total)\s*[*:\s]+\s*([0-9]{1,3}(?:\.[0-9]{3})*)", re.IGNORECASE),
    re.compile(r"(?:TOPLAM|Toplam|Tutar|TOTAL|Total)\s*[*:\s]+\s*([0-9]+)", re.IGNORECASE),
    # Diğer formatlar
    re.compile(r"([0-9]{1,3}(?:\.[0-9]{3})*,[0-9]{2})\s*(?:TL|₺)", re.IGNORECASE),
    re.compile(r"(?:TOPLAM|Toplam|Tutar|TOTAL|Total)[:\s]*([0-9]{1,3}(?:\.[0-9]{3})*,[0-9]{2})", re.IGNORECASE),
    re.compile(r"(?:TOPLAM|Toplam|Tutar|TOTAL|Total)[:\s]*([0-9]+,[0-9]{2})", re.IGNORECASE),
    re.compile(r"(?:TOPLAM|Toplam|Tutar|TOTAL|Total)[:\s]*([0-9]+)", re.IGNORECASE)
]

kdv_patterns = [
    # Türk formatı: 3.625,56
    re.compile(r"(?:TOPKDV|KDV|VAT)\s*[*:\s]+\s*([0-9]{1,3}(?:\.[0-9]{3})*,[0-9]{2})", re.IGNORECASE),
    re.compile(r"(?:TOPKDV|KDV|VAT)\s*[*:\s]+\s*([0-9]+,[0-9]{2})", re.IGNORECASE),
    re.compile(r"(?:TOPKDV|KDV|VAT)\s*[*:\s]+\s*([0-9]{1,3}(?:\.[0-9]{3})*)", re.IGNORECASE),
    re.compile(r"(?:TOPKDV|KDV|VAT)\s*[*:\s]+\s*([0-9]+)", re.IGNORECASE),
    # Diğer formatlar
    re.compile(r"(?:KDV|VAT)[:\s]*([0-9]{1,3}(?:\.[0-9]{3})*,[0-9]{2})", re.IGNORECASE),
    re.compile(r"(?:KDV|VAT)[:\s]*([0-9]+,[0-9]{2})", re.IGNORECASE),
    re.compile(r"(?:KDV|VAT)[:\s]*([0-9]+)", re.IGNORECASE),
    re.compile(r"(?:%\s*18|%18)[:\s]*([0-9]+,[0-9]{2})", re.IGNORECASE)
]

@app.route('/process-receipt', methods=['POST'])
def process_receipt():
    try:
        # Base64 görüntüyü al
        data = request.json
        if not data or 'image' not in data:
            return jsonify({'error': 'No image data provided'}), 400
            
        image_data = base64.b64decode(data['image'])
        
        # Görüntüyü PIL Image'e çevir
        image = Image.open(io.BytesIO(image_data))
        
        # OCR işlemi - Türkçe ve İngilizce
        try:
            # Önce Türkçe + İngilizce deneyelim
            text = pytesseract.image_to_string(image, lang='tur+eng', config='--psm 6')
            print("OCR Text:", text)  # Debug için
            
            # Eğer yeterli metin çıkmazsa farklı PSM değerleri dene
            if len(text.strip()) < 50:
                text = pytesseract.image_to_string(image, lang='tur+eng', config='--psm 3')
                print("OCR Text (PSM 3):", text)
                
        except Exception as ocr_error:
            print("OCR Error:", str(ocr_error))
            # Sadece İngilizce dene
            try:
                text = pytesseract.image_to_string(image, lang='eng', config='--psm 6')
            except:
            return jsonify({'error': f'OCR Error: {str(ocr_error)}'}), 500
        
        # Bilgi yakalama fonksiyonları
        def find_vergi_no(text):
            for pattern in vergi_no_patterns:
                match = pattern.search(text)
                if match:
                    return match.group(1)
            return 'Bulunamadı'
        
        def find_tarih(text):
            for pattern in tarih_patterns:
                match = pattern.search(text)
                if match:
                    return match.group(0)
            return 'Bulunamadı'
        
        def find_tutar(text):
            for pattern in tutar_patterns:
                match = pattern.search(text)
                if match:
                    return match.group(1)
            return 'Bulunamadı'
        
        def find_kdv(text):
            for pattern in kdv_patterns:
                match = pattern.search(text)
                if match:
                    return match.group(1)
            return 'Bulunamadı'
        
        # Bilgileri çıkar
        vergi_no = find_vergi_no(text)
        tarih = find_tarih(text)
        toplam_tutar = find_tutar(text)
        kdv_tutari = find_kdv(text)
        
        # Sonuçları döndür
        result = {
            'Dosya Adı': f'receipt_{datetime.now().strftime("%Y%m%d_%H%M%S")}.jpg',
            'VKN/TCKN': vergi_no,
            'Tarih': tarih,
            'Toplam Tutar': toplam_tutar,
            'KDV Tutarı': kdv_tutari
        }
        
        # Veriyi kaydet
        save_receipt_data(result.copy())
        
        print("Result:", result)  # Debug için
        return jsonify(result)
        
    except Exception as e:
        print("Error:", str(e))  # Debug için
        return jsonify({'error': str(e)}), 500

@app.route('/export-excel', methods=['GET'])
def export_excel():
    try:
        # Kaydedilmiş verileri oku
        if not os.path.exists(DATA_FILE):
            return jsonify({'error': 'Henüz hiç veri kaydedilmemiş'}), 400
            
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        if not data:
            return jsonify({'error': 'Henüz hiç veri kaydedilmemiş'}), 400
        
        # DataFrame oluştur
        df = pd.DataFrame(data)
        
        # Sütun sıralaması
        columns = ['ID', 'İşlem Tarihi', 'Dosya Adı', 'VKN/TCKN', 'Tarih', 'Toplam Tutar', 'KDV Tutarı']
        df = df[columns]
        
        # Geçici Excel dosyası oluştur
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.xlsx')
        
        # Excel'e yaz
        with pd.ExcelWriter(temp_file.name, engine='openpyxl') as writer:
            df.to_excel(writer, sheet_name='Fiş Verileri', index=False)
            
            # Worksheet'i al ve biçimlendir
            worksheet = writer.sheets['Fiş Verileri']
            
            # Sütun genişliklerini ayarla
            for column in worksheet.columns:
                max_length = 0
                column_letter = column[0].column_letter
                for cell in column:
                    try:
                        if len(str(cell.value)) > max_length:
                            max_length = len(str(cell.value))
                    except:
                        pass
                adjusted_width = min(max_length + 2, 50)
                worksheet.column_dimensions[column_letter].width = adjusted_width
        
        # Dosya adını oluştur
        filename = f'Fiş_Verileri_{datetime.now().strftime("%Y%m%d_%H%M%S")}.xlsx'
        
        return send_file(
            temp_file.name,
            as_attachment=True,
            download_name=filename,
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        
    except Exception as e:
        print("Excel export error:", str(e))
        return jsonify({'error': str(e)}), 500

@app.route('/get-data', methods=['GET'])
def get_data():
    try:
        if not os.path.exists(DATA_FILE):
            return jsonify([])
            
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        return jsonify(data)
        
    except Exception as e:
        print("Get data error:", str(e))
        return jsonify({'error': str(e)}), 500

@app.route('/clear-data', methods=['DELETE'])
def clear_data():
    try:
        if os.path.exists(DATA_FILE):
            os.remove(DATA_FILE)
        return jsonify({'message': 'Tüm veriler temizlendi'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'OK', 'tesseract_path': pytesseract.pytesseract.tesseract_cmd})

if __name__ == '__main__':
    app.run(debug=True, port=3001, host='0.0.0.0') 