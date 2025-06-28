import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FormularProps } from '../types/types';
import { useTranslation } from '../../../hooks/useTranslation';

/** Komponenta pro zadání názvu cvičení */
export const FormularNazev: React.FC<FormularProps> = ({ nazev, onNazevChange }) => {
  const { t } = useTranslation();

  return (
    <View style={styly.kontejner}>
      <View style={styly.nadpisKontejner}>
        <Ionicons name="create-outline" size={20} color="#374151" />
      <Text style={styly.nadpis}>{t('addExercise.name')}</Text>
      </View>
      <TextInput
        style={styly.vstup}
        value={nazev}
        onChangeText={onNazevChange}
        placeholder={t('addExercise.namePlaceholder')}
        placeholderTextColor="#9ca3af"
        maxLength={50}
      />
    </View>
  );
};

const styly = StyleSheet.create({
  kontejner: {
    marginBottom: 20,
  },
  nadpisKontejner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    gap: 8,
  },
  nadpis: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  vstup: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
});

export default FormularNazev; 