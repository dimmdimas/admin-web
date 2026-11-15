import { useState } from 'react';
import { Platform, Alert } from 'react-native';
// 1. Import dengan nama alias
import * as ExpoFileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

// 2. Paksa TypeScript agar tidak protes (Jurus asli Anda)
const FileSystem = ExpoFileSystem as any;

export const useDownloadExcel = () => {
  const [loadingDay1, setLoadingDay1] = useState(false);
  const [loadingDay2, setLoadingDay2] = useState(false);

  const downloadExcel = async (day: 'day1' | 'day2') => {
    day === 'day1' ? setLoadingDay1(true) : setLoadingDay2(true);
    
    try {
      // URL tetap sama, mengikuti endpoint API Anda
      const url = `https://api.muhdimas.my.id/api/admin/download-zip?targetDay=${day}`;
      
      // 1. UBAH EKSTENSI MENJADI .xlsx
      const fileName = `Lampiran_Lembur_${day.toUpperCase()}.xlsx`;

      if (Platform.OS === 'web') {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Gagal mengunduh data dari server');
        
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
        
      } else {
        // Kembali menggunakan cacheDirectory yang sudah terbukti cocok dengan versi Expo Anda
        const fileUri = `${FileSystem.cacheDirectory}${fileName}`;
        const { uri, status } = await FileSystem.downloadAsync(url, fileUri);
        
        if (status === 200 && await Sharing.isAvailableAsync()) {
          // Tetap gunakan mimeType agar dikenali sebagai Excel
          await Sharing.shareAsync(uri, {
            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            dialogTitle: 'Simpan Laporan Excel Lembur',
          });
        } else {
          Alert.alert('Gagal', 'Gagal mengunduh atau fitur berbagi tidak didukung.');
        }
      }
    } catch (e: any) {
      console.error(e);
      Alert.alert('Error', 'Terjadi kesalahan saat mengunduh.');
    } finally {
      day === 'day1' ? setLoadingDay1(false) : setLoadingDay2(false);
    }
  };

  return { downloadExcel, loadingDay1, loadingDay2 };
};