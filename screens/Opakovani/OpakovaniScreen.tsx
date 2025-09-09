import React, { useMemo } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCviceni } from '../../context/CviceniContext';
import { RootStackParamList } from '../../types';
import { CviceniKarta } from '../../components/CviceniKarta';
import { KruhovyVzor } from '../../components/PozadiVzory';
import { 
  PrazdnyStav, 
  NacitaniStav
} from './components';
import { responsiveSpacingValues } from '../../src/styles/theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

/** Shell komponenta pro obrazovku cvičení na opakování */
const OpakovaniScreen: React.FC = () => {
  const { stav } = useCviceni();
  const navigation = useNavigation<NavigationProp>();



  const opakovaciCviky = useMemo(() =>
    stav.cviceni.filter(c => c.typMereni === 'opakovani'),
    [stav.cviceni]
  );

  // Zobrazení stavu načítání
  if (stav.nacitaSeData) {
    return <NacitaniStav />;
  }

  // Zobrazení prázdného stavu
  if (opakovaciCviky.length === 0) {
    return <PrazdnyStav />;
  }

  // Hlavní seznam cvičení
  return (
    <View style={styly.kontejner}>
      <KruhovyVzor />
      <FlatList
        data={opakovaciCviky}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CviceniKarta 
            cviceni={item} 
            zaznamy={stav.zaznamy}
            navigation={navigation}
          />
        )}
        contentContainerStyle={styly.seznam}
        showsVerticalScrollIndicator={false}
        // Optimalizace pro lepší výkon
        getItemLayout={(data, index) => ({
          length: 88, // Aproximativní výška položky (72px + 16px margin)
          offset: 88 * index,
          index,
        })}
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        windowSize={10}
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

export default OpakovaniScreen; 