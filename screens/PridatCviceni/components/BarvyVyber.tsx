import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../../../hooks/useTranslation';

/** Paleta 21 dobře rozlišitelných barev */
const PALETA_BAREV_VYBER = [
  // První řádek - základní barvy
  '#ef4444', // Červená
  '#f97316', // Oranžová
  '#eab308', // Žlutá
  '#22c55e', // Zelená
  '#10b981', // Smaragdová
  '#06b6d4', // Azurová
  '#3b82f6', // Modrá
  // Druhý řádek - fialové a růžové odstíny
  '#6366f1', // Indigo
  '#8b5cf6', // Fialová
  '#a855f7', // Purpurová
  '#ec4899', // Růžová
  '#f43f5e', // Rose
  '#84cc16', // Lime
  '#14b8a6', // Teal
  // Třetí řádek - neutrální a speciální barvy
  '#78716c', // Hnědá
  '#6b7280', // Šedá
  '#374151', // Tmavě šedá
  '#1f2937', // Grafitová
  '#7c2d12', // Hnědočervená
  '#166534', // Tmavě zelená
  '#581c87', // Tmavě fialová
];

interface BarvyVyberProps {
  vybranaBarva: string | null;
  onVybratBarvu: (barva: string) => void;
  nazev?: string;
  popis?: string;
}

/** Komponenta pro výběr barvy cvičení */
const BarvyVyber: React.FC<BarvyVyberProps> = ({
  vybranaBarva,
  onVybratBarvu,
  nazev,
  popis
}) => {
  const { t } = useTranslation();
  const defaultNazev = nazev === undefined ? undefined : (nazev || t('addExercise.color'));

  return (
    <View style={styly.sekce}>
      {defaultNazev && (
        <View style={styly.nadpisKontejner}>
          <Ionicons name="color-palette-outline" size={20} color="#6b7280" />
          <Text style={styly.popisek}>{defaultNazev}</Text>
        </View>
      )}
      
      <View style={styly.barvyKontejner}>
        {/* První řádek - prvních 7 barev */}
        <View style={styly.barvyRadek}>
          {PALETA_BAREV_VYBER.slice(0, 7).map((barva) => (
            <TouchableOpacity
              key={barva}
              style={[styly.barvaPolozka, { backgroundColor: barva }]}
              onPress={() => onVybratBarvu(barva)}
            >
              {vybranaBarva === barva && (
                <Ionicons name="checkmark-circle" size={18} color="white" />
              )}
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Druhý řádek - dalších 7 barev */}
        <View style={styly.barvyRadek}>
          {PALETA_BAREV_VYBER.slice(7, 14).map((barva) => (
            <TouchableOpacity
              key={barva}
              style={[styly.barvaPolozka, { backgroundColor: barva }]}
              onPress={() => onVybratBarvu(barva)}
            >
              {vybranaBarva === barva && (
                <Ionicons name="checkmark-circle" size={18} color="white" />
              )}
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Třetí řádek - posledních 7 barev */}
        <View style={styly.barvyRadek}>
          {PALETA_BAREV_VYBER.slice(14, 21).map((barva) => (
            <TouchableOpacity
              key={barva}
              style={[styly.barvaPolozka, { backgroundColor: barva }]}
              onPress={() => onVybratBarvu(barva)}
            >
              {vybranaBarva === barva && (
                <Ionicons name="checkmark-circle" size={18} color="white" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styly = StyleSheet.create({
  sekce: {
    marginBottom: 24,
  },
  nadpisKontejner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    gap: 8,
  },
  popisek: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  pomocnyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  
  // Barvy
  barvyKontejner: {
    alignItems: 'center',
    gap: 12,
  },
  barvyRadek: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  barvaPolozka: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    maxWidth: 40,
  },
});

export default BarvyVyber; 