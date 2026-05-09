import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet } from 'react-native';

// --- DEFINISI PROPS & TIPE DATA ---
interface KaryawanBelumAbsen {
  nik: string;
  nama: string;
}

interface ModalCekBelumAbsenProps {
  visible: boolean;
  onClose: () => void;
  listBelumAbsen: KaryawanBelumAbsen[];
  onCopyList: () => void;
}

export default function ModalCekBelumAbsen({
  visible,
  onClose,
  listBelumAbsen,
  onCopyList
}: ModalCekBelumAbsenProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
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
              onPress={onCopyList}
            >
              <Text style={[styles.btnText, { color: '#1976D2' }]}>Copy List</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, { backgroundColor: '#000', flex: 1 }]}
              onPress={onClose} // Panggil fungsi onClose dari props
            >
              <Text style={[styles.btnText, { color: '#FFF' }]}>Tutup</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
}

// --- STYLE KHUSUS UNTUK MODAL INI ---
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '90%',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#212121',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
});