import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Alert, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Uyarı', 'Galeri erişimi için izin gereklidir!');
        }
      }
    })();

    // PWA için service worker kaydet
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('Service Worker registered'))
        .catch(err => console.log('Service Worker registration failed', err));
    }
  }, []);

  const pickImageFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        console.log('Selected image:', imageUri);
        router.push(`/process?imageUri=${encodeURIComponent(imageUri)}`);
      }
    } catch (error) {
      console.error('Gallery error:', error);
      Alert.alert('Hata', 'Galeri açılırken bir hata oluştu');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Hata', 'Kamera izni gereklidir');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        console.log('Captured image:', imageUri);
        router.push(`/process?imageUri=${encodeURIComponent(imageUri)}`);
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Hata', 'Kamera açılırken bir hata oluştu');
    }
  };

  const testWithSampleImage = () => {
    // Web için test URL'i
    const sampleImageUri = 'https://via.placeholder.com/400x300.png?text=Sample+Receipt';
    router.push(`/process?imageUri=${encodeURIComponent(sampleImageUri)}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📄 Fiş Tarama Uygulaması</Text>
        <Text style={styles.subtitle}>
          Fişlerinizi tarayın ve otomatik olarak bilgileri çıkarın
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.galleryButton} onPress={pickImageFromGallery}>
          <Text style={styles.buttonText}>📂 Galeriden Seç</Text>
        </TouchableOpacity>

        {Platform.OS !== 'web' && (
          <TouchableOpacity style={styles.cameraButton} onPress={takePhoto}>
            <Text style={styles.buttonText}>📷 Fotoğraf Çek</Text>
          </TouchableOpacity>
        )}

        {Platform.OS === 'web' && (
          <TouchableOpacity style={styles.testButton} onPress={testWithSampleImage}>
            <Text style={styles.buttonText}>🧪 Test Et</Text>
          </TouchableOpacity>
        )}
      </View>

      {Platform.OS === 'web' && (
        <View style={styles.pwaInfo}>
          <Text style={styles.pwaText}>
            📱 Bu uygulamayı telefon ana ekranınıza ekleyebilirsiniz!
          </Text>
          <Text style={styles.pwaSubText}>
            Tarayıcı menüsünden "Ana ekrana ekle" seçeneğini kullanın
          </Text>
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.infoTitle}>ℹ️ Desteklenen Bilgiler:</Text>
        <Text style={styles.infoText}>• VKN/TCKN numarası</Text>
        <Text style={styles.infoText}>• Tarih</Text>
        <Text style={styles.infoText}>• Toplam tutar</Text>
        <Text style={styles.infoText}>• KDV tutarı</Text>
        <Text style={styles.infoText}>• Excel'e aktarma</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2196F3',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    gap: 20,
    marginBottom: 40,
  },
  galleryButton: {
    backgroundColor: '#4CAF50',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cameraButton: {
    backgroundColor: '#2196F3',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  testButton: {
    backgroundColor: '#FF9800',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  pwaInfo: {
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  pwaText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 5,
  },
  pwaSubText: {
    fontSize: 12,
    color: '#1976D2',
  },
  info: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
}); 