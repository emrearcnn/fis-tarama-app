
// Arkadaşının Windows IP'si
const API_URL = 'http://192.168.1.138:3001';

export interface ReceiptData {
  'Dosya Adı': string;
  'VKN/TCKN': string;
  'Tarih': string;
  'Toplam Tutar': string;
  'KDV Tutarı': string;
}

export const processReceipt = async (imageUri: string): Promise<ReceiptData> => {
  try {
    console.log('Processing receipt with URI:', imageUri);
    console.log('API URL:', API_URL);
    
    // Base64'e çevir
    const response = await fetch(imageUri);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    
    const blob = await response.blob();
    const reader = new FileReader();
    
    const base64 = await new Promise<string>((resolve: (value: string) => void, reject: (reason?: any) => void) => {
      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    console.log('Image converted to base64, length:', base64.length);

    // API'ye gönder
    const apiResponse = await fetch(`${API_URL}/process-receipt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: base64 }),
    });

    console.log('API Response status:', apiResponse.status);

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error('API Error:', errorText);
      throw new Error(`API request failed: ${apiResponse.status} - ${errorText}`);
    }

    const data = await apiResponse.json();
    console.log('API Response data:', data);
    return data;
  } catch (error) {
    console.error('Error processing receipt:', error);
    throw error;
  }
}; 