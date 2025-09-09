import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CviceniPolozkaProps } from '../types/types';
import { KruhovyUkazatelPokroku } from './KruhovyUkazatelPokroku';
import { InfoRadek } from './InfoRadek';
import { responsiveComponents, responsiveTypography, responsiveSpacingValues } from '../../../src/styles/theme';

/** Optimalizovaná komponenta pro jednu položku cvičení v seznamu */
export const CviceniPolozka = React.memo<CviceniPolozkaProps>(({ cviceni, navigation, zaznamy }) => {
  const stinStyl = useMemo(() => ({
    shadowColor: cviceni.barva || '#000',
    shadowOffset: { width: -2, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 4,
  }), [cviceni.barva]);

  const ohranicenieStyl = useMemo(() => ({
    borderWidth: 1.2,
    borderColor: cviceni.barva || '#e5e7eb',
  }), [cviceni.barva]);

  const navigateToDetail = () => {
    navigation.navigate('DetailCviceni', { cviceniId: cviceni.id });
  };

  return (
    <TouchableOpacity 
      style={[styly.polozka, stinStyl, ohranicenieStyl]}
      onPress={navigateToDetail}
      activeOpacity={0.7}
    >
      <View style={[styly.barevnyPruh, { backgroundColor: cviceni.barva || '#e5e7eb' }]} />

      <View style={styly.polozkaObsah}>
        <Text style={styly.nazevCviceni}>{cviceni.nazev}</Text>
        <InfoRadek cviceni={cviceni} zaznamy={zaznamy} />
      </View>
      
      <KruhovyUkazatelPokroku cviceni={cviceni} zaznamy={zaznamy} />
    </TouchableOpacity>
  );
});

// Nastavení displayName pro React Developer Tools
CviceniPolozka.displayName = 'CviceniPolozka';

const styly = StyleSheet.create({
  polozka: {
    backgroundColor: 'white',
    borderRadius: responsiveComponents.cardBorderRadius,
    paddingVertical: responsiveSpacingValues.sm,
    paddingRight: responsiveSpacingValues.md,
    paddingLeft: responsiveSpacingValues.lg,
    marginBottom: responsiveSpacingValues.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  barevnyPruh: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
    borderTopLeftRadius: responsiveComponents.cardBorderRadius,
    borderBottomLeftRadius: responsiveComponents.cardBorderRadius,
  },
  polozkaObsah: {
    flex: 1,
    marginRight: responsiveSpacingValues.sm,
  },
  nazevCviceni: {
    fontSize: responsiveTypography.subtitle.fontSize * 1.1, // Zvětšeno o 10% (18px → 20px)
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: responsiveSpacingValues.sm,
  },
}); 