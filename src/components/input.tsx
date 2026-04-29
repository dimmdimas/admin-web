import React from 'react';
import { TextInput, StyleSheet, TextInputProps, Text, View, Dimensions } from 'react-native';

interface InputProps extends TextInputProps {
  label: string;
  isDate?: boolean;
}

const Input = ({ label, style, editable = true, isDate, ...props }: InputProps) => {
  const formatIndoDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(date);
    } catch (e) { return ""; }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      {isDate ? (
        <input
          type="date"
          value={props.value}
          onChange={(e) => props.onChangeText && props.onChangeText(e.target.value)}
          style={{
            backgroundColor: '#F5F5F5',
            borderRadius: '8px',
            padding: '12px 15px',
            fontSize: '16px',
            border: '1px solid #E8E8E8',
            // --- FIX LEBAR MENYAMPING ---
            width: '100%', 
            maxWidth: '100%',
            boxSizing: 'border-box', // Wajib: agar padding tidak menambah lebar luar
            display: 'block',
            // ---------------------------
            color: '#333',
            outline: 'none',
            fontFamily: 'inherit',
            height: '48px',
            appearance: 'none', // Menghilangkan style default browser
            WebkitAppearance: 'none'
          }}
        />
      ) : (
        <TextInput 
          style={[
            styles.input, 
            !editable && styles.inputDisabled,
            style
          ]} 
          editable={editable}
          {...props} 
        />
      )}
      
      {isDate && props.value ? (
        <Text style={styles.formatHint}>
          Terpilih: {formatIndoDate(props.value as string)}
        </Text>
      ) : null}
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: { 
    marginBottom: 15,
    width: '100%',
    alignSelf: 'stretch', // Memastikan View mengambil ruang yang tersedia
  },
  label: { fontSize: 14, color: '#333', marginBottom: 8, fontWeight: 'bold' },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    width: '100%',
  },
  inputDisabled: {
    backgroundColor: '#E0E0E0',
    color: '#888',
  },
  formatHint: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 6,
    fontWeight: '600'
  }
});