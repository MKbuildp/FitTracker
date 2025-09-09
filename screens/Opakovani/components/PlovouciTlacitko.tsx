import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PrazdnyStavProps } from '../types/types'; // Reusujeme stejný typ
import { responsiveSize, responsiveSpacingValues } from '../../../src/styles/theme';

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
    bottom: responsiveSpacingValues.xl,
    right: responsiveSpacingValues.xl,
    backgroundColor: '#2563eb',
    width: responsiveSize(60),
    height: responsiveSize(60),
    borderRadius: responsiveSize(30),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
}); 