import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface KalendarHeaderProps {
  vybranyDatum: Date;
  onDatumZmena: (datum: Date) => void;
}

/**
 * Komponenta pro hlavičku měsíčního kalendáře
 */
export const KalendarHeader: React.FC<KalendarHeaderProps> = ({
  vybranyDatum,
  onDatumZmena
}) => {
  // Formátování data pro zobrazení
  const formatujDatum = (datum: Date): string => {
    const mesicRok = datum.toLocaleDateString('cs-CZ', {
      month: 'long',
      year: 'numeric'
    });
    // První písmeno měsíce velké
    return mesicRok.charAt(0).toUpperCase() + mesicRok.slice(1);
  };

  // Navigace na předchozí měsíc
  const predchoziMesic = () => {
    const novyDatum = new Date(vybranyDatum);
    novyDatum.setMonth(novyDatum.getMonth() - 1);
    onDatumZmena(novyDatum);
  };

  // Navigace na další měsíc
  const dalsiMesic = () => {
    const novyDatum = new Date(vybranyDatum);
    novyDatum.setMonth(novyDatum.getMonth() + 1);
    onDatumZmena(novyDatum);
  };

  // Kontrola, zda je další měsíc v budoucnosti
  const jeDalsiMesicVBudoucnosti = () => {
    const dnes = new Date();
    const dalsiMesic = new Date(vybranyDatum);
    dalsiMesic.setMonth(dalsiMesic.getMonth() + 1);
    
    // Porovnáváme měsíc a rok
    return dalsiMesic.getFullYear() > dnes.getFullYear() || 
           (dalsiMesic.getFullYear() === dnes.getFullYear() && dalsiMesic.getMonth() > dnes.getMonth());
  };

  return (
    <View style={styles.container}>
      <View style={styles.navigace}>
        <TouchableOpacity onPress={predchoziMesic} style={styles.tlacitko}>
          <Ionicons name="chevron-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        
        <View style={styles.datumKontejner}>
          <Text style={styles.datumText}>{formatujDatum(vybranyDatum)}</Text>
        </View>

        <TouchableOpacity 
          onPress={dalsiMesic} 
          style={[
            styles.tlacitko,
            jeDalsiMesicVBudoucnosti() && styles.tlacitkoDeaktivovane
          ]}
          disabled={jeDalsiMesicVBudoucnosti()}
        >
          <Ionicons 
            name="chevron-forward" 
            size={24} 
            color={jeDalsiMesicVBudoucnosti() ? "#9ca3af" : "#1f2937"} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  navigace: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tlacitko: {
    padding: 8,
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
