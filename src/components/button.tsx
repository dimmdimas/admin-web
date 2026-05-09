import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  bgColor: string;
  textColor: string;
  type?: 'excel' | 'pdf'; // Menambahkan 'pdf' agar kompatibel dengan pemanggilan Anda sebelumnya
}

const Button = ({ title, onPress, bgColor, textColor, type }: ButtonProps) => {
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { backgroundColor: bgColor }, 
        // Jika type adalah excel atau pdf, terapkan style setengah layar
        (type === 'excel' || type === 'pdf') && styles.halfWidth 
      ]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, { color: textColor }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  halfWidth: {
    width: '50%',
    flex: 1
  },
  text: {
    fontFamily: 'Montserrat-Regular', // Menggunakan Montserrat Bold sesuai standar aplikasi
    fontSize: 15,
    textAlign: 'center'
  }
});