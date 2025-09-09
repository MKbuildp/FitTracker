import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { CasovkaPolozka } from './CasovkaPolozka';
import { Cviceni, ZaznamVykonu } from '../../../types';
import { CasovkyNavigationProp } from '../types/types';
import { DiagonalniVzor } from '../../../components/PozadiVzory';
import { responsiveSpacingValues } from '../../../src/styles/theme';

/** Props pro SeznamCasovek komponentu */
interface SeznamCasovekProps {
  casovky: Cviceni[];
  zaznamy: ZaznamVykonu[];
  navigation: CasovkyNavigationProp;
}

/** Komponenta pro zobrazení seznamu časovek pomocí FlatList */
export const SeznamCasovek: React.FC<SeznamCasovekProps> = ({ 
  casovky, 
  zaznamy, 
  navigation 
}) => {
  return (
    <View style={styly.kontejner}>
      <DiagonalniVzor />
      <FlatList
        data={casovky}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CasovkaPolozka 
            cviceni={item} 
            zaznamy={zaznamy}
            navigation={navigation}
          />
        )}
        contentContainerStyle={styly.seznam}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styly = StyleSheet.create({
  kontejner: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  seznam: {
    padding: responsiveSpacingValues.md,
    zIndex: 1,
  },
}); 