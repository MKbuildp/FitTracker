import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Svg, Circle } from 'react-native-svg';
import { KruhovyUkazatelPokrokuProps } from '../types/types';
import { jeDnes } from '../utils/helpers';

/** Kruhový ukazatel pokroku pro denní cíl cvičení */
export const KruhovyUkazatelPokroku: React.FC<KruhovyUkazatelPokrokuProps> = ({ cviceni, zaznamy }) => {
  if (!cviceni.maNastavenCil || cviceni.denniCil === 0) {
    return <Ionicons name="chevron-forward" size={24} color="#9ca3af" />;
  }
  
  const velikost = 52;
  const sirkaCary = 5;
  const polomer = (velikost - sirkaCary) / 2;
  const obvod = 2 * Math.PI * polomer;

  const dnesniVykon = useMemo(() => {
    return zaznamy
      .filter(z => z.cviceniId === cviceni.id && jeDnes(new Date(z.datumCas)))
      .reduce((soucet: number, z) => soucet + z.hodnota, 0);
  }, [zaznamy, cviceni.id]);

  const procenta = Math.round((dnesniVykon / cviceni.denniCil) * 100);
  const pokrokProKruh = Math.min(procenta, 100); // Pro vizualizaci max 100%
  const delkaCary = obvod * (pokrokProKruh / 100);
  const barvaKruhu = procenta >= 100 ? '#059669' : (cviceni.barva || '#2563eb');

  return (
    <View style={{ width: velikost, height: velikost, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={velikost} height={velikost} viewBox={`0 0 ${velikost} ${velikost}`}>
        <Circle
          cx={velikost / 2}
          cy={velikost / 2}
          r={polomer}
          stroke="#e5e7eb"
          strokeWidth={sirkaCary}
          fill="transparent"
        />
        <Circle
          cx={velikost / 2}
          cy={velikost / 2}
          r={polomer}
          stroke={barvaKruhu}
          strokeWidth={sirkaCary}
          fill="transparent"
          strokeDasharray={obvod}
          strokeDashoffset={obvod - delkaCary}
          strokeLinecap="round"
          transform={`rotate(-90 ${velikost / 2} ${velikost / 2})`}
        />
      </Svg>
      <Text style={[{ position: 'absolute', fontSize: 12, fontWeight: '800' }, { color: barvaKruhu }]}>
        {procenta}%
      </Text>
    </View>
  );
}; 