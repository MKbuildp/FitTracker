import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTranslation } from '../../hooks/useTranslation';
import {
  PrehledCviceni,
  PrazdnyStav,
  NastaveniModal,
  DenniAktivita,
  NastaveniCiluModal,
  KrokyKarta,
} from './components';
import { KalendarHeader, KalendarTyden } from './components/Kalendar';
import { TeckovanyVzor } from '../../components/PozadiVzory';
import { useCviceni } from '../../context/CviceniContext';
import { useKalendarData } from './hooks/useKalendarData';
import { NavigationProp } from './types/types';
import { responsiveSpacingValues } from '../../src/styles/theme';

/**
 * Shell komponenta pro obrazovku Přehled.
 */
const PrehledScreen: React.FC = () => {
  const { stav } = useCviceni();
  const navigation = useNavigation<NavigationProp>();
  const { t } = useTranslation();
  const [jeNastaveniViditelne, setJeNastaveniViditelne] = useState(false);
  const [jeNastaveniCiluViditelne, setJeNastaveniCiluViditelne] = useState(false);

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
  };

  const kalendarData = useKalendarData();

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
            <View style={styly.kalendarKontejner}>
              <KalendarHeader
                vybranyDatum={kalendarData.vybranyDatum}
                onDatumZmena={kalendarData.setVybranyDatum}
              />
              
              <KalendarTyden
                data={kalendarData.obdobiData}
                vybranyDatum={kalendarData.vybranyDatum}
                onDatumZmena={kalendarData.setVybranyDatum}
              />
              
              <DenniAktivita 
                data={kalendarData.denniData} 
                onProgressPress={() => setJeNastaveniCiluViditelne(true)}
              />
              
              <KrokyKarta />
            </View>
          }
        />
      </View>
      
      <NastaveniModal
        viditelne={jeNastaveniViditelne}
        onZavrit={() => setJeNastaveniViditelne(false)}
      />
      
      <NastaveniCiluModal
        viditelne={jeNastaveniCiluViditelne}
        onZavrit={() => setJeNastaveniCiluViditelne(false)}
      />
    </>
  );
};

const styly = StyleSheet.create({
  kontejner: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  kalendarKontejner: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    marginBottom: 8,
  },
  bottomPadding: {
    height: responsiveSpacingValues.lg,
  },


  nacitaniKontejner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  nacitaniText: {
    fontSize: responsiveSpacingValues.lg,
    color: '#6b7280',
  },
});

export default PrehledScreen; 