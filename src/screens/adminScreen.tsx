import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Button from '../components/button';
import { useFormLembur, useKelolaKaryawan, useMonitoring } from '../hooks';
import { DownloadExcelSection, FormLemburSection, MonitorCard } from '../components';
import { ModalCekBelumAbsen, ModalKelolaKaryawan, ModalLoadingExcel } from '../Modal';
import Gap from '../components/gap';


export default function AdminScreen() {
  // Panggil fungsi spesifik dari masing-masing Hook
  const hr = useKelolaKaryawan();
  const monitor = useMonitoring();
  const lembur = useFormLembur(monitor.fetchMonitoringData, monitor.isSemuaKaryawan);

  // Trigger data awal saat aplikasi pertama kali dibuka
  useEffect(() => {
    lembur.fetchInitialDates();
    monitor.fetchMonitoringData();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Hello 👋🏻, ADMIN</Text>

      {/* --- KOTAK MONITORING --- */}
      <MonitorCard
        totalNik={monitor.totalNik}
        belumAbsenCount={monitor.belumAbsenCount}
        isSemuaKaryawan={monitor.isSemuaKaryawan}
        setIsSemuaKaryawan={monitor.setIsSemuaKaryawan}
        modalInputVisible={monitor.modalInputVisible}
        setModalInputVisible={monitor.setModalInputVisible}
        setModalCekVisible={monitor.setModalCekVisible}
        nikBulk={monitor.nikBulk}
        setNikBulk={monitor.setNikBulk}
        handleUploadList={monitor.handleUploadList}
      />

      

      {/* --- MODAL CEK BELUM ABSEN --- */}
      <ModalCekBelumAbsen
        visible={monitor.modalCekVisible}
        onClose={() => monitor.setModalCekVisible(false)}
        listBelumAbsen={monitor.listBelumAbsen}
        onCopyList={monitor.handleCopyList}
      />

      {/* --- TOMBOL & MODAL KELOLA KARYAWAN --- */}
      <TouchableOpacity style={styles.btnMenu} onPress={hr.handleBukaKelolaUser}>
        <Text style={styles.btnMenuText}>👥 Kelola Karyawan</Text>
      </TouchableOpacity>
      
      <ModalKelolaKaryawan
        visible={hr.modalUserVisible}
        onClose={() => hr.setModalUserVisible(false)}
        formUser={hr.formUser}
        setFormUser={hr.setFormUser}
        isUserLoading={hr.isUserLoading}
        onTambahUser={hr.handleTambahUser}
        searchQuery={hr.searchQuery}
        setSearchQuery={hr.setSearchQuery}
        filteredUsers={hr.filteredUsers}
        onHapusUser={hr.handleHapusUser}
      />

      <Gap height={10}/>

      {/* --- FORM SECTION --- */}
      <FormLemburSection
        upahDay1={lembur.upahDay1} setUpahDay1={lembur.setUpahDay1}
        isDaySama={lembur.isDaySama} setIsDaySama={lembur.setIsDaySama}
        tanggalDay1={lembur.tanggalDay1} setTanggalDay1={lembur.setTanggalDay1}
        is16Day1={lembur.is16Day1} setIs16Day1={lembur.setIs16Day1}
        upahDay2={lembur.upahDay2} setUpahDay2={lembur.setUpahDay2}
        tanggalDay2={lembur.tanggalDay2} setTanggalDay2={lembur.setTanggalDay2}
        is16Day2={lembur.is16Day2} setIs16Day2={lembur.setIs16Day2}
      />

      {/* --- BOTTOM SECTION --- */}
      <View style={styles.bottomContainer}>
        <Button title="Submit" onPress={lembur.handleSubmit} bgColor="#FFF9C4" textColor="#b09836" />
        <DownloadExcelSection dateDay1={lembur.dateDay1} dateDay2={lembur.dateDay2} onDownload={lembur.handleExcel} />
      </View>

      <ModalLoadingExcel visible={lembur.isDownloading} />
    </ScrollView>
  );
}

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
  }
});