import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../../../../hooks/useTranslation';
import { responsiveComponents, responsiveTypography, responsiveSpacingValues, responsiveFontSize } from '../../../../src/styles/theme';

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
  const { currentLanguage } = useTranslation();
  
  // Formátování data pro zobrazení s dynamickým lokálem
  const formatujDatum = (datum: Date): string => {
    const lokalId = currentLanguage === 'cs' ? 'cs-CZ' : 'en-US';
    return datum.toLocaleDateString(lokalId, {
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
          <Ionicons name="chevron-back" size={28} color="#1f2937" />
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
            size={28} 
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
    paddingVertical: responsiveSpacingValues.sm,  // Zmenšeno z 12 na 8
    paddingHorizontal: responsiveSpacingValues.md,
  },
  navigace: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 38,  // Zvětšeno z 32 na 38 (cca 19% nárůst)
  },
  tlacitko: {
    padding: responsiveSpacingValues.xs,  // Zmenšeno z 8 na 4
    borderRadius: responsiveSpacingValues.sm,
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
    fontSize: responsiveFontSize(21), // Zvětšeno o 15% z původních 18 (18 * 1.15 = 20.7 ≈ 21)
    fontWeight: '600',
    color: '#1f2937',
  },
});