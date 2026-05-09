import React from 'react';
import { Modal, View, Text, ActivityIndicator, StyleSheet } from 'react-native';

// --- DEFINISI PROPS ---
interface ModalLoadingExcelProps {
  visible: boolean;
}

export default function ModalLoadingExcel({ visible }: ModalLoadingExcelProps) {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#1976D2" />
          <Text style={styles.loadingText}>Menyiapkan Excel...</Text>
          <Text style={styles.loadingSubText}>Harap tunggu sebentar</Text>
        </View>
      </View>
    </Modal>
  );
}

// --- STYLE KHUSUS MODAL LOADING ---
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingBox: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 5, // Bayangan untuk Android
    shadowColor: '#000', // Bayangan untuk iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  loadingSubText: {
    marginTop: 5,
    fontSize: 12,
    color: 'gray',
  },
});