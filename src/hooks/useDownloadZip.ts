// src/hooks/useDownloadZip.ts
import { useState } from 'react';
import { Platform } from 'react-native';
import * as ExpoFileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const FileSystem = ExpoFileSystem as any;

export const useDownloadZip = () => {
  const [loadingDay1, setLoadingDay1] = useState(false);
  const [loadingDay2, setLoadingDay2] = useState(false);

  const downloadZip = async (day: 'day1' | 'day2') => {
    day === 'day1' ? setLoadingDay1(true) : setLoadingDay2(true);
    try {
      const url = `https://api.muhdimas.my.id/api/admin/download-zip?targetDay=${day}`;
      const fileName = `Lampiran_Lembur_${day.toUpperCase()}.zip`;

      if (Platform.OS === 'web') {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Gagal mengunduh');
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
        const fileUri = `${FileSystem.cacheDirectory}${fileName}`;
        const { uri, status } = await FileSystem.downloadAsync(url, fileUri);
        if (status === 200 && await Sharing.isAvailableAsync()) await Sharing.shareAsync(uri);
        else alert('Gagal mengunduh atau fitur tidak didukung.');
      }
    } catch (e) {
      alert('Terjadi kesalahan saat mengunduh.');
    } finally {
      day === 'day1' ? setLoadingDay1(false) : setLoadingDay2(false);
    }
  };

  return { downloadZip, loadingDay1, loadingDay2 };
};