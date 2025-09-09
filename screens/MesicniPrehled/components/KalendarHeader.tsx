import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../../../hooks/useTranslation';
import { responsiveTypography, responsiveSpacingValues, responsiveFontSize } from '../../../src/styles/theme';

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
  const { t } = useTranslation();
  
  // Formátování data pro zobrazení s překlady
  const formatujDatum = (datum: Date): string => {
    const mesic = datum.getMonth();
    const rok = datum.getFullYear();
    
    // Mapování čísel měsíců na překladové klíče
    const mesiceKlice = [
      'months.january', 'months.february', 'months.march', 'months.april',
      'months.may', 'months.june', 'months.july', 'months.august',
      'months.september', 'months.october', 'months.november', 'months.december'
    ];
    
    const nazevMesice = t(mesiceKlice[mesic]);
    return `${nazevMesice} ${rok}`;
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
          <Ionicons name="chevron-back" size={28} color="#1f2937" />
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
            size={28} 
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
    paddingVertical: responsiveSpacingValues.sm,  // Převedeno na responzivní hodnoty
    paddingHorizontal: responsiveSpacingValues.md,
  },
  navigace: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 38,  // Zvětšeno pro lepší proporce s větším fontem a ikonami
  },
  tlacitko: {
    padding: responsiveSpacingValues.sm,
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
