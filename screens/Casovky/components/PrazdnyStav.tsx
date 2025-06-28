import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../../../hooks/useTranslation';
import { DiagonalniVzor } from '../../../components/PozadiVzory';

/** Komponenta pro zobrazení prázdného stavu (žádné časovky) */
export const PrazdnyStav: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <View style={styly.prazdnyKontejner}>
      <DiagonalniVzor />
      <Ionicons name="timer-outline" size={80} color="#9ca3af" />
      <Text style={styly.prazdnyNadpis}>{t('timers.empty.title')}</Text>
      <Text style={styly.prazdnyPopis}>
        {t('timers.empty.subtitle')}
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