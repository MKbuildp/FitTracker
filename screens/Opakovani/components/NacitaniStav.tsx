import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from '../../../hooks/useTranslation';
import { KruhovyVzor } from '../../../components/PozadiVzory';
import { responsiveTypography } from '../../../src/styles/theme';

/** Komponenta pro zobrazení stavu načítání dat */
export const NacitaniStav: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <View style={styly.nacitaniKontejner}>
      <KruhovyVzor />
      <Text style={styly.nacitaniText}>{t('common.loading')}</Text>
    </View>
  );
};

const styly = StyleSheet.create({
  nacitaniKontejner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  nacitaniText: {
    fontSize: responsiveTypography.subtitle.fontSize,
    color: '#6b7280',
  },
}); 