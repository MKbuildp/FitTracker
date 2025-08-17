import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Svg, Circle } from 'react-native-svg';
import { DenniData } from '../../Prehled/types/types';
import { formatujDenTydne, jeDnes, jeStejenDen } from '../../Prehled/utils/datumUtils';
import { getDnyMesice } from '../utils/kalendarUtils';

interface KalendarMesicProps {
  vybranyDatum: Date;
  onDatumZmena: (datum: Date) => void;
  data: DenniData[];
}

/**
 * Komponenta pro zobrazení měsíčního kalendáře s kruhovými progress bary
 */
export const KalendarMesic: React.FC<KalendarMesicProps> = ({
  vybranyDatum,
  onDatumZmena,
  data
}) => {
  // Konstanty pro layout
  const { width: screenWidth } = Dimensions.get('window');
  const PADDING_HORIZONTAL = 16;
  const dostupnaSirka = screenWidth - (PADDING_HORIZONTAL * 2);
  const denSirka = dostupnaSirka / 7;

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

  // Získání všech dnů pro zobrazení v kalendáři
  const dnyMesice = getDnyMesice(vybranyDatum);
  
  // Rozdělení dnů do řádků po 7 dnech
  const radky: (Date | null)[][] = [];
  for (let i = 0; i < dnyMesice.length; i += 7) {
    radky.push(dnyMesice.slice(i, Math.min(i + 7, dnyMesice.length)));
  }
  
  // Pokud poslední řádek není plný, doplníme ho prázdnými místy
  const posledniRadek = radky[radky.length - 1];
  if (posledniRadek && posledniRadek.length < 7) {
    const pocetPrazdnych = 7 - posledniRadek.length;
    for (let i = 0; i < pocetPrazdnych; i++) {
      posledniRadek.push(null);
    }
  }

  return (
    <View style={styles.container}>
      {/* Hlavička se zkratkami dnů */}
      <View style={styles.hlavickaDny}>
        {['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'].map((den, index) => (
          <View key={index} style={styles.denKontejner}>
            <Text style={styles.denTydneText}>{den}</Text>
          </View>
        ))}
      </View>

      {/* Mřížka kalendáře */}
      <View style={styles.kalendar}>
        {radky.map((radek, radekIndex) => (
          <View key={radekIndex} style={styles.radek}>
            {radek.map((den, denIndex) => (
              <View 
                key={denIndex} 
                style={[
                  styles.denKontejner,
                  !den && styles.prazdnyDen
                ]}
              >
                {den && (
                  <>
                    {renderKruh(data.find(d => jeStejenDen(d.datum, den)) || {
                      datum: den,
                      splneneCile: 0,
                      celkoveCile: 0,
                      dokoncenaCviceni: 0,
                      celkovaOpakovani: 0
                    })}
                    <Text style={[
                      styles.cisloText,
                      jeDnes(den) && styles.dnesText
                    ]}>
                      {den.getDate()}
                    </Text>
                  </>
                )}
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
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
  kalendar: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  radek: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 8,
  },
  denKontejner: {
    alignItems: 'center',
    width: Dimensions.get('window').width / 7 - 32/7,
    paddingVertical: 4,
  },
  prazdnyDen: {
    backgroundColor: 'transparent',
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
