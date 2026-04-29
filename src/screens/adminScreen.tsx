import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';
import Input from '../components/input';
import ToggleRow from '../components/ToggleRow';
import Button from '../components/button';

export default function AdminScreen() {
  const [upahDay1, setUpahDay1] = useState('');
  const [isDaySama, setIsDaySama] = useState(false);

  const [tanggalDay1, setTanggalDay1] = useState('');
  const [is16Day1, setIs16Day1] = useState(true);

  const [upahDay2, setUpahDay2] = useState('');
  const [tanggalDay2, setTanggalDay2] = useState('');
  const [is16Day2, setIs16Day2] = useState(true);

  // State untuk menyimpan tanggal dari database agar bisa tampil di Button
  const [dateDay1, setDateDay1] = useState<string | null>(null);
  const [dateDay2, setDateDay2] = useState<string | null>(null);

  useEffect(() => {
    if (isDaySama) {
      setUpahDay2(upahDay1);
    }
    fetchInitialDates();
  }, [isDaySama, upahDay1]);

  const fetchInitialDates = async () => {
    const d1 = await AmbilTanggalDay('day1');
    const d2 = await AmbilTanggalDay('day2');

    // Asumsikan API mengembalikan objek { tanggal: "..." }
    if (d1 && d1.tanggal) setDateDay1(d1.tanggal);
    if (d2 && d2.tanggal) setDateDay2(d2.tanggal);
  };

  const AmbilTanggalDay = async (day: string) => {
    try {
      const response = await fetch(`https://api.muhdimas.my.id/api/date?targetDay=${day}`);
      if (!response.ok) return null; // Jika status 404 atau 500, anggap data tidak ada
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  const handleSubmit = async () => {
    try {
      // Pastikan Upah Day 1 diisi
      if (!upahDay1 || !tanggalDay1) {
        alert("Mohon isi Upah dan Tanggal Day 1");
        return;
      }

      const antreanAPI = [];

      // Antrean Day 1
      antreanAPI.push({
        url: 'https://api.muhdimas.my.id/api/day1',
        payload: {
          tanggal: tanggalDay1,
          money: upahDay1,
          jam16: is16Day1
        }
      });

      // Perbaikan Logika Day 2: Cek apakah tanggalDay2 punya nilai (truthy)
      if (tanggalDay2) {
        antreanAPI.push({
          url: 'https://api.muhdimas.my.id/api/day2',
          payload: {
            tanggal: tanggalDay2,
            money: isDaySama ? upahDay1 : upahDay2, // Gunakan upahDay1 jika isDaySama aktif
            jam16: is16Day2
          }
        });
      }

      // Eksekusi antrean
      const responses = await Promise.all(
        antreanAPI.map(item =>
          fetch(item.url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item.payload)
          })
        )
      );

      // Cek apakah semua response sukses (status 200)
      const allSuccess = responses.every(res => res.ok);

      if (allSuccess) {
        alert("✅ Jadwal Lembur Berhasil Direset & Diupdate!");
      } else {
        alert("⚠️ Sebagian data gagal disimpan. Cek koneksi server.");
      }

    } catch (error) {
      alert("❌ Terjadi kesalahan jaringan.");
      console.error(error);
    }
  };

  const handlePDF = async (day: string) => {
  try {
    const url = `https://api.muhdimas.my.id/api/export-excel/${day}`;
    
    // Gunakan fetch untuk mengambil data blob
    const response = await fetch(url);
    const blob = await response.blob();
    
    // Buat URL sementara untuk file tersebut
    const blobUrl = window.URL.createObjectURL(blob);
    
    // Buat elemen anchor tersembunyi untuk memicu download
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `Laporan_Lembur_${day}.xlsx`; // Nama file
    document.body.appendChild(link);
    link.click();
    
    // Bersihkan kembali
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Download gagal:", error);
    alert("Gagal mendownload file, coba buka di browser Chrome/Safari langsung.");
  }
};

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Hello 👋🏻, ADMIN</Text>

      {/* --- FORM SECTION --- */}
      <View>
        <Input
          label="Upah Day 1"
          value={upahDay1}
          onChangeText={setUpahDay1}
          keyboardType="numeric"
        />
        <ToggleRow label="Day 1 & Day 2 Sama" value={isDaySama} onValueChange={setIsDaySama} />

        <Input
          label="Tanggal lembur ke-1"
          value={tanggalDay1}
          onChangeText={setTanggalDay1}
          isDate={true}
        />
        <ToggleRow label="16.00" value={is16Day1} onValueChange={setIs16Day1} />


        <Input
          label="Upah Day 2"
          value={isDaySama ? upahDay1 : upahDay2}
          onChangeText={setUpahDay2}
          keyboardType="numeric"
          editable={!isDaySama}
        />
        <Input
          label="Tanggal lembur ke-2"
          value={tanggalDay2}
          onChangeText={setTanggalDay2}
          isDate={true}
        />
        <ToggleRow label="16.00" value={is16Day2} onValueChange={setIs16Day2} />
      </View>

      {/* --- BOTTOM SECTION --- */}
      <View style={styles.bottomContainer}>
        <Text style={styles.noteText}>* Jangan mengisi form jika download PDF</Text>

        <Button
          title="Submit"
          onPress={handleSubmit}
          bgColor="#FFF9C4"
          textColor="#F4D03F"
        />

        {/* 3. CONDITIONAL RENDERING TOMBOL PDF */}
        <View style={{ gap: 10, marginTop: 10, flexDirection: 'row', flex: 1}}>
          {dateDay1 && (
            <Button
              title={`PDF ${dateDay1}`}
              onPress={() => handlePDF('day1')}
              bgColor="#E8F5E9"
              textColor="#74E245"
              type='pdf'
            />
          )}

          {dateDay2 && (
            <Button
              title={`PDF ${dateDay2}`}
              onPress={() => handlePDF('day2')}
              bgColor="#E8F5E9"
              textColor="#74E245"
              type='pdf'
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { padding: 30, flexGrow: 1 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#000', marginBottom: 30, marginTop: 20 },
  bottomContainer: { marginTop: 'auto', paddingTop: 40 },
  noteText: { fontSize: 12, color: '#888', marginBottom: 15 },
});