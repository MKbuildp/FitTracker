import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from '../../../hooks/useTranslation';
import { TlacitkaProps } from '../types/types';
import { responsiveTypography, responsiveSpacingValues } from '../../../src/styles/theme';

/** Komponenta pro tlačítka formuláře (Vymazat/Uložit) */
const TlacitkaFormulare: React.FC<TlacitkaProps> = ({ 
  ukladaSe, 
  onReset, 
  onUlozit 
}) => {
  const { t } = useTranslation();
  return (
    <View style={styly.tlacitkaKontejner}>
      <TouchableOpacity
        style={[styly.ulozitTlacitko, ukladaSe && styly.tlacitkoNeaktivni]}
        onPress={onUlozit}
        disabled={ukladaSe}
      >
        <Text style={styly.ulozitText}>
          {ukladaSe ? t('addExercise.saving') : t('addExercise.saveExercise')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styly = StyleSheet.create({
  tlacitkaKontejner: {
    marginTop: responsiveSpacingValues.xl,
  },
  ulozitTlacitko: {
    backgroundColor: '#2563eb',
    borderRadius: responsiveSpacingValues.sm,
    padding: responsiveSpacingValues.md,
    alignItems: 'center',
  },
  tlacitkoNeaktivni: {
    backgroundColor: '#9ca3af',
  },
  ulozitText: {
    fontSize: responsiveTypography.body.fontSize,
    fontWeight: '600',
    color: 'white',
  },
});

export default React.memo(TlacitkaFormulare); 