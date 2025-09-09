import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DenniData } from '../types/types';
import { useTranslation } from '../../../hooks/useTranslation';
import { responsiveComponents, responsiveTypography, responsiveSpacingValues } from '../../../src/styles/theme';

interface DenniMetrikyProps {
  data: DenniData;
}

/** Komponenta pro zobrazení denních metrik */
export const DenniMetriky: React.FC<DenniMetrikyProps> = ({ data }) => {
  const { t } = useTranslation();

  // Výpočet procenta splněných cílů
  const procentaCilu = data.celkoveCile > 0
    ? Math.round((data.splneneCile / data.celkoveCile) * 100)
    : 0;

  return (
    <View style={styly.kontejner}>
      {/* Plnění denních cílů */}
      <View style={styly.metrika}>
        <View style={styly.metrikaHeader}>
          <Ionicons name="trophy" size={20} color="#7c3aed" />
          <Text style={styly.metrikaNadpis}>{t('overview.dailyGoals')}</Text>
        </View>
        <View style={styly.metrikaObsah}>
          <Text style={styly.metrikaHodnota}>
            {data.splneneCile}/{data.celkoveCile}
          </Text>
          <Text style={[
            styly.metrikaProcenta,
            { color: procentaCilu >= 100 ? '#059669' : '#7c3aed' }
          ]}>
            {procentaCilu}%
          </Text>
        </View>
      </View>

      {/* Dokončená cvičení */}
      <View style={styly.metrika}>
        <View style={styly.metrikaHeader}>
          <Ionicons name="checkmark-circle" size={20} color="#2563eb" />
          <Text style={styly.metrikaNadpis}>{t('overview.completedExercises')}</Text>
        </View>
        <View style={styly.metrikaObsah}>
          <Text style={styly.metrikaHodnota}>{data.dokoncenaCviceni}</Text>
        </View>
      </View>

      {/* Celkový počet opakování */}
      <View style={styly.metrika}>
        <View style={styly.metrikaHeader}>
          <Ionicons name="repeat" size={20} color="#dc2626" />
          <Text style={styly.metrikaNadpis}>{t('overview.totalRepetitions')}</Text>
        </View>
        <View style={styly.metrikaObsah}>
          <Text style={styly.metrikaHodnota}>{data.celkovaOpakovani}</Text>
        </View>
      </View>
    </View>
  );
};

const styly = StyleSheet.create({
  kontejner: {
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  metrika: {
    backgroundColor: 'white',
    borderRadius: responsiveComponents.cardBorderRadius,
    padding: responsiveSpacingValues.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  metrikaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveSpacingValues.sm,
    marginBottom: responsiveSpacingValues.sm,
  },
  metrikaNadpis: {
    fontSize: responsiveTypography.caption.fontSize,
    fontWeight: '600',
    color: '#4b5563',
  },
  metrikaObsah: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  metrikaHodnota: {
    fontSize: responsiveTypography.title.fontSize,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  metrikaProcenta: {
    fontSize: responsiveTypography.body.fontSize,
    fontWeight: '600',
  },
});
