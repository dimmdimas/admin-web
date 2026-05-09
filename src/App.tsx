import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useFonts } from 'expo-font';
import AdminScreen from './screens/adminScreen'; // Pastikan path ini benar sesuai struktur Anda

export default function App() {
  // 1. Load Font Expo (Gunakan ./ jika App.tsx sejajar dengan folder assets)
  let [fontsLoaded] = useFonts({
    'Montserrat-Light': require('./fonts/Montserrat-Light.ttf'),
    'Montserrat-Regular': require('./fonts/Montserrat-Regular.ttf'),
    'Montserrat-SemiBold': require('./fonts/Montserrat-SemiBold.ttf'),
    'Montserrat-ExtraBold': require('./fonts/Montserrat-ExtraBold.ttf'),
  });

  // 2. Loading Screen agar tidak error saat font sedang diproses
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1976D2" />
      </View>
    );
  }

  // 3. Render aplikasi Anda
  return <AdminScreen />;
}