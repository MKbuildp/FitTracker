import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../../../hooks/useTranslation';
import { PrazdnyStavProps } from '../types/types';
import { KruhovyVzor } from '../../../components/PozadiVzory';

/** Komponenta pro zobrazení prázdného stavu bez cvičení na opakování */
export const PrazdnyStav: React.FC<PrazdnyStavProps> = () => {
  const { t } = useTranslation();
  
  return (
    <View style={styly.prazdnyKontejner}>
      <KruhovyVzor />
      <Ionicons name="fitness-outline" size={80} color="#9ca3af" />
      <Text style={styly.prazdnyNadpis}>{t('repetitions.empty.title')}</Text>
      <Text style={styly.prazdnyPopis}>
        {t('repetitions.empty.subtitle')}
      </Text>
    </View>
  );
};

const styly = StyleSheet.create({
  prazdnyKontejner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 32,
  },
  prazdnyNadpis: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  prazdnyPopis: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
}); 