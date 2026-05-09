import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

interface ToggleRowProps {
  label: string;
  value: boolean;
  onValueChange: (val: boolean) => void;
  disabled?: boolean;
}

const ToggleRow = ({ label, value, onValueChange, disabled = false }: ToggleRowProps) => {
  return (
    <View style={styles.container}>
      <Switch 
        value={value} 
        onValueChange={onValueChange}
        trackColor={{ false: '#d3d3d3', true: '#74E245' }}
        thumbColor={'#fff'}
        disabled={disabled}
      />
      <Text style={[styles.label, disabled && styles.labelDisabled]}>{label}</Text>
    </View>
  );
};

export default ToggleRow;

const styles = StyleSheet.create({
  container: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 15 
  },
  label: { 
    fontSize: 14, 
    color: '#333', 
    marginLeft: 10,
    fontFamily: 'Montserrat-Light'
  },
  labelDisabled: { 
    color: '#888' 
  }
});