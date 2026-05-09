import React from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Switch, StyleSheet } from 'react-native';

// --- DEFINISI PROPS ---
// Ini adalah "jembatan" untuk menerima state dan fungsi dari AdminScreen.tsx
interface MonitorCardProps {
  totalNik: number;
  belumAbsenCount: number;
  isSemuaKaryawan: boolean;
  setIsSemuaKaryawan: (value: boolean) => void;
  modalInputVisible: boolean;
  setModalInputVisible: (value: boolean) => void;
  setModalCekVisible: (value: boolean) => void;
  nikBulk: string;
  setNikBulk: (value: string) => void;
  handleUploadList: () => void;
}

export default function MonitorCard({
  totalNik,
  belumAbsenCount,
  isSemuaKaryawan,
  setIsSemuaKaryawan,
  modalInputVisible,
  setModalInputVisible,
  setModalCekVisible,
  nikBulk,
  setNikBulk,
  handleUploadList
}: MonitorCardProps) {
  return (
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
              isSemuaKaryawan && { opacity: 0.5 }
            ]}
            onPress={() => setModalInputVisible(true)}
            disabled={isSemuaKaryawan}
          >
            <Text style={[styles.btnText, { color: '#33691E' }]}>INPUT</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* MODAL UNTUK INPUT DAFTAR NIK (MULTILINE) */}
      <Modal visible={modalInputVisible} animationType='slide' transparent={true}>
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
              placeholder="Contoh:&#10;10092639&#10;10092640&#10;10092641"
              value={nikBulk}
              onChangeText={setNikBulk}
              textAlignVertical="top"
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
        <Text style={styles.toggleText}>Input All Employees</Text>
      </View>
    </View>
  );
}

// --- PINDAHKAN STYLE TERKAIT MONITOR CARD DARI ADMIN SCREEN KE SINI ---
const styles = StyleSheet.create({
  monitoringCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRightWidth: 1,
    borderRightColor: '#EEEEEE',
    paddingRight: 10,
    alignItems: 'center'
  },
  statBox: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 5,
    fontFamily: 'Montserrat-Regular',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Montserrat-ExtraBold',
    color: '#212121',
  },
  buttonContainer: {
    flex: 0.5,
    paddingLeft: 10,
    justifyContent: 'center',
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
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  toggleText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#424242',
    fontWeight: '500',
  },
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
    marginBottom: 5,
    textAlign: 'center',
    color: '#212121',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    backgroundColor: '#FAFAFA',
    minHeight: 150,
    marginBottom: 20,
  },
  modalActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});