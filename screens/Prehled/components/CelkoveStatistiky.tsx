import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CelkoveStatistikyProps } from '../types/types';
import { getDatyTydne } from '../utils/datumUtils';
import { useTranslation } from '../../../hooks/useTranslation';

/** Komponenta pro zobrazení celkových statistik */
export const CelkoveStatistiky: React.FC<CelkoveStatistikyProps> = ({ zaznamy, cviceni }) => {
  const { t } = useTranslation();
  // Získáme data pro aktuální týden
  const datyTydne = getDatyTydne(new Date());
  
  // Spočítáme statistiky pro aktuální týden
  const pocetZaznamu = zaznamy.filter(zaznam => 
    datyTydne.some(datum => 
      new Date(zaznam.datum).toDateString() === datum.toDateString()
    )
  ).length;

  // Počet aktivních dní v týdnu
  const aktivniDny = new Set(
    zaznamy
      .filter(zaznam => 
        datyTydne.some(datum => 
          new Date(zaznam.datum).toDateString() === datum.toDateString()
        )
      )
      .map(zaznam => new Date(zaznam.datum).toDateString())
  ).size;

  // Plnění cílů - procento splněných denních cílů
  const splneneCile = zaznamy.filter(zaznam => 
    datyTydne.some(datum => 
      new Date(zaznam.datum).toDateString() === datum.toDateString() && 
      zaznam.splnenDenniCil
    )
  ).length;
  
  const celkoveCile = cviceni.reduce((acc, cv) => acc + (cv.denniCil ? 1 : 0), 0) * 7;
  const plneniCilu = celkoveCile > 0 ? Math.round((splneneCile / celkoveCile) * 100) : 0;
  
  const textZaznamu = t('overview.totalRecords');
  const textAktivnichDni = t('overview.activeDays');
  


  return (
    <View style={styly.sekce}>
      <View style={styly.statistikyGrid}>
        {/* První: Aktivita */}
        <View style={[styly.statistikaKarta, { borderColor: '#dc2626' }]}>
          {/* Barevná hlavička */}
          <View style={[styly.barevnyHeader, { backgroundColor: '#dc2626' }]}>
            <Text style={styly.headerText}>{textAktivnichDni}</Text>
          </View>
          <View style={styly.obsah}>
            <Ionicons name="calendar" size={22} color="#dc2626" />
            <Text style={styly.statistikaCislo}>{aktivniDny}</Text>
          </View>
        </View>
        
        {/* Druhé: Cíle */}
        <View style={[styly.statistikaKarta, { borderColor: '#7c3aed' }]}>
          {/* Barevná hlavička */}
          <View style={[styly.barevnyHeader, { backgroundColor: '#7c3aed' }]}>
            <Text style={styly.headerText}>{t('overview.goalCompletion')}</Text>
          </View>
          <View style={styly.obsah}>
          <Ionicons name="trophy" size={24} color="#7c3aed" />
          <Text style={styly.statistikaCislo}>{plneniCilu}%</Text>
          </View>
        </View>
        
        {/* Třetí: Záznamy */}
        <View style={[styly.statistikaKarta, { borderColor: '#059669' }]}>
          {/* Barevná hlavička */}
          <View style={[styly.barevnyHeader, { backgroundColor: '#059669' }]}>
            <Text style={styly.headerText}>{textZaznamu}</Text>
          </View>
          <View style={styly.obsah}>
            <Ionicons name="bar-chart" size={22} color="#059669" />
            <Text style={styly.statistikaCislo}>{pocetZaznamu}</Text>
          </View>
        </View>
      </View>
      

    </View>
  );
};

const styly = StyleSheet.create({
  sekce: {
    marginBottom: 16,
  },
  statistikyGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statistikaKarta: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1.2,
  },
  barevnyHeader: {
    paddingHorizontal: 8,
    paddingVertical: 5, // Sníženo z 8 na 5 pro nižší hlavičku
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 32, // Sníženo o 1/3 z 48 na 32
  },
  headerText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    lineHeight: 16,
  },
  obsah: {
    padding: 8,
    alignItems: 'center',
    gap: 4,
  },
  statistikaCislo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 0,
    marginBottom: 0,
    lineHeight: 20,
  },
  trendKontejner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
  },
  podstatistika: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
}); 