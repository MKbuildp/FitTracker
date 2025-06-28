import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PrazdnyStavProps } from '../types/types'; // Reusujeme stejný typ

/** Plovoucí tlačítko pro přidávání nových cvičení */
export const PlovouciTlacitko: React.FC<PrazdnyStavProps> = ({ navigation }) => {
  const navigateToPridatCviceni = () => {
    navigation.navigate('PridatCviceni', { vychoziTyp: 'opakovani' });
  };

  return (
    <TouchableOpacity 
      style={styly.plovouciTlacitko}
      onPress={navigateToPridatCviceni}
    >
      <Ionicons name="add" size={28} color="white" />
    </TouchableOpacity>
  );
};

const styly = StyleSheet.create({
  plovouciTlacitko: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#2563eb',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
}); 