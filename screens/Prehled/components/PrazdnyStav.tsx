import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PrazdnyStavProps } from '../types/types';
import { useTranslation } from '../../../hooks/useTranslation';
import { TeckovanyVzor } from '../../../components/PozadiVzory';

/** Komponenta pro zobrazení prázdného stavu bez cvičení */
export const PrazdnyStav: React.FC<PrazdnyStavProps> = ({ navigation }) => {
  const { t } = useTranslation();

  return (
    <View style={styly.prazdnyKontejner}>
      <TeckovanyVzor />
      <Ionicons name="trending-up-outline" size={80} color="#9ca3af" />
      <Text style={styly.prazdnyNadpis}>{t('overview.empty.title')}</Text>
      <Text style={styly.prazdnyPopis}>
        {t('overview.empty.subtitle')}
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
    textAlign: 'center',
  },
  prazdnyPopis: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
}); 