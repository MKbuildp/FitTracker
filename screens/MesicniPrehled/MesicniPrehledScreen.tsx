import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from '../../hooks/useTranslation';
import { useCviceni } from '../../context/CviceniContext';
import { KalendarHeader, KalendarMesic, MesicniStatistiky } from './components';
import { useKalendarData } from '../Prehled/hooks/useKalendarData';
import { useMesicniData } from './hooks/useMesicniData';

/**
 * Obrazovka pro měsíční přehled cvičení
 */
const MesicniPrehledScreen: React.FC = () => {
  const { t } = useTranslation();
  const { stav } = useCviceni();
  const kalendarData = useKalendarData();
  const mesicniData = useMesicniData(kalendarData.vybranyDatum);

  return (
    <View style={styles.container}>
      <KalendarHeader
        vybranyDatum={kalendarData.vybranyDatum}
        onDatumZmena={kalendarData.setVybranyDatum}
      />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <KalendarMesic
          vybranyDatum={kalendarData.vybranyDatum}
          onDatumZmena={kalendarData.setVybranyDatum}
          data={mesicniData.mesicniData}
        />
        
        <MesicniStatistiky data={mesicniData.mesicniData} />
        
        {/* Přidáme padding na konec pro lepší scroll */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  bottomPadding: {
    height: 24,
  },
});

export default MesicniPrehledScreen;