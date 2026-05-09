import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';

export const useFormLembur = (fetchMonitoringData: () => void, isSemuaKaryawan: boolean) => {
  const [upahDay1, setUpahDay1] = useState('');
  const [isDaySama, setIsDaySama] = useState(false);
  const [tanggalDay1, setTanggalDay1] = useState('');
  const [is16Day1, setIs16Day1] = useState(true);
  const [upahDay2, setUpahDay2] = useState('');
  const [tanggalDay2, setTanggalDay2] = useState('');
  const [is16Day2, setIs16Day2] = useState(true);
  const [dateDay1, setDateDay1] = useState<string | null>(null);
  const [dateDay2, setDateDay2] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => { if (isDaySama) setUpahDay2(upahDay1); }, [isDaySama, upahDay1]);

  const fetchInitialDates = async () => {
    try {
      const r1 = await fetch(API_ENDPOINTS.date('day1'));
      const r2 = await fetch(API_ENDPOINTS.date('day2'));
      if (r1.ok) { const d1 = await r1.json(); setDateDay1(d1.tanggal); }
      if (r2.ok) { const d2 = await r2.json(); setDateDay2(d2.tanggal); }
    } catch (e) {}
  };

  const handleSubmit = async () => {
    if (!upahDay1 || !tanggalDay1) return alert("Mohon isi Day 1");
    try {
      const antrean = [{ url: API_ENDPOINTS.day1, payload: { tanggal: tanggalDay1, money: upahDay1, jam16: is16Day1 } }];
      if (tanggalDay2) antrean.push({ url: API_ENDPOINTS.day2, payload: { tanggal: tanggalDay2, money: isDaySama ? upahDay1 : upahDay2, jam16: is16Day2 } });

      const responses = await Promise.all(antrean.map(item => fetch(item.url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item.payload) })));
      
      if (responses.every(res => res.ok)) {
        if (isSemuaKaryawan) await fetch(API_ENDPOINTS.listUsers, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isSemua: true }) });
        alert("✅ Jadwal Diupdate!");
        fetchInitialDates(); fetchMonitoringData();
      }
    } catch { alert("❌ Terjadi kesalahan."); }
  };

  const handleExcel = async (day: string) => {
    try {
      setIsDownloading(true);
      const url = API_ENDPOINTS.exportExcel(day, "10038106", "11", "22");
      const response = await fetch(url);
      const disposition = response.headers.get('Content-Disposition');
      let namaFile = disposition && disposition.includes('filename=') ? disposition.split('filename=')[1].replace(/['";]/g, '').trim() : `Laporan_${day}.xlsx`;

      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob); link.download = namaFile;
      document.body.appendChild(link); link.click();
    } finally { setIsDownloading(false); }
  };

  return {
    upahDay1, setUpahDay1, isDaySama, setIsDaySama, tanggalDay1, setTanggalDay1, is16Day1, setIs16Day1,
    upahDay2, setUpahDay2, tanggalDay2, setTanggalDay2, is16Day2, setIs16Day2, dateDay1, dateDay2, isDownloading,
    fetchInitialDates, handleSubmit, handleExcel
  };
};