import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import { usePridatCviceni } from './hooks/usePridatCviceni';
import { useTranslation } from '../../hooks/useTranslation';
import {
  FormularNazev,
  SmerovaniVyber,
  DenniCilVyber,
  BarvyVyber,
  TlacitkaFormulare,
} from './components';

/** Obrazovka pro přidání nového cvičení */
const PridatCviceniScreen: React.FC = () => {
  const { t } = useTranslation();
  
  // Všechna logika je nyní v hooku
  const {
    nazev,
        typMereni,
    smerovani,
    ukladaSe,
    maCil,
    pocetOpakovani,
    minuty,
    sekundy,
    vybranaBarva,
    setNazev,
    setSmerovani,
    setMaCil,
    zmenitOpakovani,
    zmenitMinuty,
    zmenitSekundy,
    setVybranaBarva,
    resetForm,
    ulozitCviceni,
  } = usePridatCviceni();

  return (
    <ScrollView style={styly.kontejner} contentContainerStyle={styly.obsah}>
      {/* Název cvičení */}
      <FormularNazev 
        nazev={nazev}
        onNazevChange={setNazev}
      />
      
      <View style={styly.oddelovac} />

      {/* Směrování (pouze pro čas) */}
      <SmerovaniVyber 
        typMereni={typMereni}
        smerovani={smerovani}
        onSmerovaniChange={setSmerovani}
      />
      
      {typMereni === 'cas' && <View style={styly.oddelovac} />}

      {/* Denní cíl */}
      <DenniCilVyber
        typMereni={typMereni}
        maCil={maCil}
        onMaCilChange={setMaCil}
        pocetOpakovani={pocetOpakovani}
        onPocetOpakovaniChange={zmenitOpakovani}
        minuty={minuty}
        onMinutyChange={zmenitMinuty}
        sekundy={sekundy}
        onSekundyChange={zmenitSekundy}
      />
      
      <View style={styly.oddelovac} />

      {/* Výběr barvy */}
      <BarvyVyber
        vybranaBarva={vybranaBarva}
        onVybratBarvu={setVybranaBarva}
        nazev={t('addExercise.exerciseColor')}
      />
      
      <View style={styly.oddelovac} />

      {/* Tlačítka */}
      <TlacitkaFormulare
        ukladaSe={ukladaSe}
        onReset={resetForm}
        onUlozit={ulozitCviceni}
      />
    </ScrollView>
  );
};

const styly = StyleSheet.create({
  kontejner: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  obsah: {
    padding: 16,
  },
  nadpisObrazovky: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 24,
    textAlign: 'center',
  },
  oddelovac: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 16,
  },
});

export default PridatCviceniScreen; 