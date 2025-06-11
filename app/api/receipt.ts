
export async function processReceipt(imageUri: string) {
  try {
    // Base64'e çevir
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const reader = new FileReader();
    
    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        const base64data = reader.result?.toString().split(',')[1];
        
        // API'ye gönder
        const apiResponse = await fetch('http://localhost:5000/process-receipt', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: base64data
          }),
        });

        if (!apiResponse.ok) {
          throw new Error('API yanıt vermedi');
        }

        const data = await apiResponse.json();
        resolve(data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Fiş işleme hatası:', error);
    throw error;
  }
} 