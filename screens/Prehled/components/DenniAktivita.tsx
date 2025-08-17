import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Svg, Circle } from 'react-native-svg';
import { DenniData } from '../types/types';
import { useTranslation } from '../../../hooks/useTranslation';

interface DenniAktivitaProps {
  data: DenniData;
}

/** Komponenta pro zobrazení denní aktivity s trojitým kruhovým progress barem */
export const DenniAktivita: React.FC<DenniAktivitaProps> = ({ data }) => {
  const { t } = useTranslation();

  // Velikost SVG
  const size = 100;
  const strokeWidth = 6;
  const center = size / 2;

      // Poloměry pro jednotlivé kruhy s mezerami
    const gap = 1; // 1px mezera mezi kruhy
    const radius3 = (size - strokeWidth) / 2;                    // Vnější kruh
    const radius2 = radius3 - strokeWidth - gap;                 // Prostřední kruh
    const radius1 = radius2 - strokeWidth - gap;                 // Vnitřní kruh

  // Výpočet procent pro každou metriku
  const procentaCilu = data.celkoveCile > 0
    ? Math.min(100, (data.splneneCile / data.celkoveCile) * 100)
    : 0;

  const procentaCviceni = data.celkoveCile > 0
    ? Math.min(100, (data.dokoncenaCviceni / data.celkoveCile) * 100)
    : 0;

  const procentaOpakovani = data.celkoveCile > 0
    ? Math.min(100, (data.celkovaOpakovani / (data.celkoveCile * 10)) * 100)
    : 0;

  // Výpočet délky oblouku pro každý kruh
  const circumference = (radius: number) => 2 * Math.PI * radius;
  const getStrokeDasharray = (radius: number, procenta: number) => {
    const obvod = circumference(radius);
    const delkaOblouku = (obvod * procenta) / 100;
    return `${delkaOblouku} ${obvod}`;
  };

  return (
    <View style={styly.kontejner}>
      <View style={styly.obsahKontejner}>
        {/* Progress bar vlevo */}
        <View style={styly.kruhKontejner}>
          <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {/* Pozadí kruhů */}
            <Circle
              cx={center}
              cy={center}
              r={radius1}
              stroke="#e2e8f0"
              strokeWidth={strokeWidth}
              fill="none"
            />
            <Circle
              cx={center}
              cy={center}
              r={radius2}
              stroke="#e2e8f0"
              strokeWidth={strokeWidth}
              fill="none"
            />
            <Circle
              cx={center}
              cy={center}
              r={radius3}
              stroke="#e2e8f0"
              strokeWidth={strokeWidth}
              fill="none"
            />

            {/* Progress kruhy */}
            <Circle
              cx={center}
              cy={center}
              r={radius1}
              stroke="#3b82f6"  // Modrá - Dokončená cvičení
              strokeWidth={strokeWidth}
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
              strokeWidth={strokeWidth}
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
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={getStrokeDasharray(radius3, procentaCilu)}
              transform={`rotate(-90 ${center} ${center})`}
              strokeLinecap="round"
            />
          </Svg>
        </View>

        {/* Metriky napravo */}
        <View style={styly.metriky}>
          <View style={styly.metrika}>
            <View style={styly.metrikaRadek}>
              <View style={[styly.metrikaTecka, { backgroundColor: '#10b981' }]} />
              <Text style={styly.metrikaPopisek}>{t('overview.dailyGoals')}</Text>
              <Text style={[styly.metrikaHodnota, { color: '#10b981' }]}>
                {data.splneneCile}/{data.celkoveCile}
              </Text>
            </View>
          </View>

          <View style={styly.metrika}>
            <View style={styly.metrikaRadek}>
              <View style={[styly.metrikaTecka, { backgroundColor: '#dc2626' }]} />
              <Text style={styly.metrikaPopisek}>{t('overview.totalRepetitions')}</Text>
              <Text style={[styly.metrikaHodnota, { color: '#dc2626' }]}>
                {data.celkovaOpakovani}
              </Text>
            </View>
          </View>

          <View style={styly.metrika}>
            <View style={styly.metrikaRadek}>
              <View style={[styly.metrikaTecka, { backgroundColor: '#3b82f6' }]} />
              <Text style={styly.metrikaPopisek}>{t('overview.completedExercises')}</Text>
              <Text style={[styly.metrikaHodnota, { color: '#3b82f6' }]}>
                {data.dokoncenaCviceni}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styly = StyleSheet.create({
  kontejner: {
    backgroundColor: 'white',
    padding: 12,
    width: '95%',
    alignSelf: 'center',
  },
  obsahKontejner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  kruhKontejner: {
    marginRight: 12,
  },
  metriky: {
    flex: 1,
    gap: 10,
  },
  metrika: {
    justifyContent: 'center',
  },
  metrikaRadek: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metrikaTecka: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  metrikaHodnota: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 'auto',
  },
  metrikaPopisek: {
    fontSize: 14,
    color: '#1f2937',
    flex: 1,
  },
});