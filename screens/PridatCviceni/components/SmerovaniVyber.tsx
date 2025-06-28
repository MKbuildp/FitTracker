import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SmerovaniProps } from '../types/types';
import { Smerovani } from '../../../types';
import { useTranslation } from '../../../hooks/useTranslation';

/** Komponenta pro výběr směrování (pouze pro časová cvičení) */
const SmerovaniVyber: React.FC<SmerovaniProps> = ({ 
  typMereni, 
  smerovani, 
  onSmerovaniChange 
}) => {
  const { t } = useTranslation();

  // Zobrazit pouze pro časová cvičení
  if (typMereni !== 'cas') {
    return null;
  }

  const moznosti: { hodnota: Smerovani; nazev: string }[] = [
    {
      hodnota: 'kratsi_lepsi',
      nazev: t('addExercise.shorterBetterShort')
    },
    {
      hodnota: 'delsi_lepsi',
      nazev: t('addExercise.longerBetterShort')
    }
  ];

  return (
    <View style={styly.kontejner}>
      <View style={styly.nadpisKontejner}>
        <Ionicons name="swap-horizontal-outline" size={20} color="#374151" />
      <Text style={styly.nadpis}>{t('addExercise.direction')}</Text>
      </View>
      
      <View style={styly.moznostiRadek}>
        {moznosti.map((moznost) => (
          <TouchableOpacity
            key={moznost.hodnota}
            style={[
              styly.moznost,
              smerovani === moznost.hodnota && styly.moznostVybrana
            ]}
            onPress={() => onSmerovaniChange(moznost.hodnota)}
          >
            <Text style={[
              styly.moznostNazev,
              smerovani === moznost.hodnota && styly.moznostNazevVybrana
            ]}>
              {moznost.nazev}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
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
  moznostiRadek: {
    flexDirection: 'row',
    gap: 12,
  },
  moznost: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  moznostVybrana: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  moznostNazev: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    textAlign: 'center',
  },
  moznostNazevVybrana: {
    color: '#1d4ed8',
  },
});

export default SmerovaniVyber; 