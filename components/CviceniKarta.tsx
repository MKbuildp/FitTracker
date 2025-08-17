import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Svg, Circle } from 'react-native-svg';
import { Cviceni, ZaznamVykonu, RootStackParamList } from '../types';
import { useTranslation } from '../hooks/useTranslation';

/** Typ pro navigaci */
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

/** Props pro CviceniKarta komponentu */
interface CviceniKartaProps {
  cviceni: Cviceni;
  zaznamy: ZaznamVykonu[];
  navigation: NavigationProp;
}

/** Statistiky pro jedno cvičení */
interface StatistikyCviceni {
  pocetZaznamuDnes: number;
  dennyVykon: number;
  maDnesniZaznamy: boolean;
  procenta: number;
}

// Pomocné funkce
const formatovatCas = (sekundy: number): string => {
  const minuty = Math.floor(sekundy / 60);
  const zbyvajiciSekundy = sekundy % 60;
  return `${String(minuty).padStart(2, '0')}:${String(zbyvajiciSekundy).padStart(2, '0')}`;
};

const formatovatHodnotu = (hodnota: number, typ: 'opakovani' | 'cas'): string => {
  if (typ === 'opakovani') return hodnota.toString();
  return formatovatCas(hodnota);
};

/** Zjistí, zda je datum dnes */
const jeDnes = (datum: Date): boolean => {
  const dnes = new Date();
  return (
    datum.getDate() === dnes.getDate() &&
    datum.getMonth() === dnes.getMonth() &&
    datum.getFullYear() === dnes.getFullYear()
  );
};

const vypocitatStatistiky = (cviceni: Cviceni, zaznamy: ZaznamVykonu[]): StatistikyCviceni => {
  // Dnešní záznamy pro toto cvičení
  const dnesniZaznamy = zaznamy.filter(z => 
    z.cviceniId === cviceni.id && jeDnes(z.datumCas)
  );
  
  if (dnesniZaznamy.length === 0) {
    return {
      pocetZaznamuDnes: 0,
      dennyVykon: 0,
      maDnesniZaznamy: false,
      procenta: 0,
    };
  }

  let dennyVykon: number;
  
  if (cviceni.typMereni === 'opakovani') {
    // U opakování sečteme všechny dnešní hodnoty
    dennyVykon = dnesniZaznamy.reduce((sum, z) => sum + z.hodnota, 0);
  } else {
    // U času najdeme nejlepší (podle směrování)
    dennyVykon = cviceni.smerovani === 'kratsi_lepsi'
      ? Math.min(...dnesniZaznamy.map(z => z.hodnota))
      : Math.max(...dnesniZaznamy.map(z => z.hodnota));
  }

  // Výpočet procent na základě denního cíle
  let procenta = 0;
  if (cviceni.maNastavenCil && cviceni.denniCil > 0) {
    if (cviceni.typMereni === 'opakovani') {
      procenta = Math.round((dennyVykon / cviceni.denniCil) * 100);
    } else {
      // U času: pokud kratší_lepsi, čím menší čas, tím lepší
      if (cviceni.smerovani === 'kratsi_lepsi') {
        procenta = Math.round((cviceni.denniCil / dennyVykon) * 100);
      } else {
        procenta = Math.round((dennyVykon / cviceni.denniCil) * 100);
      }
    }
  }

  return {
    pocetZaznamuDnes: dnesniZaznamy.length,
    dennyVykon,
    maDnesniZaznamy: true,
    procenta: Math.max(0, procenta), // Zajistí nezáporná procenta
  };
};

