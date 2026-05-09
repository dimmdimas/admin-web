import { useState } from 'react';
import * as Clipboard from 'expo-clipboard';
import { API_ENDPOINTS } from '../config/api';

export const useMonitoring = () => {
  const [totalNik, setTotalNik] = useState(0);
  const [belumAbsenCount, setBelumAbsenCount] = useState(0);
  const [listBelumAbsen, setListBelumAbsen] = useState<{ nik: string, nama: string }[]>([]);
  const [isSemuaKaryawan, setIsSemuaKaryawan] = useState(false);
  const [modalCekVisible, setModalCekVisible] = useState(false);
  const [modalInputVisible, setModalInputVisible] = useState(false);
  const [nikBulk, setNikBulk] = useState('');

  const fetchMonitoringData = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.monitoring('day1'));
      if (response.ok) {
        const data = await response.json();
        setTotalNik(data.totalNik);
        setBelumAbsenCount(data.totalBelumAbsen);
        setListBelumAbsen(data.listBelumAbsen);
      }
    } catch (error) { console.error(error); }
  };

  const handleCopyList = async () => {
    if (listBelumAbsen.length === 0) return alert("Daftar kosong.");
    const textToCopy = listBelumAbsen.map(item => `- *${item.nik}* [${item.nama}]`).join('\n');
    try {
      await Clipboard.setStringAsync(textToCopy);
      alert("✅ Daftar berhasil disalin!");
    } catch { alert("❌ Gagal menyalin"); }
  };

  const handleUploadList = async () => {
    if (!nikBulk) return alert("Masukkan daftar NIK");
    const nikArray = nikBulk.split('\n').map(nik => nik.trim()).filter(nik => nik !== "");
    try {
      const response = await fetch(API_ENDPOINTS.listUsers, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nils: nikArray })
      });
      if (response.ok) {
        alert("✅ Monitoring diperbarui!");
        setNikBulk(''); setModalInputVisible(false); fetchMonitoringData();
      }
    } catch { alert("❌ Terjadi kesalahan jaringan"); }
  };

  return {
    totalNik, belumAbsenCount, listBelumAbsen, isSemuaKaryawan, setIsSemuaKaryawan,
    modalCekVisible, setModalCekVisible, modalInputVisible, setModalInputVisible,
    nikBulk, setNikBulk, fetchMonitoringData, handleCopyList, handleUploadList
  };
};