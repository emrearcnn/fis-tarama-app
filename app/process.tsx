import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { processReceipt, ReceiptData } from './services/api';

// API URL sabiti - mobil için Mac IP'si
const API_URL = Platform.select({
  ios: 'http://192.168.7.102:3001',
  android: 'http://192.168.7.102:3001',
  default: 'http://localhost:3001', // Web için localhost
});

export default function ProcessScreen() {
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [exporting, setExporting] = useState(false);

  const processImage = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!imageUri) {
        throw new Error('Resim URI bulunamadı');
      }
      
      console.log('Starting to process image...');
      
      // Timeout ekle (30 saniye)
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('İşlem zaman aşımına uğradı (30 saniye)')), 30000)
      );
      
      const data = await Promise.race([
        processReceipt(imageUri),
        timeoutPromise
      ]) as ReceiptData;
      
      setReceiptData(data);
      console.log('Process completed successfully');
    } catch (err) {
      console.error('Process error:', err);
      setError(err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = async () => {
    try {
      setExporting(true);

      const response = await fetch(`${API_URL}/export-excel`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Excel export başarısız');
      }

      // Web için dosya indirme
      if (Platform.OS === 'web') {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Fiş_Verileri_${new Date().toISOString().slice(0, 10)}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        Alert.alert('Başarılı', 'Excel dosyası indirildi!');
      } else {
        Alert.alert('Bilgi', 'Excel export özelliği şu anda sadece web\'de çalışmaktadır.');
      }
      
    } catch (err) {
      console.error('Excel export error:', err);
      Alert.alert('Hata', err instanceof Error ? err.message : 'Excel export hatası');
    } finally {
      setExporting(false);
    }
  };

  const showAllData = async () => {
    try {
      const response = await fetch(`${API_URL}/get-data`);
      const data = await response.json();
      
      if (data.length === 0) {
        Alert.alert('Bilgi', 'Henüz hiç veri kaydedilmemiş');
        return;
      }

      Alert.alert(
        'Kayıtlı Veriler', 
        `Toplam ${data.length} adet fiş kaydedilmiş.\n\nSon kayıt: ${data[data.length-1]['İşlem Tarihi']}`
      );
      
    } catch (err) {
      Alert.alert('Hata', 'Veriler getirilemedi');
    }
  };

  const clearAllData = async () => {
    Alert.alert(
      'Tüm Verileri Sil',
      'Kaydedilmiş tüm fiş verilerini silmek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await fetch(`${API_URL}/clear-data`, { method: 'DELETE' });
              Alert.alert('Başarılı', 'Tüm veriler silindi');
            } catch (err) {
              Alert.alert('Hata', 'Veriler silinemedi');
            }
          }
        }
      ]
    );
  };

  useEffect(() => {
    processImage();
  }, [imageUri]);

  const retryProcess = () => {
    processImage();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Fiş işleniyor...</Text>
        <Text style={styles.subText}>Bu işlem 10-30 saniye sürebilir</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Hata: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={retryProcess}>
          <Text style={styles.retryButtonText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.content}>
        <Text style={styles.title}>Fiş Bilgileri</Text>
        {receiptData && (
          <>
            <View style={styles.row}>
              <Text style={styles.label}>Dosya Adı:</Text>
              <Text style={styles.value}>{receiptData['Dosya Adı']}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>VKN/TCKN:</Text>
              <Text style={styles.value}>{receiptData['VKN/TCKN']}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Tarih:</Text>
              <Text style={styles.value}>{receiptData['Tarih']}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Toplam Tutar:</Text>
              <Text style={styles.value}>{receiptData['Toplam Tutar']}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>KDV Tutarı:</Text>
              <Text style={styles.value}>{receiptData['KDV Tutarı']}</Text>
            </View>
          </>
        )}
        
        <Text style={styles.sectionTitle}>İşlemler</Text>
        
        <TouchableOpacity style={styles.retryButton} onPress={retryProcess}>
          <Text style={styles.retryButtonText}>Yeniden İşle</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.exportButton, exporting && styles.disabledButton]} 
          onPress={exportToExcel}
          disabled={exporting}
        >
          <Text style={styles.exportButtonText}>
            {exporting ? 'Excel Hazırlanıyor...' : '📊 Excel\'e Aktar'}
          </Text>
        </TouchableOpacity>

        <View style={styles.dataButtonsContainer}>
          <TouchableOpacity style={styles.dataButton} onPress={showAllData}>
            <Text style={styles.dataButtonText}>📋 Kayıtları Gör</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.dataButton, styles.deleteButton]} onPress={clearAllData}>
            <Text style={styles.dataButtonText}>🗑️ Tümünü Sil</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    flexGrow: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: '#666',
  },
  value: {
    flex: 2,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  subText: {
    marginTop: 5,
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  exportButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
    alignItems: 'center',
  },
  exportButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  dataButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  dataButton: {
    backgroundColor: '#FF9800',
    padding: 15,
    borderRadius: 10,
    flex: 0.48,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  dataButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 