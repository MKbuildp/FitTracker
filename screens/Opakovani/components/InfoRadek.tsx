import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { InfoRadekProps } from '../types/types';
import { jeDnes, formatovatHodnotu } from '../utils/helpers';
import { useTranslation } from '../../../hooks/useTranslation';
import { responsiveTypography } from '../../../src/styles/theme';

/** Komponenta pro zobrazení denní statistiky a cíle cvičení */
export const InfoRadek: React.FC<InfoRadekProps> = ({ cviceni, zaznamy }) => {
  const { t } = useTranslation();
  
  const dnesniVykon = useMemo(() => {
    return zaznamy
      .filter(z => z.cviceniId === cviceni.id && jeDnes(new Date(z.datumCas)))
      .reduce((soucet: number, z) => soucet + z.hodnota, 0);
  }, [zaznamy, cviceni.id]);

  const popisekStatistiky = cviceni.typMereni === 'cas' ? t('stats.topTime') : t('stats.total');

  return (
    <View style={styly.infoRadek}>
      <Text style={styly.statistikaText}>
        {popisekStatistiky}: <Text style={styly.statistikaHodnota}>{formatovatHodnotu(dnesniVykon, cviceni.typMereni)}</Text>
      </Text>
      {cviceni.maNastavenCil && (
        <Text style={styly.cilText}>
          {t('stats.goal')}: <Text style={styly.cilHodnota}>{formatovatHodnotu(cviceni.denniCil, cviceni.typMereni)}</Text>
        </Text>
      )}
    </View>
  );
};

const styly = StyleSheet.create({
  infoRadek: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statistikaText: {
    fontSize: responsiveTypography.caption.fontSize * 1.15, // Zvětšeno o 15% (14px → 16px)
    color: '#6b7280',
  },
  statistikaHodnota: {
    fontSize: responsiveTypography.caption.fontSize * 1.15, // Zvětšeno o 15% (14px → 16px)
    fontWeight: 'bold',
    color: '#1e40af', 
  },
  cilText: {
    fontSize: responsiveTypography.caption.fontSize * 1.15, // Zvětšeno o 15% (14px → 16px)
    color: '#6b7280',
  },
  cilHodnota: {
    fontSize: responsiveTypography.caption.fontSize * 1.15, // Zvětšeno o 15% (14px → 16px)
    fontWeight: 'bold',
    color: '#1e40af',
  },
}); 