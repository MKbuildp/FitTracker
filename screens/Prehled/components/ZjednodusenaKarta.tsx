import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Svg, Circle } from 'react-native-svg';
import { Cviceni, ZaznamVykonu, RootStackParamList } from '../../../types';
import { useTranslation } from '../../../hooks/useTranslation';

/** Typ pro navigaci */
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

/** Props pro ZjednodusenaKarta komponentu */
interface ZjednodusenaKartaProps {
  cviceni: Cviceni;
  zaznamy: ZaznamVykonu[];
  navigation: NavigationProp;
}

/** Zjistí, zda je datum dnes */
const jeDnes = (datum: Date): boolean => {
  const dnes = new Date();
  return (
    datum.getDate() === dnes.getDate() &&
    datum.getMonth() === dnes.getMonth() &&
    datum.getFullYear() === dnes.getFullYear()
  );
};

/** Formátuje čas ze sekund na MM:SS */
const formatovatCas = (sekundy: number): string => {
  const minuty = Math.floor(sekundy / 60);
  const zbyvajiciSekundy = sekundy % 60;
  return `${String(minuty).padStart(2, '0')}:${String(zbyvajiciSekundy).padStart(2, '0')}`;
};

/** Formátuje hodnotu podle typu měření */
const formatovatHodnotu = (hodnota: number, typ: 'opakovani' | 'cas'): string => {
  if (typ === 'opakovani') return hodnota.toString();
  return formatovatCas(hodnota);
};

/** Kruhový progresbar pro cíle */
const MiniProgresbar = React.memo<{ procenta: number; barva: string }>(({ procenta, barva }) => {
  const velikost = 36;
  const sirkaCary = 3;
  const polomer = (velikost - sirkaCary) / 2;
  const obvod = 2 * Math.PI * polomer;
  
  const pokrok = Math.min(procenta, 100);
  const delkaCary = obvod * (pokrok / 100);
  const barvaKruhu = procenta >= 100 ? '#059669' : barva;

  return (
    <View style={{ width: velikost, height: velikost, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={velikost} height={velikost} viewBox={`0 0 ${velikost} ${velikost}`}>
        <Circle
          cx={velikost / 2}
          cy={velikost / 2}
          r={polomer}
          stroke="#e5e7eb"
          strokeWidth={sirkaCary}
          fill="transparent"
        />
        <Circle
          cx={velikost / 2}
          cy={velikost / 2}
          r={polomer}
          stroke={barvaKruhu}
          strokeWidth={sirkaCary}
          fill="transparent"
          strokeDasharray={obvod}
          strokeDashoffset={obvod - delkaCary}
          strokeLinecap="round"
          transform={`rotate(-90 ${velikost / 2} ${velikost / 2})`}
        />
      </Svg>
      <Text style={[styly.procentaText, { color: barvaKruhu }]}>
        {procenta}%
      </Text>
    </View>
  );
});

MiniProgresbar.displayName = 'MiniProgresbar';

/** Zjednodušená karta cvičení pro Pokrok obrazovku - 3 na řádku */
export const ZjednodusenaKarta = React.memo<ZjednodusenaKartaProps>(({ 
  cviceni, 
  zaznamy, 
  navigation
}) => {
  const { t } = useTranslation();
  
  // Dnešní záznamy pro toto cvičení
  const dnesniZaznamy = zaznamy.filter(z => 
    z.cviceniId === cviceni.id && jeDnes(z.datumCas)
  );
  
  // Výpočet procent na základě denního cíle a dnešního výkonu
  let procenta = 0;
  let barvaGrafu = '#e5e7eb'; // Výchozí šedá barva pro neaktivní stav
  let dennyVykon = 0;
    
  if (dnesniZaznamy.length > 0) {
    if (cviceni.typMereni === 'opakovani') {
      dennyVykon = dnesniZaznamy.reduce((sum, z) => sum + z.hodnota, 0);
    } else {
      dennyVykon = cviceni.smerovani === 'kratsi_lepsi'
        ? Math.min(...dnesniZaznamy.map(z => z.hodnota))
        : Math.max(...dnesniZaznamy.map(z => z.hodnota));
    }
  }
      
  if (cviceni.maNastavenCil && cviceni.denniCil > 0 && dennyVykon > 0) {
    if (cviceni.typMereni === 'opakovani') {
      procenta = Math.round((dennyVykon / cviceni.denniCil) * 100);
    } else {
      if (cviceni.smerovani === 'kratsi_lepsi') {
        procenta = Math.round((cviceni.denniCil / dennyVykon) * 100);
      } else {
        procenta = Math.round((dennyVykon / cviceni.denniCil) * 100);
      }
    }
    barvaGrafu = cviceni.barva || '#6b7280'; // Aktivní barva cvičení
  }
  
  const navigateToDetail = () => {
    navigation.navigate('DetailCviceni', { cviceniId: cviceni.id });
  };

  return (
    <TouchableOpacity 
      style={[styly.karta, { borderColor: cviceni.barva || '#e5e7eb' }]}
      onPress={navigateToDetail}
      activeOpacity={0.7}
    >
      {/* Barevný indikátor nahoře */}
      <View style={[styly.barevnyPruh, { backgroundColor: cviceni.barva || '#e5e7eb' }]} />
      
      <View style={styly.obsah}>
        <Text style={styly.nazev} numberOfLines={1} ellipsizeMode="tail">{cviceni.nazev}</Text>
        
        <View style={styly.hlavicka}>
          <Ionicons 
            name={cviceni.typMereni === 'cas' ? 'timer' : 'repeat'} 
            size={16} 
            color={cviceni.barva || '#6b7280'} 
          />
          <MiniProgresbar procenta={procenta} barva={barvaGrafu} />
        </View>
        
        <View style={styly.vykonRadek}>
          <Text style={styly.vykonText}>
            {t('stats.today')}: {' '}
            <Text style={styly.vykonHodnota}>
              {dennyVykon > 0 ? formatovatHodnotu(dennyVykon, cviceni.typMereni) : '—'}
            </Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

// Nastavení displayName pro React Developer Tools
ZjednodusenaKarta.displayName = 'ZjednodusenaKarta';

const styly = StyleSheet.create({
  karta: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    width: '30.67%',
    marginHorizontal: 4,
    minHeight: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1.2,
  },
  barevnyPruh: {
    height: 3,
    borderRadius: 1.5,
    marginBottom: 8,
  },
  obsah: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  hlavicka: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  pocetZaznamu: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  nazev: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1f2937',
    lineHeight: 18,
    marginBottom: 4,
  },
  vykonRadek: {
    alignItems: 'flex-start',
    marginTop: 4,
  },
  vykonText: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'left',
  },
  vykonHodnota: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1e40af',
  },
  procentaText: {
    position: 'absolute',
    fontSize: 9,
    fontWeight: '600',
    textAlign: 'center',
  },

}); 