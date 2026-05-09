import React from 'react';
import { View, StyleSheet } from 'react-native';
import Button from './button'; // Sesuaikan path komponen Button custom Anda

// --- DEFINISI PROPS ---
interface DownloadExcelSectionProps {
  dateDay1: string | null;
  dateDay2: string | null;
  onDownload: (day: 'day1' | 'day2') => void;
}

export default function DownloadExcelSection({
  dateDay1,
  dateDay2,
  onDownload
}: DownloadExcelSectionProps) {
  
  // Jika kedua tanggal kosong, kita tidak perlu me-render View pembungkusnya
  if (!dateDay1 && !dateDay2) return null;

  return (
    <View style={styles.container}>
      {/* Tombol Day 1 */}
      {dateDay1 ? (
        <Button
          title={`EXCEL ${dateDay1}`}
          onPress={() => onDownload('day1')}
          bgColor="#E8F5E9"
          textColor="#57a934"
          type='excel'
        />
      ) : null}

      {/* Tombol Day 2 */}
      {dateDay2 ? (
        <Button
          title={`EXCEL ${dateDay2}`}
          onPress={() => onDownload('day2')}
          bgColor="#E8F5E9"
          textColor="#57a934"
          type='excel'
        />
      ) : null}
    </View>
  );
}

// --- STYLE KHUSUS ---
const styles = StyleSheet.create({
  container: {
    gap: 10, 
    marginTop: 10, 
    flexDirection: 'row', 
    flex: 1 
  }
});