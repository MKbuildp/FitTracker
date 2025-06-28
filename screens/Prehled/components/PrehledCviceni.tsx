import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { ZjednodusenaKarta } from './ZjednodusenaKarta';
import { PrehledCviceniProps } from '../types/types';
import { useTranslation } from '../../../hooks/useTranslation';

/**
 * Komponenta pro zobrazení přehledu všech cvičení
 */
export const PrehledCviceni: React.FC<PrehledCviceniProps> = ({ 
  zaznamy, 
  cviceni, 
  navigation,
  statistiky
}) => {
  const { t } = useTranslation();

  const renderZjednodusenaKarta = ({ item }: { item: any }) => (
    <ZjednodusenaKarta 
      cviceni={item} 
      zaznamy={zaznamy.filter(z => z.cviceniId === item.id)}
      navigation={navigation}
    />
  );

  const renderHeader = () => (
    <View>
      <View style={styly.statistikyWrapper}>
      {statistiky}
      </View>
    </View>
  );

  return (
    <FlatList
      data={cviceni}
      renderItem={renderZjednodusenaKarta}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={renderHeader}
      contentContainerStyle={styly.seznam}
      showsVerticalScrollIndicator={false}
      style={styly.flatList}
      numColumns={3}
      columnWrapperStyle={styly.radek}
    />
  );
};

const styly = StyleSheet.create({
  statistikyWrapper: {
    marginBottom: 0,
    zIndex: 1,
  },
  flatList: {
    flex: 1,
    zIndex: 1,
  },
  nadpisSekce: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  sekceHeader: {
    marginBottom: 16,
    paddingHorizontal: 16,
    zIndex: 1,
  },
  seznam: {
    paddingTop: 0,
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  radek: {
    justifyContent: 'flex-start',
    paddingHorizontal: 0,
    gap: 0,
  },
}); 