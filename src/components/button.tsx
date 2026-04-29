import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  bgColor: string;
  textColor: string;
  type?: 'pdf'
}

const Button = ({ title, onPress, bgColor, textColor, type }: ButtonProps) => {
  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: bgColor }, type === 'pdf' && { width: '50%', flex: 1 } ]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, { color: textColor }]}>{title}</Text>
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
  text: {
    fontWeight: 'bold',
    fontSize: 16,
  }
});