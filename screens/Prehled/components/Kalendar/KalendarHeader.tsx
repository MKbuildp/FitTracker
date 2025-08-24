import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface KalendarHeaderProps {
  vybranyDatum: Date;
  onDatumZmena: (datum: Date) => void;
}

/**
 * Komponenta pro hlavičku kalendáře s navigací mezi daty
 */
export const KalendarHeader: React.FC<KalendarHeaderProps> = ({
  vybranyDatum,
  onDatumZmena
}) => {
  // Formátování data pro zobrazení
  const formatujDatum = (datum: Date): string => {
    return datum.toLocaleDateString('cs-CZ', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Navigace na předchozí týden
  const predchoziTyden = () => {
    const novyDatum = new Date(vybranyDatum);
    novyDatum.setDate(novyDatum.getDate() - 7);
    onDatumZmena(novyDatum);
  };

  // Navigace na další týden
  const dalsiTyden = () => {
    const novyDatum = new Date(vybranyDatum);
    novyDatum.setDate(novyDatum.getDate() + 7);
    onDatumZmena(novyDatum);
  };

  // Kontrola, zda je další týden v budoucnosti
  const jeDalsiTydenVBudoucnosti = () => {
    const dnes = new Date();
    const dalsiTydenStart = new Date(vybranyDatum);
    dalsiTydenStart.setDate(dalsiTydenStart.getDate() + 7);
    
    // Nastavíme čas na začátek dne pro správné porovnání
    dnes.setHours(0, 0, 0, 0);
    dalsiTydenStart.setHours(0, 0, 0, 0);
    
    return dalsiTydenStart > dnes;
  };

  return (
    <View style={styles.container}>
      <View style={styles.navigace}>
        <TouchableOpacity onPress={predchoziTyden} style={styles.tlacitko}>
          <Ionicons name="chevron-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        
        <View style={styles.datumKontejner}>
          <Text style={styles.datumText}>{formatujDatum(vybranyDatum)}</Text>
        </View>

        <TouchableOpacity 
          onPress={dalsiTyden} 
          style={[
            styles.tlacitko,
            jeDalsiTydenVBudoucnosti() && styles.tlacitkoDeaktivovane
          ]}
          disabled={jeDalsiTydenVBudoucnosti()}
        >
          <Ionicons 
            name="chevron-forward" 
            size={24} 
            color={jeDalsiTydenVBudoucnosti() ? "#9ca3af" : "#1f2937"} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingVertical: 8,  // Zmenšeno z 12 na 8
    paddingHorizontal: 16,
  },
  navigace: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 32,  // Pevná výška pro konzistentní velikost
  },
  tlacitko: {
    padding: 4,  // Zmenšeno z 8 na 4
    borderRadius: 8,
  },
  tlacitkoDeaktivovane: {
    opacity: 0.5,
    backgroundColor: '#f9fafb',
  },
  datumKontejner: {
    flex: 1,
    alignItems: 'center',
  },
  datumText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
});