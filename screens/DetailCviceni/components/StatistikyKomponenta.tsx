import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatistikyKomponentaProps } from '../types/types';
import { ZaznamVykonu } from '../../../types';
import { useTranslation } from '../../../hooks/useTranslation';
import { responsiveComponents, responsiveTypography, responsiveSpacingValues } from '../../../src/styles/theme';


/** Komponenta pro zobrazení aktuálního přehledu cvičení (pracovní název: aktualni_prehled) */
export const StatistikyKomponenta: React.FC<StatistikyKomponentaProps> = ({ 
  cviceni, 
  statistiky, 
  formatovatHodnotu,
  zaznamy,
  onDenniCilPress
}) => {
  const { safeT } = useTranslation();
  
  // Filtrované záznamy pro aktuální cvičení
  const filtrovaneZaznamy = zaznamy.filter((z: ZaznamVykonu) => z.cviceniId === cviceni.id);
  
  // Přepočítané statistiky pro vybrané období
  const obdobiStatistiky = React.useMemo(() => {
    if (filtrovaneZaznamy.length === 0) {
      return {
        pocetZaznamu: 0,
        celkemHodnota: 0,
        nejlepsiVykon: 0,
        prumernyVykon: 0,
        dnesniVykon: statistiky.dnesniVykon // Dnešní výkon zůstává stejný
      };
    }
    
    const hodnoty = filtrovaneZaznamy.map(z => z.hodnota);
    const celkemHodnota = cviceni.typMereni === 'opakovani' 
      ? hodnoty.reduce((sum, h) => sum + h, 0)
      : hodnoty.reduce((sum, h) => sum + h, 0);
    
    const nejlepsiVykon = cviceni.smerovani === 'kratsi_lepsi'
      ? Math.min(...hodnoty)
      : Math.max(...hodnoty);
    
    const prumernyVykon = Math.round(celkemHodnota / hodnoty.length);
    
    return {
      pocetZaznamu: filtrovaneZaznamy.length,
      celkemHodnota,
      nejlepsiVykon,
      prumernyVykon,
      dnesniVykon: statistiky.dnesniVykon
    };
  }, [filtrovaneZaznamy, cviceni, statistiky.dnesniVykon]);
  
  // Výpočet procent pro progress bar
  const skutecnaProcenta = cviceni.denniCil && obdobiStatistiky.dnesniVykon > 0
    ? (() => {
        if (cviceni.typMereni === 'opakovani') {
          // Pro opakování: dnesniVykon / denniCil
          return Math.round((obdobiStatistiky.dnesniVykon / cviceni.denniCil) * 100);
        } else {
          // Pro časovky: závisí na směrování
          if (cviceni.smerovani === 'kratsi_lepsi') {
            // Kratší je lepší: denniCil / dnesniVykon
            return Math.round((cviceni.denniCil / obdobiStatistiky.dnesniVykon) * 100);
          } else {
            // Delší je lepší: dnesniVykon / denniCil
            return Math.round((obdobiStatistiky.dnesniVykon / cviceni.denniCil) * 100);
          }
        }
      })()
    : 0;
  const vizualniProcenta = Math.min(skutecnaProcenta, 100); // Progress bar max 100%
  
  // Odstraněno - nepoužíváme textObdobi

  return (
    <View style={[
      styly.kontejner,
      {
        borderWidth: 1.2,
        borderColor: cviceni.barva || '#e5e7eb',
      }
    ]}>
      {/* Barevné označení nahoře s názvem */}
      <View style={[styly.barevnyHeader, { backgroundColor: cviceni.barva || '#e5e7eb' }]}>
              <View style={styly.headerObsah}>
        <View style={styly.headerLeva}>
          <Ionicons 
            name={cviceni.typMereni === 'cas' ? 'timer' : 'repeat'} 
            size={20} 
            color="white" 
          />
        </View>
        <Text style={styly.headerText}>{cviceni.nazev}</Text>
        <View style={styly.headerPrava} />
      </View>
      </View>
      
      {/* Statistiky - pouze Dnes a Denní cíl */}
      <View style={styly.statistikyObsah}>
        {/* Jediný řádek s Dnes a Denní cíl */}
        <View style={styly.statistikyRadek}>
          <View style={[styly.statistikaPolozkaVyrazna, { borderColor: cviceni.barva || '#9ca3af' }]}>
            <View style={styly.statistikaHeader}>
              <Ionicons name="today" size={16} color="#ef4444" />
              <Text style={styly.statistikaNazevVetsi}>
                {safeT('stats.today', 'Dnes')}
              </Text>
            </View>
            <Text style={styly.statistikaHodnota}>{formatovatHodnotu(obdobiStatistiky.dnesniVykon)}</Text>
          </View>
          
          <TouchableOpacity 
            style={[styly.statistikaPolozkaVyrazna, { borderColor: cviceni.barva || '#9ca3af' }]}
            onPress={onDenniCilPress}
            activeOpacity={0.7}
          >
            <View style={styly.statistikaHeader}>
              <Ionicons name="trophy" size={16} color="#10b981" />
              <Text style={styly.statistikaNazevVetsi}>
                {safeT('stats.dailyGoal', 'Denní cíl')}
              </Text>
            </View>
            <Text style={styly.statistikaHodnota}>
              {cviceni.denniCil ? formatovatHodnotu(cviceni.denniCil) : '-'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Progress bar */}
        <View style={styly.progressBarKontejner}>
          <View style={styly.progressBarPozadi}>
            <View 
              style={[
                styly.progressBarVypln,
                { 
                  width: `${vizualniProcenta}%`,
                  backgroundColor: cviceni.denniCil ? (cviceni.barva || '#6b7280') : '#e5e7eb'
                }
              ]} 
            />
          </View>
          <Text style={styly.progressBarText}>
            {cviceni.denniCil ? `${skutecnaProcenta}%` : safeT('detail.noGoalSet', 'Není nastaven cíl')}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styly = StyleSheet.create({
  kontejner: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  barevnyHeader: {
    paddingVertical: 7,
    paddingHorizontal: 16,
  },
  headerObsah: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  headerLeva: {
    width: 24,
    alignItems: 'flex-start',
  },
  headerPrava: {
    width: 24,
  },
  headerText: {
    fontSize: 18.4, // Zvětšeno o 15% z 16 na 18.4
    fontWeight: '600',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  statistikyObsah: {
    padding: 16, // Zvětšeno z 12 na 16 pro mezeru 3mm
  },
  statistikyRadek: {
    flexDirection: 'row',
    gap: responsiveSpacingValues.sm,
    marginBottom: 0, // Odstraněno - mezeru řeší progressBarKontejner marginTop
  },

  statistikaPolozkaVyrazna: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: responsiveSpacingValues.sm,
    padding: responsiveSpacingValues.sm,
    borderWidth: 1.2,
    borderColor: '#9ca3af',
  },
  statistikaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: responsiveSpacingValues.sm,
    gap: 5.4,
  },

  statistikaNazevVetsi: {
    fontSize: responsiveTypography.caption.fontSize * 1.1, // Zvětšeno o 10% (14px → 15.4px)
    color: '#6b7280',
    fontWeight: '500',
  },
  statistikaHodnota: {
    fontSize: responsiveTypography.subtitle.fontSize * 1.1, // Zvětšeno o 10% (18px → 19.8px)
    fontWeight: 'bold',
    color: '#1e40af',
    textAlign: 'center',
  },

  progressBarKontejner: {
    marginTop: responsiveSpacingValues.md, // 16px = ~3mm mezera mezi okny a progress barem
    paddingHorizontal: responsiveSpacingValues.xs,
  },
  progressBarPozadi: {
    height: 6, // Zmenšeno o 3px (9 - 3 = 6)
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarVypln: {
    height: '100%',
    borderRadius: 3,
  },
  progressBarText: {
    fontSize: responsiveTypography.caption.fontSize - 2, // Menší než caption
    color: '#6b7280',
    textAlign: 'center',
    marginTop: responsiveSpacingValues.xs,
  },
}); 