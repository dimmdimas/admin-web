import React from 'react';
import { View, StyleSheet } from 'react-native';
import Input from './input';           
import ToggleRow from './ToggleRow';   
import Gap from './gap';

interface FormLemburSectionProps {
  upahDay1: string;
  setUpahDay1: (value: string) => void;
  isDaySama: boolean;
  setIsDaySama: (value: boolean) => void;
  tanggalDay1: string;
  setTanggalDay1: (value: string) => void;
  is16Day1: boolean;
  setIs16Day1: (value: boolean) => void;
  is12Day1: boolean;
  setIs12Day1: (value: boolean) => void;
  
  upahDay2: string;
  setUpahDay2: (value: string) => void;
  tanggalDay2: string;
  setTanggalDay2: (value: string) => void;
  is16Day2: boolean;
  setIs16Day2: (value: boolean) => void;
  is12Day2: boolean;
  setIs12Day2: (value: boolean) => void;
}

export default function FormLemburSection({
  upahDay1, setUpahDay1,
  isDaySama, setIsDaySama,
  tanggalDay1, setTanggalDay1,
  is16Day1, setIs16Day1,
  is12Day1, setIs12Day1, 
  upahDay2, setUpahDay2,
  tanggalDay2, setTanggalDay2,
  is16Day2, setIs16Day2,
  is12Day2, setIs12Day2  
}: FormLemburSectionProps) {

  // --- LOGIKA BARU: Handler untuk Day 1 ---
  const handleToggle16Day1 = (newValue: boolean) => {
    setIs16Day1(newValue);
    if (newValue) setIs12Day1(false); // Matikan jam 12 jika jam 16 nyala
  };

  const handleToggle12Day1 = (newValue: boolean) => {
    setIs12Day1(newValue);
    if (newValue) setIs16Day1(false); // Matikan jam 16 jika jam 12 nyala
  };

  // --- LOGIKA BARU: Handler untuk Day 2 ---
  const handleToggle16Day2 = (newValue: boolean) => {
    setIs16Day2(newValue);
    if (newValue) setIs12Day2(false); 
  };

  const handleToggle12Day2 = (newValue: boolean) => {
    setIs12Day2(newValue);
    if (newValue) setIs16Day2(false); 
  };

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
        onValueChange={handleToggle16Day1} // <-- Gunakan handler baru
      />

      <ToggleRow 
        label="12.00" 
        value={is12Day1} 
        onValueChange={handleToggle12Day1} // <-- Gunakan handler baru
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
        onValueChange={handleToggle16Day2} // <-- Gunakan handler baru
      />

      <ToggleRow 
        label="12.00" 
        value={is12Day2} 
        onValueChange={handleToggle12Day2} // <-- Gunakan handler baru
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  }
});