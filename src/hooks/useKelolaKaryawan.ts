import { useState } from 'react';
import { API_ENDPOINTS } from '../config/api';

export const useKelolaKaryawan = () => {
  const [modalUserVisible, setModalUserVisible] = useState(false);
  const [daftarUser, setDaftarUser] = useState<any[]>([]);
  const [formUser, setFormUser] = useState({ nik: '', nama: '', jabatan: '' });
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchDaftarUser = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.users);
      if (response.ok) setDaftarUser(await response.json());
    } catch (error) { console.error(error); }
  };

  const handleBukaKelolaUser = () => {
    setModalUserVisible(true);
    fetchDaftarUser();
  };

  const handleTambahUser = async () => {
    if (!formUser.nik || !formUser.nama || !formUser.jabatan) return alert('Harap isi lengkap!');
    setIsUserLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.users, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formUser),
      });
      if (response.ok) {
        alert('Sukses menambah karyawan!');
        setFormUser({ nik: '', nama: '', jabatan: '' });
        fetchDaftarUser();
      } else { alert('Gagal menambah karyawan'); }
    } catch { alert('Terjadi kesalahan jaringan'); } 
    finally { setIsUserLoading(false); }
  };

  const handleHapusUser = async (nikHapus: string, namaHapus: string) => {
    if (window.confirm(`Yakin hapus ${namaHapus}?`)) {
      try {
        const response = await fetch(API_ENDPOINTS.userByNik(nikHapus), { method: 'DELETE' });
        if (response.ok) { alert('Terhapus'); fetchDaftarUser(); }
      } catch { alert('Gagal menghapus'); }
    }
  };

  const filteredUsers = daftarUser.filter((usr) => usr.nama.toLowerCase().includes(searchQuery.toLowerCase()) || usr.nik.includes(searchQuery));

  return {
    modalUserVisible, setModalUserVisible, formUser, setFormUser, isUserLoading,
    searchQuery, setSearchQuery, filteredUsers, handleBukaKelolaUser, handleTambahUser, handleHapusUser
  };
};