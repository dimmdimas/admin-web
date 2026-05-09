import React from 'react';
import { View, StyleSheet } from 'react-native';
import Input from './input';           // Sesuaikan path jika letak komponen Input Anda berbeda
import ToggleRow from './ToggleRow';   // Sesuaikan path jika letak komponen ToggleRow Anda berbeda
import Gap from './gap';

// --- DEFINISI PROPS ---
interface FormLemburSectionProps {
  upahDay1: string;
  setUpahDay1: (value: string) => void;
  isDaySama: boolean;
  setIsDaySama: (value: boolean) => void;
  tanggalDay1: string;
  setTanggalDay1: (value: string) => void;
  is16Day1: boolean;
  setIs16Day1: (value: boolean) => void;
  
  upahDay2: string;
  setUpahDay2: (value: string) => void;
  tanggalDay2: string;
  setTanggalDay2: (value: string) => void;
  is16Day2: boolean;
  setIs16Day2: (value: boolean) => void;
}

export default function FormLemburSection({
  upahDay1, setUpahDay1,
  isDaySama, setIsDaySama,
  tanggalDay1, setTanggalDay1,
  is16Day1, setIs16Day1,
  upahDay2, setUpahDay2,
  tanggalDay2, setTanggalDay2,
  is16Day2, setIs16Day2
}: FormLemburSectionProps) {

  return (
    <View style={styles.container}>
      {/* PENGATURAN DAY 1 */}
      <Input
        label="Upah Day 1"
        value={upahDay1}
        onChangeText={setUpahDay1}
        keyboardType="numeric"
      />
      
      <ToggleRow 
        label="Day 1 & Day 2 Sama" 
        value={isDaySama} 
        onValueChange={setIsDaySama} 
      />

      <Gap height={15}/>

      <Input
        label="Tanggal lembur ke-1"
        value={tanggalDay1}
        onChangeText={setTanggalDay1}
        isDate={true}
      />
      
      <ToggleRow 
        label="16.00" 
        value={is16Day1} 
        onValueChange={setIs16Day1} 
      />

      <Gap height={15}/>

      {/* PENGATURAN DAY 2 */}
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
      
      <ToggleRow 
        label="16.00" 
        value={is16Day2} 
        onValueChange={setIs16Day2} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20, // Memberikan jarak dengan tombol-tombol di bawahnya
  }
});