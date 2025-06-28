import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BarvyVyber from '../../PridatCviceni/components/BarvyVyber';
import { Cviceni } from '../../../types';
import { useTranslation } from '../../../hooks/useTranslation';

/** Komponenta pro editaci barvy cvičení */
export const BarvyEditor: React.FC<{
  cviceni: Cviceni;
  onZmenitBarvu: (barva: string) => void;
}> = ({ cviceni, onZmenitBarvu }) => {
  const { t } = useTranslation();

  return (
    <View style={styly.sekce}>
      <View style={styly.sekceNadpis}>
        <Ionicons name="color-palette-outline" size={20} color="#1f2937" />
        <Text style={styly.sekceText}>{t('detail.exerciseColor')}</Text>
      </View>
      
      <BarvyVyber
        vybranaBarva={cviceni.barva}
        onVybratBarvu={onZmenitBarvu}
        nazev={undefined}
      />
    </View>
  );
};

const styly = StyleSheet.create({
  // Sekce
  sekce: {
    marginBottom: 24,
  },
  sekceNadpis: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sekceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
}); 