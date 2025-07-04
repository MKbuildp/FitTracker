import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTranslation } from '../../hooks/useTranslation';
import {
  CelkoveStatistiky,
  PrehledCviceni,
  PrazdnyStav,
  CelkovyProgressBar,
  NastaveniModal,
  PremiumModal,
} from './components';
import { ObdobniSelektor } from '../../components/ObdobniSelektor';
import { TeckovanyVzor } from '../../components/PozadiVzory';
import { useCviceni } from '../../context/CviceniContext';
import { NavigationProp } from './types/types';

/**
 * Shell komponenta pro obrazovku Přehled.
 */
const PrehledScreen: React.FC<{ onOtevritPremium: () => void }> = ({ onOtevritPremium }) => {
  const { stav } = useCviceni();
  const navigation = useNavigation<NavigationProp>();
  const { t } = useTranslation();
  const [jeNastaveniViditelne, setJeNastaveniViditelne] = useState(false);

  // Bezpečné nastavení callback funkce pro otevření nastavení
  useFocusEffect(
    React.useCallback(() => {
      // Uložíme referenci na funkci pro otevření nastavení
      const otevritNastaveni = () => setJeNastaveniViditelne(true);
      
      // Přiřadíme funkci do globálního objektu pouze pro tuto obrazovku
      (global as any).otevritNastaveni = otevritNastaveni;
      
      return () => {
        // Vyčistíme při opuštění obrazovky
        (global as any).otevritNastaveni = undefined;
      };
    }, [])
  );

  const obnovitNakupy = () => {
    // Premium funkce jsou aktivní automaticky
    console.log('Premium funkce jsou automaticky aktivovány pro testovací build.');
  };

  if (stav.nacitaSeData) {
    return (
      <View style={styly.nacitaniKontejner}>
        <TeckovanyVzor />
        <Text style={styly.nacitaniText}>{t('overview.loadingStats')}</Text>
      </View>
    );
  }

  if (stav.cviceni.length === 0) {
    return <PrazdnyStav navigation={navigation} />;
  }

  return (
    <>
      <View style={styly.kontejner}>
        <TeckovanyVzor />
        <PrehledCviceni
          zaznamy={stav.zaznamy}
          cviceni={stav.cviceni}
          navigation={navigation}
          statistiky={
            <View>
              <View style={styly.statistikyKontejner}>
                <CelkoveStatistiky zaznamy={stav.zaznamy} cviceni={stav.cviceni} />
              </View>
              <View style={styly.selektorKontejner}>
                <ObdobniSelektor borderColor="#2563eb" />
              </View>
              <View style={styly.cileKontejner}>
                <CelkovyProgressBar zaznamy={stav.zaznamy} cviceni={stav.cviceni} />
              </View>
            </View>
          }
        />
      </View>
      
      <NastaveniModal
        viditelne={jeNastaveniViditelne}
        onZavrit={() => setJeNastaveniViditelne(false)}
        onUpgradeToPremium={() => {
          setJeNastaveniViditelne(false);
          onOtevritPremium();
        }}
      />
    </>
  );
};

const styly = StyleSheet.create({
  kontejner: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  statistikyKontejner: {
    paddingTop: 16,
    paddingBottom: 0,
  },
  selektorKontejner: {
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 0,
  },
  cileKontejner: {
    paddingTop: 16,
    paddingBottom: 0,
  },
  obsah: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  sekce: {
    marginBottom: 12,
  },
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

export default PrehledScreen; 