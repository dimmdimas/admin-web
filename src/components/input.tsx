import React from 'react';
import { TextInput, StyleSheet, TextInputProps, Text, View, Platform } from 'react-native';

interface InputProps extends TextInputProps {
  label: string;
  isDate?: boolean;
}

const Input = ({ label, style, editable = true, isDate, ...props }: InputProps) => {
  // Fungsi format tanggal Indonesia
  const formatIndoDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(date);
    } catch (e) { 
      return ""; 
    }
  };

  // Memisahkan style khusus Web Date Input agar JSX tidak berantakan
  const webDateInputStyle = {
    backgroundColor: '#F5F5F5',
    borderRadius: '8px',
    padding: '12px 15px',
    fontSize: '16px',
    border: '1px solid #E8E8E8',
    width: '100%', 
    maxWidth: '100%',
    boxSizing: 'border-box' as const, 
    display: 'block',
    color: '#333',
    outline: 'none',
    fontFamily: 'Montserrat-Regular, sans-serif',
    height: '48px',
    appearance: 'none' as const,
    WebkitAppearance: 'none' as const
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      {/* KUNCI PERBAIKANNYA ADA DI SINI */}
      {isDate && Platform.OS === 'web' ? (
        <input
          type="date"
          value={props.value}
          onChange={(e) => props.onChangeText && props.onChangeText(e.target.value)}
          style={webDateInputStyle as any} 
        />
      ) : (
        <TextInput 
          style={[
            styles.input, 
            !editable && styles.inputDisabled,
            style
          ]} 
          editable={editable}
          placeholder={isDate ? "YYYY-MM-DD" : props.placeholder} // Tambahan UX jika di mobile
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
    alignSelf: 'stretch',
  },
  label: { 
    fontSize: 14, 
    color: '#333', 
    marginBottom: 8, 
    fontFamily: 'Montserrat-Regular', 
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    width: '100%',
    fontFamily: 'Montserrat-Regular',
  },
  inputDisabled: {
    backgroundColor: '#E0E0E0',
    color: '#888',
  },
  formatHint: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 6,
    fontFamily: 'Montserrat-SemiBold',
  }
});