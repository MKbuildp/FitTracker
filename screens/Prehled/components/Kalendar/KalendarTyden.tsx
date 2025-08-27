import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Svg, Circle } from 'react-native-svg';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { DenniData } from '../../types/types';
import { formatujDenTydne, jeDnes, jeStejenDen } from '../../utils/datumUtils';
import { useTranslation } from '../../../../hooks/useTranslation';

interface KalendarTydenProps {
  vybranyDatum: Date;
  onDatumZmena: (datum: Date) => void;
  data: DenniData[];
}

/**
 * Komponenta pro zobrazení týdenního kalendáře s kruhovými progress bary
 */
export const KalendarTyden: React.FC<KalendarTydenProps> = ({
  vybranyDatum,
  onDatumZmena,
  data
}) => {
  const { t } = useTranslation();
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

  // Gesto pro přejetí doleva/doprava
  const swipeGesture = Gesture.Pan()
    .onEnd((event) => {
      if (Math.abs(event.velocityX) < 50) return; // Ignorovat pomalé pohyby
      
      const novyDatum = new Date(vybranyDatum);
      if (event.velocityX > 0) {
        // Swipe doprava - předchozí týden
        novyDatum.setDate(novyDatum.getDate() - 7);
        onDatumZmena(novyDatum);
      } else {
        // Swipe doleva - další týden
        const dalsiTyden = new Date(vybranyDatum);
        dalsiTyden.setDate(dalsiTyden.getDate() + 7);
        
        // Kontrola, zda není další týden v budoucnosti
        const dnes = new Date();
        dnes.setHours(0, 0, 0, 0);
        dalsiTyden.setHours(0, 0, 0, 0);
        
        if (dalsiTyden <= dnes) {
          onDatumZmena(dalsiTyden);
        }
      }
    });

  // Funkce pro vykreslení kruhového progress baru
  const renderKruh = (denniData: DenniData) => {
    const maxVelikost = Math.min(denSirka - 8, 40);
    const velikost = maxVelikost * 0.95;
    const sirkaCary = 3;
    const center = velikost / 2;

    // Poloměry pro jednotlivé kruhy s mezerami
    const gap = 1; // 1px mezera mezi kruhy
    const radius3 = (velikost - sirkaCary) / 2;                  // Vnější kruh
    const radius2 = radius3 - sirkaCary - gap;                   // Prostřední kruh
    const radius1 = radius2 - sirkaCary - gap;                   // Vnitřní kruh

    // Výpočet procent pro každou metriku
    const procentaCilu = denniData.celkoveCile > 0
      ? Math.min(100, (denniData.splneneCile / denniData.celkoveCile) * 100)
      : 0;

    const procentaCviceni = denniData.celkoveCile > 0
      ? Math.min(100, (denniData.dokoncenaCviceni / denniData.celkoveCile) * 100)
      : 0;

    const procentaOpakovani = denniData.celkoveCile > 0
      ? Math.min(100, (denniData.celkovaOpakovani / (denniData.celkoveCile * 10)) * 100)
      : 0;

    // Výpočet délky oblouku pro každý kruh
    const getStrokeDasharray = (radius: number, procenta: number) => {
      const obvod = 2 * Math.PI * radius;
      const delkaOblouku = (obvod * procenta) / 100;
      return `${delkaOblouku} ${obvod}`;
    };
    
    return (
      <View style={styles.kruhKontejner}>
        <Svg width={velikost} height={velikost} viewBox={`0 0 ${velikost} ${velikost}`}>
          {/* Pozadí kruhů */}
          <Circle
            cx={center}
            cy={center}
            r={radius1}
            stroke="#e2e8f0"
            strokeWidth={sirkaCary}
            fill="none"
          />
          <Circle
            cx={center}
            cy={center}
            r={radius2}
            stroke="#e2e8f0"
            strokeWidth={sirkaCary}
            fill="none"
          />
          <Circle
            cx={center}
            cy={center}
            r={radius3}
            stroke="#e2e8f0"
            strokeWidth={sirkaCary}
            fill="none"
          />

          {/* Progress kruhy */}
          <Circle
            cx={center}
            cy={center}
            r={radius1}
            stroke="#3b82f6"  // Modrá - Dokončená cvičení
            strokeWidth={sirkaCary}
            fill="none"
            strokeDasharray={getStrokeDasharray(radius1, procentaCviceni)}
            transform={`rotate(-90 ${center} ${center})`}
            strokeLinecap="round"
          />
          <Circle
            cx={center}
            cy={center}
            r={radius2}
            stroke="#dc2626"  // Červená - Celkem opakování
            strokeWidth={sirkaCary}
            fill="none"
            strokeDasharray={getStrokeDasharray(radius2, procentaOpakovani)}
            transform={`rotate(-90 ${center} ${center})`}
            strokeLinecap="round"
          />
          <Circle
            cx={center}
            cy={center}
            r={radius3}
            stroke="#10b981"  // Zelená - Denní cíle
            strokeWidth={sirkaCary}
            fill="none"
            strokeDasharray={getStrokeDasharray(radius3, procentaCilu)}
            transform={`rotate(-90 ${center} ${center})`}
            strokeLinecap="round"
          />
        </Svg>
      </View>
    );
  };

  // Konstanty pro layout
  const { width: screenWidth } = Dimensions.get('window');
  const PADDING_HORIZONTAL = 16;
  const dostupnaSirka = screenWidth - (PADDING_HORIZONTAL * 2);
  const denSirka = dostupnaSirka / 7;

  return (
    <GestureDetector gesture={swipeGesture}>
      <View style={styles.container}>
        {/* Hlavička se zkratkami dnů */}
        <View style={styles.hlavickaDny}>
          {[
            t('days.short.mon'), 
            t('days.short.tue'), 
            t('days.short.wed'), 
            t('days.short.thu'), 
            t('days.short.fri'), 
            t('days.short.sat'), 
            t('days.short.sun')
          ].map((den, index) => (
            <View key={index} style={styles.denKontejner}>
              <Text style={styles.denTydneText}>{den}</Text>
            </View>
          ))}
        </View>

        {/* Dny týdne */}
        <View style={styles.tyden}>
          {data.map((denniData, index) => (
            <TouchableOpacity 
              key={index} 
              style={[
                styles.denKontejner,
                jeStejenDen(denniData.datum, vybranyDatum) && styles.vybranyDen
              ]}
              onPress={() => onDatumZmena(denniData.datum)}
              activeOpacity={0.7}
            >
              {renderKruh(denniData)}
              <Text style={[
                styles.cisloText,
                jeDnes(denniData.datum) && styles.dnesText
              ]}>
                {denniData.datum.getDate()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: '100%',
  },
  hlavickaDny: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tyden: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  denKontejner: {
    alignItems: 'center',
    width: Dimensions.get('window').width / 7 - 32/7,
    paddingVertical: 4,
    borderRadius: 8,
  },
  vybranyDen: {
    backgroundColor: '#f1f5f9',
  },
  denTydneText: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '500',
  },
  cisloText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 4,
  },
  dnesText: {
    color: '#2563eb',
  },
  kruhKontejner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});