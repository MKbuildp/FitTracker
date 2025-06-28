import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useObdobniContext } from '../context/ObdobniContext';
import { useTranslation } from '../hooks/useTranslation';

/** Props pro ObdobniSelektor komponentu */
interface ObdobniSelektorProps {
  borderColor?: string;
}

/** Komponenta pro výběr měsíce - kompaktní moderní design */
export const ObdobniSelektor: React.FC<ObdobniSelektorProps> = ({ borderColor = '#2563eb' }) => {
  const { globalniObdobi, navigovatObdobi } = useObdobniContext();
  const { t } = useTranslation();

  /** Formátování názvu měsíce */
  const formatovatMesic = (): string => {
    const datum = globalniObdobi.datum;
    const mesic = datum.getMonth();
    const rok = datum.getFullYear();
    const nazevMesice = t(`months.${getNazevMesice(mesic)}` as any);
    return `${nazevMesice} ${rok}`;
  };

  /** Získání názvu měsíce pro translation klíč */
  const getNazevMesice = (mesic: number): string => {
    const nazvy = [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'
    ];
    return nazvy[mesic];
  };

  /** Kontrola, zda lze navigovat dopředu (zabránit budoucím měsícům) */
  const muzemeDopredu = (): boolean => {
    const dnes = new Date();
    const aktualni = globalniObdobi.datum;
    
    return aktualni.getFullYear() < dnes.getFullYear() || 
           (aktualni.getFullYear() === dnes.getFullYear() && aktualni.getMonth() < dnes.getMonth());
  };

  return (
    <View style={[styly.kontejner, { borderColor }]}>
      <View style={styly.navigaceKontejner}>
        <TouchableOpacity
          style={styly.navigaceTlacitko}
          onPress={() => navigovatObdobi('predchozi')}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={20} color="#6b7280" />
        </TouchableOpacity>

        <View style={styly.mesicKontejner}>
          <Text style={styly.mesicText}>{formatovatMesic()}</Text>
        </View>

        <TouchableOpacity
          style={[
            styly.navigaceTlacitko, 
            !muzemeDopredu() && styly.navigaceTlacitkoNeaktivni
          ]}
          onPress={() => muzemeDopredu() && navigovatObdobi('dalsi')}
          disabled={!muzemeDopredu()}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={muzemeDopredu() ? "#6b7280" : "#d1d5db"} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styly = StyleSheet.create({
  kontejner: {
    backgroundColor: '#f8fafc',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: '#2563eb', // Výchozí modrá barva
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  
  navigaceKontejner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  navigaceTlacitko: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  
  navigaceTlacitkoNeaktivni: {
    backgroundColor: '#f3f4f6',
    shadowOpacity: 0.05,
  },
  
  mesicKontejner: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  
  mesicText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    letterSpacing: -0.2,
  },
}); 