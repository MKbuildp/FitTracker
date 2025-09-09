import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../../../hooks/useTranslation';
import { responsiveTypography, responsiveSpacingValues } from '../../../src/styles/theme';

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
    paddingTop: responsiveSpacingValues.md,
    alignItems: 'center',
  },
  smazatCviceniTlacitko: {
    flexDirection: 'row',
    backgroundColor: '#dc2626',
    paddingVertical: responsiveSpacingValues.sm,
    paddingHorizontal: responsiveSpacingValues.lg,
    borderRadius: responsiveSpacingValues.sm,
    alignItems: 'center',
    gap: responsiveSpacingValues.sm,
  },
  smazatCviceniText: {
    color: 'white',
    fontSize: responsiveTypography.body.fontSize,
    fontWeight: '600',
  },
}); 