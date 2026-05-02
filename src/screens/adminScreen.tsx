import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, Switch, TouchableOpacity, TextInput } from 'react-native';
import * as Clipboard from 'expo-clipboard';
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

  // State monitoring
  const [totalNik, setTotalNik] = useState(0);
  const [belumAbsenCount, setBelumAbsenCount] = useState(0);
  const [listBelumAbsen, setListBelumAbsen] = useState<{ nik: string, nama: string }[]>([]);

  // State untuk UI Modal & Toggle
  const [isSemuaKaryawan, setIsSemuaKaryawan] = useState(false);
  const [modalCekVisible, setModalCekVisible] = useState(false);

  // (Gunakan modal input dari logika multi-line sebelumnya)
  const [modalInputVisible, setModalInputVisible] = useState(false);
  const [nikBulk, setNikBulk] = useState('');

  useEffect(() => {
    if (isDaySama) {
      setUpahDay2(upahDay1);
    }
  }, [isDaySama, upahDay1]);

  // 2. useEffect KHUSUS untuk ambil data awal (HANYA berjalan 1x saat aplikasi baru dibuka)
  useEffect(() => {
    fetchInitialDates();
    fetchMonitoringData();
  }, []);

  const handleCopyList = async () => {
    if (listBelumAbsen.length === 0) {
      alert("Daftar kosong, tidak ada yang bisa disalin.");
      return;
    }

    const textToCopy = listBelumAbsen
      .map(item => `- *${item.nik}* [${item.nama}]`)
      .join('\n');

    try {
      // Gunakan setStringAsync untuk expo-clipboard
      await Clipboard.setStringAsync(textToCopy);
      alert("✅ Daftar berhasil disalin!\nSiap di-paste ke WhatsApp.");
    } catch (error) {
      alert("❌ Gagal menyalin teks.");
      console.error(error);
    }
  };

  const handleUploadList = async () => {
    if (!nikBulk) return alert("Masukkan daftar NIK terlebih dahulu");

    // 1. Pecah string berdasarkan enter (\n)
    // 2. Bersihkan sisa spasi (trim)
    // 3. Buang baris yang kosong (filter)
    const nikArray = nikBulk
      .split('\n')
      .map(nik => nik.trim())
      .filter(nik => nik !== "");

    if (nikArray.length === 0) return alert("Daftar NIK tidak valid");

    try {
      const response = await fetch('https://api.muhdimas.my.id/api/list-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nils: nikArray }) // Pastikan nama key sesuai dengan backend kamu
      });

      if (response.ok) {
        alert("✅ Daftar monitoring berhasil diperbarui!");
        setNikBulk(''); // Kosongkan text area
        setModalInputVisible(false); // Tutup modal
        fetchMonitoringData(); // Otomatis refresh angka di dashboard!
      } else {
        alert("❌ Gagal memperbarui daftar");
      }
    } catch (error) {
      console.error(error);
      alert("❌ Terjadi kesalahan jaringan");
    }
  };

  // Fungsi untuk mengambil data monitoring dari Backend
  const fetchMonitoringData = async () => {
    try {
      // Hapus tambahan &semua=... di URL ini
      const response = await fetch(`https://api.muhdimas.my.id/api/monitoring/status?day=day1`);

      if (response.ok) {
        const data = await response.json();
        setTotalNik(data.totalNik);
        setBelumAbsenCount(data.totalBelumAbsen);
        setListBelumAbsen(data.listBelumAbsen);
      }
    } catch (error) {
      console.error("Gagal fetch monitoring:", error);
    }
  };

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
        let pesanTambahan = "";

        // ---> LOGIKA BARU: Jika Toggle Nyala, langsung tembak API list-users <---
        if (isSemuaKaryawan) {
          const listResponse = await fetch('https://api.muhdimas.my.id/api/list-users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isSemua: true })
          });

          if (listResponse.ok) {
            pesanTambahan = "\n✅ Seluruh NIK berhasil ditarik ke monitoring!";
          } else {
            pesanTambahan = "\n⚠️ Jadwal terupdate, tapi gagal menarik data karyawan.";
          }
        }

        // Tampilkan alert gabungan
        alert("✅ Jadwal Berhasil Diupdate!" + pesanTambahan);

        // Refresh data di UI
        fetchInitialDates();
        fetchMonitoringData();
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

      {/* --- KOTAK MONITORING --- */}
      <View style={styles.monitoringCard}>
        <View style={styles.row}>

          {/* Kolom Kiri: Angka */}
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Jumlah NIK</Text>
              <Text style={styles.statNumber}>{totalNik}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statLabel, { color: 'red' }]}>Belum Absen</Text>
              <Text style={[styles.statNumber, { color: 'red' }]}>{belumAbsenCount}</Text>
            </View>
          </View>

          {/* Kolom Kanan: Tombol */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: '#FFCDD2' }]}
              onPress={() => setModalCekVisible(true)}
            >
              <Text style={[styles.btnText, { color: '#D32F2F' }]}>CEK</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.btn,
                { backgroundColor: '#DCEDC8', marginTop: 10 },
                // Tambahkan efek transparan jika toggle nyala
                isSemuaKaryawan && { opacity: 0.5 }
              ]}
              onPress={() => setModalInputVisible(true)}
              disabled={isSemuaKaryawan} // <--- Tombol mati saat toggle ON
            >
              <Text style={[styles.btnText, { color: '#33691E' }]}>INPUT</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* MODAL UNTUK INPUT DAFTAR NIK (MULTILINE) */}
        <Modal visible={modalInputVisible} animationType="fade" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Input NIK Monitoring</Text>
              <Text style={{ fontSize: 12, color: 'gray', marginBottom: 15, textAlign: 'center' }}>
                Ketik atau Paste NIK. Gunakan tombol Enter untuk NIK selanjutnya.
              </Text>

              <TextInput
                style={styles.textArea}
                multiline={true}
                numberOfLines={10}
                placeholder="Contoh:&#10;12345&#10;67890&#10;11121" // &#10; adalah kode untuk Enter di placeholder
                value={nikBulk}
                onChangeText={setNikBulk}
                textAlignVertical="top" // Wajib untuk Android agar ngetik mulai dari atas, bukan tengah
              />

              {/* Tombol Aksi dalam Modal */}
              <View style={styles.modalActionRow}>
                <TouchableOpacity
                  style={[styles.btn, { backgroundColor: '#EEEEEE', flex: 1, marginRight: 10 }]}
                  onPress={() => setModalInputVisible(false)}
                >
                  <Text style={[styles.btnText, { color: '#757575' }]}>Batal</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.btn, { backgroundColor: '#DCEDC8', flex: 1 }]}
                  onPress={handleUploadList}
                >
                  <Text style={[styles.btnText, { color: '#33691E' }]}>Simpan</Text>
                </TouchableOpacity>
              </View>

            </View>
          </View>
        </Modal>

        {/* Toggle Bawah */}
        <View style={styles.toggleRow}>
          <Switch
            trackColor={{ false: "#767577", true: "#00E676" }}
            thumbColor={"#f4f3f4"}
            onValueChange={setIsSemuaKaryawan}
            value={isSemuaKaryawan}
          />
          <Text style={styles.toggleText}>Semua Karyawan</Text>
        </View>
      </View>

      {/* MODAL UNTUK CEK DAFTAR BELUM ABSEN */}
      <Modal visible={modalCekVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Daftar Belum Absen</Text>

            <ScrollView style={{ width: '100%', maxHeight: 300 }}>
              {listBelumAbsen.length === 0 ? (
                <Text style={{ textAlign: 'center', marginTop: 20 }}>🎉 Semua sudah absen!</Text>
              ) : (
                listBelumAbsen.map((item, index) => (
                  <View key={index} style={styles.listItem}>
                    <Text style={{ fontWeight: 'bold' }}>{item.nik}</Text>
                    <Text>{item.nama}</Text>
                  </View>
                ))
              )}
            </ScrollView>

            {/* Tombol Copy & Tutup Sejajar */}
            <View style={styles.modalActionRow}>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: '#E3F2FD', flex: 1, marginRight: 10 }]}
                onPress={handleCopyList}
              >
                <Text style={[styles.btnText, { color: '#1976D2' }]}>Copy List</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, { backgroundColor: '#000', flex: 1 }]}
                onPress={() => setModalCekVisible(false)}
              >
                <Text style={[styles.btnText, { color: '#FFF' }]}>Tutup</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

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
        <View style={{ gap: 10, marginTop: 10, flexDirection: 'row', flex: 1 }}>
          {dateDay1 && (
            <Button
              title={`EXCEL ${dateDay1}`}
              onPress={() => handlePDF('day1')}
              bgColor="#E8F5E9"
              textColor="#74E245"
              type='pdf'
            />
          )}

          {dateDay2 && (
            <Button
              title={`EXCEL ${dateDay2}`}
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

  monitoringCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  statNumber: {
    fontSize: 36,
    fontWeight: '900',
    color: '#000',
  },
  buttonContainer: {
    justifyContent: 'center',
    marginLeft: 15,
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  toggleText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#000',
  },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', backgroundColor: '#FFF', borderRadius: 10, padding: 20, alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  listItem: { width: '100%', borderBottomWidth: 1, borderColor: '#EEE', paddingVertical: 10 },
  btnClose: { marginTop: 20, backgroundColor: '#000', padding: 10, borderRadius: 8, width: '100%', alignItems: 'center' },
  textArea: {
    width: '100%',
    height: 180,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 15,
    backgroundColor: '#F9F9F9',
    fontSize: 16,
    // textAlignVertical: 'top' (sudah ada di properti komponen)
  },
  modalActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
});