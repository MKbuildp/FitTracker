import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from '../hooks/useTranslation';
import { RootStackParamList } from '../types';
import { responsiveComponents, responsiveTypography, responsiveSpacingValues } from '../src/styles/theme';

interface TabBarProps {
  /** Aktuálně aktivní záložka */
  aktivniTab?: 'Casovky' | 'Prehled' | 'Opakovani';
  /** Styl pozice - 'floating' nebo 'fixed' */
  pozice?: 'floating' | 'fixed';
}

/**
 * Znovupoužitelná TabBar komponenta pro navigaci mezi hlavními záložkami
 */
export const TabBar: React.FC<TabBarProps> = ({ 
  aktivniTab, 
  pozice = 'floating' 
}) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();

  const taby = [
    {
      nazev: 'Casovky',
      ikona: 'timer',
      ikonaOutline: 'timer-outline',
      preklad: t('nav.timers'),
    },
    {
      nazev: 'Prehled', 
      ikona: 'trending-up',
      ikonaOutline: 'trending-up-outline',
      preklad: t('nav.overview'),
    },
    {
      nazev: 'Opakovani',
      ikona: 'repeat', 
      ikonaOutline: 'repeat-outline',
      preklad: t('nav.repetitions'),
    },
  ];

  const handleTabPress = (tabNazev: string) => {
    // Navigace zpět na hlavní tab navigaci s konkrétní záložkou
    // Použijeme reset pro návrat na Tab Navigator a nastavení správné záložky
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'HlavniTaby',
          params: { screen: tabNazev },
        },
      ],
    });
  };

  const styly = pozice === 'floating' ? styles.floating : styles.fixed;

  return (
    <View style={[styles.kontejner, styly]}>
      {taby.map((tab) => {
        const jeAktivni = aktivniTab === tab.nazev;
        const ikonaNazev = jeAktivni ? tab.ikona : tab.ikonaOutline;
        // Na modrém pozadí budou všechny ikony a texty bílé
        const barva = '#ffffff'; // Bílá barva pro všechny prvky

        return (
          <TouchableOpacity
            key={tab.nazev}
            style={styles.tabTlacitko}
            onPress={() => handleTabPress(tab.nazev)}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={ikonaNazev as keyof typeof Ionicons.glyphMap} 
              size={24} 
              color={barva} 
            />
            <Text style={[styles.tabText, { color: barva }]}>
              {tab.preklad}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  kontejner: {
    backgroundColor: '#2563eb', // Stejná modrá barva jako hlavička
    paddingVertical: responsiveSpacingValues.sm,
    paddingHorizontal: 0, // Bez horizontálního padding pro celou šířku
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    minHeight: responsiveComponents.buttonHeight + responsiveSpacingValues.sm, // Výška podobná původnímu Tab Navigator
    // Stín nad horní hranou jako původní Tab Navigator
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 }, // Stín nahoru
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8, // Android stín
  },
  
  floating: {
    position: 'absolute',
    bottom: 0, // Přilepit ke spodku obrazovky
    left: 0,
    right: 0,
  },
  
  fixed: {
    marginTop: 'auto',
  },
  
  tabTlacitko: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: responsiveSpacingValues.xs,
    paddingHorizontal: responsiveSpacingValues.sm,
    minHeight: responsiveComponents.actionButtonSize + responsiveSpacingValues.sm,
  },
  
  tabText: {
    fontSize: responsiveTypography.caption.fontSize,
    fontWeight: '500',
    marginTop: responsiveSpacingValues.xxs,
    textAlign: 'center',
  },
});
