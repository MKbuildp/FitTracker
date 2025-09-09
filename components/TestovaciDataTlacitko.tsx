import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useCviceni } from '../context/CviceniContext';

/**
 * Tlacitko pro načtení testovacích dat (pouze pro vývoj/screenshoty)
 */
export const TestovaciDataTlacitko: React.FC = () => {
  const { nacistTestovaciData, smazatTestovaciData } = useCviceni();

  const handleNacistData = async () => {
    Alert.alert(
      'Načíst testovací data',
      'Chceš načíst testovací data za červen 2025 pro screenshoty?',
      [
        { text: 'Zrušit', style: 'cancel' },
        { 
          text: 'Načíst', 
          onPress: async () => {
            await nacistTestovaciData();
            Alert.alert('✅ Hotovo!', 'Testovací data byla načtena.');
          }
        }
      ]
    );
  };

  const handleSmazatData = async () => {
    Alert.alert(
      'Smazat testovací data',
      'Chceš smazat všechna testovací data?',
      [
        { text: 'Zrušit', style: 'cancel' },
        { 
          text: 'Smazat', 
          style: 'destructive',
          onPress: async () => {
            await smazatTestovaciData();
            Alert.alert('🗑️ Hotovo!', 'Testovací data byla smazána.');
          }
        }
      ]
    );
  };

  return (
    <>
      <TouchableOpacity style={styles.tlacitko} onPress={handleNacistData}>
        <Text style={styles.text}>📊 Načíst testovací data</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.tlacitko, styles.smazatTlacitko]} onPress={handleSmazatData}>
        <Text style={styles.text}>🗑️ Smazat testovací data</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  tlacitko: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 4,
    alignItems: 'center',
  },
  smazatTlacitko: {
    backgroundColor: '#ef4444',
  },
  text: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});


