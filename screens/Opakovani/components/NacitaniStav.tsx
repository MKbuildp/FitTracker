import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from '../../../hooks/useTranslation';
import { KruhovyVzor } from '../../../components/PozadiVzory';

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
    fontSize: 18,
    color: '#6b7280',
  },
}); 