import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {
  PridatOpakovani,
  PridatCas,
  TydenKontejner,
  NastaveniModal,
  StatistikyKomponenta,
} from './components';

import { KruhovyVzor, DiagonalniVzor } from '../../components/PozadiVzory';
import { TabBar } from '../../components/TabBar';
import { useDetailCviceni } from './hooks/useDetailCviceni';
import { useTranslation } from '../../hooks/useTranslation';
import { responsiveSpacingValues } from '../../src/styles/theme';

/** Shell komponenta pro obrazovku detailu cvičení */
const DetailCviceniScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const {
    jeModalViditelny,
    setJeModalViditelny,
    cviceni,
    zaznamy,
    statistiky,
    ulozitZaznam,
    potvrditSmazaniCviceni,
    zmenitBarvuCviceni,
    formatovatHodnotu,
    smazatZaznamSPotvrzenim,
    vsechnaCviceni,
    otevritNastaveniModal, // Nový handler
  } = useDetailCviceni();

  // Nastavení názvu a pravého tlačítka v headeru
  useEffect(() => {
    if (cviceni) {
    navigation.setOptions({
        title: cviceni.typMereni === 'opakovani' ? t('nav.repetitions') : t('nav.timers'),
      headerRight: () => (
          <TouchableOpacity
            onPress={() => setJeModalViditelny(true)}
            style={{ marginRight: 8 }}
          >
          <Ionicons name="settings-outline" size={24} color="#fff" />
        </TouchableOpacity>
      ),
    });
    }
  }, [cviceni, navigation, setJeModalViditelny, t]);

  // Pokud cvičení neexistuje, zobrazíme chybu
  if (!cviceni) {
    return (
      <View style={styly.chybaKontejner}>
        <Text style={styly.chybaText}>{t('common.exerciseNotFound')}</Text>
      </View>
    );
  }

  return (
    <>
      <View style={styly.hlavniKontejner}>
        {/* Pozadí podle typu cvičení - statické */}
        {cviceni.typMereni === 'opakovani' ? <KruhovyVzor /> : <DiagonalniVzor />}
        
        <ScrollView style={styly.kontejner} contentContainerStyle={styly.obsah}>
          {/* Statistiky */}
          <View style={styly.sekce}>
            <StatistikyKomponenta
              cviceni={cviceni}
              statistiky={statistiky}
              formatovatHodnotu={formatovatHodnotu}
              zaznamy={zaznamy}
              onDenniCilPress={otevritNastaveniModal} // Nový prop
            />
          </View>

          {/* Kontejner pro přidávání záznamu */}
          <View style={cviceni.typMereni === 'opakovani' ? styly.sekceNovyZaznam : styly.sekce}>
            {cviceni.typMereni === 'opakovani' ? (
              <PridatOpakovani 
                cviceni={cviceni} 
                onUlozit={ulozitZaznam} 
                zaznamy={zaznamy}
                onSmazatZaznam={smazatZaznamSPotvrzenim}
              />
            ) : (
              <PridatCas 
                cviceni={cviceni} 
                onUlozit={ulozitZaznam}
                zaznamy={zaznamy}
                onSmazatZaznam={smazatZaznamSPotvrzenim}
              />
            )}
          </View>

          {/* Týdenní přehled s výběrem období */}
          <View style={styly.sekce}>
            <TydenKontejner 
              zaznamy={zaznamy} 
              cviceni={cviceni}
              statistiky={statistiky}
              formatovatHodnotu={formatovatHodnotu}
              vsechnaCviceni={vsechnaCviceni}
            />
          </View>
        </ScrollView>
        
        {/* TabBar pro navigaci mezi hlavními záložkami */}
        <TabBar pozice="floating" />
      </View>

      <NastaveniModal
        viditelne={jeModalViditelny}
        onZavrit={() => setJeModalViditelny(false)}
        cviceni={cviceni}
        onSmazat={potvrditSmazaniCviceni}
        onZmenitBarvu={zmenitBarvuCviceni}
      />
    </>
  );
};

const styly = StyleSheet.create({
  hlavniKontejner: {
    flex: 1,
    backgroundColor: '#f8fafc',
    position: 'relative',
  },
  kontejner: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  obsah: {
    paddingTop: 16,
    paddingBottom: 80, // Větší padding pro TabBar
    paddingHorizontal: 16,
    zIndex: 1,
  },
  chybaKontejner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chybaText: {
    fontSize: responsiveSpacingValues.lg,
    color: '#dc2626',
  },
  sekce: {
    marginBottom: responsiveSpacingValues.md,
  },
  sekceNovyZaznam: {
    marginBottom: responsiveSpacingValues.sm,
  },

});

export default DetailCviceniScreen; 