/** Kruhový progresbar s procentuálním vyjádřením */
const KruhovyProgresbar = React.memo<{ procenta: number; barva: string }>(({ procenta, barva }) => {
  const velikost = 52;
  const sirkaCary = 5;
  const polomer = (velikost - sirkaCary) / 2;
  const obvod = 2 * Math.PI * polomer;
  
  const pokrok = Math.min(procenta, 100); // Kruh max 100%, ale číslo skutečné
  const delkaCary = obvod * (pokrok / 100);
  const barvaKruhu = barva; // Pouze barva cvičení, bez změny při 100%

  return (
    <View style={{ width: velikost, height: velikost, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={velikost} height={velikost} viewBox={`0 0 ${velikost} ${velikost}`}>
        {/* Pozadí kruhu */}
        <Circle
          cx={velikost / 2}
          cy={velikost / 2}
          r={polomer}
          stroke="#e5e7eb"
          strokeWidth={sirkaCary}
          fill="transparent"
        />
        {/* Progresbar */}
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

    </View>
  );
});

// Nastavení displayName
KruhovyProgresbar.displayName = 'KruhovyProgresbar';

/** Komponenta pro jednu kartu cvičení - sdílená mezi obrazovkami */
export const CviceniKarta = React.memo<CviceniKartaProps>(({ cviceni, zaznamy, navigation }) => {
  const { t } = useTranslation();
  const statistiky = vypocitatStatistiky(cviceni, zaznamy);
  
  const navigateToDetail = () => {
    navigation.navigate('DetailCviceni', { cviceniId: cviceni.id });
  };

  return (
    <TouchableOpacity 
      style={[
        styly.karta,
        {
          borderWidth: 1.2,
          borderColor: cviceni.barva || '#e5e7eb',
        }
      ]}
      onPress={navigateToDetail}
      activeOpacity={0.7}
    >
      {/* Barevný indikátor vlevo */}
      <View style={[styly.barevnyPruh, { backgroundColor: cviceni.barva || '#e5e7eb' }]} />
      
      <View style={styly.obsah}>
        <View style={[styly.hlavicka, { borderColor: cviceni.barva || '#e5e7eb' }]}>
          <Text style={styly.nazev} numberOfLines={1} ellipsizeMode="tail">{cviceni.nazev}</Text>
        </View>
        
        <View style={styly.statistikyRadek}>
          {/* Denní cíl - nově na začátku */}
          <View style={styly.statistika}>
            <Text style={styly.statistikaHodnota}>
              {cviceni.denniCil > 0 
                ? formatovatHodnotu(cviceni.denniCil, cviceni.typMereni)
                : '—'
              }
            </Text>
            <View style={styly.statistikaPopisSIkonou}>
              <Ionicons name="trophy" size={12} color="#10b981" />
              <Text style={styly.statistikaPopis}>{t('stats.dailyGoal')}</Text>
            </View>
          </View>
          
            <View style={styly.statistika}>
              <Text style={styly.statistikaHodnota}>
              {statistiky.maDnesniZaznamy 
                ? formatovatHodnotu(statistiky.dennyVykon, cviceni.typMereni)
                : cviceni.typMereni === 'opakovani' ? '0' : '0:00'
              }
              </Text>
              <View style={styly.statistikaPopisSIkonou}>
                <Ionicons 
                  name="today" 
                  size={12} 
                  color="#f97316" 
                />
                <Text style={styly.statistikaPopis}>
                  {t('stats.today')}
                </Text>
              </View>
            </View>

          {/* Záznamů - nově na konci */}
          <View style={styly.statistika}>
            <Text style={styly.statistikaHodnota}>{statistiky.pocetZaznamuDnes}</Text>
            <View style={styly.statistikaPopisSIkonou}>
              <Ionicons name="document-text" size={12} color="#3b82f6" />
              <Text style={styly.statistikaPopis}>{t('stats.records')}</Text>
            </View>
          </View>
        </View>
        

      </View>
      
      <View style={styly.pravySloupec}>
        <KruhovyProgresbar 
          procenta={statistiky.procenta} 
          barva={cviceni.barva || '#6b7280'} 
        />
        <Ionicons 
          name={cviceni.typMereni === 'cas' ? 'timer' : 'repeat'} 
          size={18} 
          color={cviceni.barva || '#6b7280'} 
          style={styly.ikonaPodProgressem}
        />
      </View>
    </TouchableOpacity>
  );
});

// Nastavení displayName pro React Developer Tools
CviceniKarta.displayName = 'CviceniKarta';

const styly = StyleSheet.create({
  karta: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  barevnyPruh: {
    width: 4,
    height: '100%',
    borderRadius: 2,
    marginRight: 12,
  },
  obsah: {
    flex: 1,
  },
  hlavicka: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 5.76,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    width: '90%',
  },
  nazev: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  statistikyRadek: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 4,
  },
  statistika: {
    alignItems: 'center',
  },
  statistikaHodnota: {
    fontSize: 14.6, // Zmenšeno o 5% (15.4 * 0.95 = 14.6)
    color: '#1e40af',
    fontWeight: 'normal',
  },
  statistikaPopis: {
    fontSize: 11.4, // Zmenšeno o 5% (12 * 0.95 = 11.4)
    color: '#6b7280',
    marginTop: 1,
  },
  statistikaPopisSIkonou: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 1,
  },

  pravySloupec: {
    alignItems: 'center',
  },
  ikonaPodProgressem: {
    marginTop: 4,
  },

}); 