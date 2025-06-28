import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from '../../../hooks/useTranslation';
import { TlacitkaProps } from '../types/types';

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
    marginTop: 32,
  },
  ulozitTlacitko: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  tlacitkoNeaktivni: {
    backgroundColor: '#9ca3af',
  },
  ulozitText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

export default React.memo(TlacitkaFormulare); 