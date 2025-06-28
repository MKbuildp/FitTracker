import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../../../hooks/useTranslation';

/** Nebezpečná zóna pro smazání cvičení */
export const NebezpecnaZona: React.FC<{
  onSmazat: () => void;
}> = ({ onSmazat }) => {
  const { t } = useTranslation();

  return (
    <View style={styly.nebezpecnaZona}>
      <TouchableOpacity
        style={styly.smazatCviceniTlacitko}
        onPress={onSmazat}
      >
        <Ionicons name="trash" size={20} color="#ffffff" />
        <Text style={styly.smazatCviceniText}>{t('detail.deleteExercise')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styly = StyleSheet.create({
  // Nebezpečná zóna
  nebezpecnaZona: {
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 16,
    alignItems: 'center',
  },
  smazatCviceniTlacitko: {
    flexDirection: 'row',
    backgroundColor: '#dc2626',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    gap: 8,
  },
  smazatCviceniText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 