import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button, DownloadExcelSection, FormLemburSection, Gap, MonitorCard } from '../components';
import { useDownloadExcel, useFormLembur, useKelolaKaryawan, useMonitoring,  } from '../hooks';
import { ModalCekBelumAbsen, ModalKelolaKaryawan, ModalLoadingExcel, ModalLoadingZip } from '../Modal';

export default function AdminScreen() {
  const hr = useKelolaKaryawan();
  const monitor = useMonitoring();
  const lembur = useFormLembur(monitor.fetchMonitoringData, monitor.isSemuaKaryawan);
  const { downloadExcel, loadingDay1, loadingDay2 } = useDownloadExcel();

  useEffect(() => {
    lembur.fetchInitialDates();
    monitor.fetchMonitoringData();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Hello 👋🏻, ADMIN</Text>

      <MonitorCard {...monitor} />

      <ModalCekBelumAbsen
        visible={monitor.modalCekVisible}
        onClose={() => monitor.setModalCekVisible(false)}
        listBelumAbsen={monitor.listBelumAbsen}
        onCopyList={monitor.handleCopyList}
      />

      <Button title="👥 Kelola Karyawan" onPress={hr.handleBukaKelolaUser} bgColor="#22577A" textColor="white" />

      <ModalKelolaKaryawan
        visible={hr.modalUserVisible}
        onClose={() => hr.setModalUserVisible(false)}
        {...hr} // Tetap gunakan ini untuk yang cocok
        onTambahUser={hr.handleTambahUser} // Pastikan namanya benar
        onHapusUser={hr.handleHapusUser}   // Pastikan namanya benar
      />
      <FormLemburSection {...lembur} />

      <View style={styles.bottomContainer}>
        <Button title="Submit" onPress={lembur.handleSubmit} bgColor="#FFF9C4" textColor="#b09836" />
        <DownloadExcelSection dateDay1={lembur.dateDay1} dateDay2={lembur.dateDay2} onDownload={lembur.handleExcel} />

        <Gap height={20} />

        <ExcelDownloadButton day="day1" loading={loadingDay1} onPress={() => downloadExcel('day1')} />
        <ExcelDownloadButton day="day2" loading={loadingDay2} onPress={() => downloadExcel('day2')} />
      </View>

      <ModalLoadingZip visible={loadingDay1 || loadingDay2} />
      <ModalLoadingExcel visible={lembur.isDownloading} />
    </ScrollView>
  );
}

// Sub-komponen kecil untuk tombol agar AdminScreen tidak panjang
const ExcelDownloadButton = ({ day, loading, onPress }: any) => (
  <Button
    title={loading ? `Menyiapkan ${day}...` : `📦 Download Lampiran (${day.toUpperCase()})`}
    onPress={onPress}
    bgColor={loading ? "#CFD8DC" : "#E0F7FA"}
    textColor="#006064"
    // disabled={loading}
  />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  scrollContent: {
    padding: 30,
    flexGrow: 1
  },
  title: {
    fontSize: 28,
    fontFamily: 'Montserrat-ExtraBold',
    color: '#000',
    marginBottom: 30,
    marginTop: 20
  },
  bottomContainer: {
    marginTop: 'auto',
    paddingTop: 40
  },
  btnMenu: {
    backgroundColor: '#00abbb',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
    elevation: 2,
  },
  btnMenuText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingZipContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#E0F7FA',
    borderRadius: 8,
  },
  textLoadingZip: {
    marginLeft: 10,
    color: '#006064',
    fontWeight: 'bold',
  }
});