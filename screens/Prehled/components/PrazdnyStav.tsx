import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PrazdnyStavProps } from '../types/types';
import { useTranslation } from '../../../hooks/useTranslation';
import { TeckovanyVzor } from '../../../components/PozadiVzory';
import { responsiveTypography, responsiveSpacingValues } from '../../../src/styles/theme';

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
    paddingHorizontal: responsiveSpacingValues.xl,
  },
  prazdnyNadpis: {
    fontSize: responsiveTypography.title.fontSize,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: responsiveSpacingValues.md,
    marginBottom: responsiveSpacingValues.sm,
    textAlign: 'center',
  },
  prazdnyPopis: {
    fontSize: responsiveTypography.body.fontSize,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
}); 