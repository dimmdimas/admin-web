import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet, TextInput } from 'react-native';
import Button from '../components/button';

// --- DEFINISI PROPS & TIPE DATA ---
interface FormUser {
  nik: string;
  nama: string;
  jabatan: string;
}

interface ModalKelolaKaryawanProps {
  visible: boolean;
  onClose: () => void;
  formUser: FormUser;
  setFormUser: (user: FormUser) => void;
  isUserLoading: boolean;
  onTambahUser: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredUsers: FormUser[];
  onHapusUser: (nik: string, nama: string) => void;
}

export default function ModalKelolaKaryawan({
  visible,
  onClose,
  formUser,
  setFormUser,
  isUserLoading,
  onTambahUser,
  searchQuery,
  setSearchQuery,
  filteredUsers,
  onHapusUser
}: ModalKelolaKaryawanProps) {

  // Fungsi Helper: Format Huruf Besar
  const formatHurufBesar = (text: string) => {
    return text.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <Text style={styles.headerTitle}>👥 Kelola Data Karyawan</Text>
        <Text style={styles.headerSubtitle}>
          Isi Nama Lengkap Dengan Huruf Besar Diawal & Jabatan Huruf Besar Semua
        </Text>

        {/* FORM TAMBAH USER */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Tambah Karyawan Baru</Text>
          
          <TextInput 
            style={styles.input} 
            placeholder="NIK" 
            value={formUser.nik} 
            onChangeText={(t) => setFormUser({ ...formUser, nik: t })} 
          />
          
          <TextInput
            style={styles.input}
            placeholder="Nama Lengkap"
            value={formUser.nama}
            onChangeText={(t) => setFormUser({ ...formUser, nama: formatHurufBesar(t) })}
            autoCapitalize="words"
          />
          
          <TextInput 
            style={styles.input} 
            placeholder="Jabatan" 
            value={formUser.jabatan} 
            onChangeText={(t) => setFormUser({ ...formUser, jabatan: t })} 
          />
          
          <Button 
            title={isUserLoading ? "Menyimpan..." : "Tambah Karyawan"} 
            onPress={onTambahUser} 
            bgColor={''} 
            textColor={''} 
          />
        </View>

        {/* DAFTAR USER & PENCARIAN */}
        <Text style={styles.formTitle}>
          Daftar Karyawan ({filteredUsers.length})
        </Text>

        <TextInput
          style={[styles.input, styles.inputSearch]}
          placeholder="🔍 Cari NIK atau Nama Karyawan..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <ScrollView style={styles.scrollArea}>
          {filteredUsers.map((usr, index) => (
            <View key={index} style={styles.listItem}>
              <View style={styles.listItemTextContainer}>
                <Text style={styles.listItemName}>{usr.nama}</Text>
                <Text style={styles.listItemDetails}>{usr.nik} - {usr.jabatan}</Text>
              </View>
              <TouchableOpacity
                style={styles.btnHapus}
                onPress={() => onHapusUser(usr.nik, usr.nama)}
              >
                <Text style={styles.btnHapusText}>Hapus</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* TOMBOL TUTUP MODAL */}
        <TouchableOpacity style={styles.btnTutup} onPress={onClose}>
          <Text style={styles.btnTutupText}>Tutup</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

// --- STYLE KHUSUS MODAL INI ---
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '300',
    marginBottom: 20,
  },
  formContainer: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  formTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 14,
    color: '#333',
  },
  inputSearch: {
    borderColor: '#1976D2',
    borderWidth: 1.5,
  },
  scrollArea: {
    flex: 1,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  listItemTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  listItemName: {
    fontWeight: 'bold',
  },
  listItemDetails: {
    color: 'gray',
    fontSize: 12,
  },
  btnHapus: {
    backgroundColor: '#FFEBEE',
    padding: 10,
    borderRadius: 5,
  },
  btnHapusText: {
    color: '#D32F2F',
    fontWeight: 'bold',
  },
  btnTutup: {
    padding: 15,
    backgroundColor: 'gray',
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 8,
  },
  btnTutupText: {
    color: 'white',
    fontWeight: 'bold',
  },
});