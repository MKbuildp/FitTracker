import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../../../hooks/useTranslation';
import { DiagonalniVzor } from '../../../components/PozadiVzory';
import { responsiveTypography, responsiveSpacingValues } from '../../../src/styles/theme';

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
    paddingHorizontal: responsiveSpacingValues.xl,
  },
  prazdnyNadpis: {
    fontSize: responsiveTypography.title.fontSize,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: responsiveSpacingValues.md,
    marginBottom: responsiveSpacingValues.sm,
  },
  prazdnyPopis: {
    fontSize: responsiveTypography.body.fontSize,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: responsiveTypography.body.fontSize * 1.5,
    marginBottom: responsiveSpacingValues.xl,
  },
}); 