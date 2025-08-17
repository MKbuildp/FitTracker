import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DenniData } from '../../Prehled/types/types';
import { useTranslation } from '../../../hooks/useTranslation';

interface MesicniStatistikyProps {
  data: DenniData[];
}

/** Komponenta pro zobrazení měsíčních statistik */
export const MesicniStatistiky: React.FC<MesicniStatistikyProps> = ({ data }) => {
  const { t } = useTranslation();

  // Výpočet měsíčních statistik
  const mesicniStatistiky = React.useMemo(() => {
    const splneneCile = data.reduce((sum, den) => sum + den.splneneCile, 0);
    const celkoveCile = data.reduce((sum, den) => sum + den.celkoveCile, 0);
    const procentaCilu = celkoveCile > 0 ? Math.round((splneneCile / celkoveCile) * 100) : 0;

    const dokoncenaCviceni = data.reduce((sum, den) => sum + den.dokoncenaCviceni, 0);
    const celkovaOpakovani = data.reduce((sum, den) => sum + den.celkovaOpakovani, 0);

    return {
      splneneCile,
      celkoveCile,
      procentaCilu,
      dokoncenaCviceni,
      celkovaOpakovani,
    };
  }, [data]);

  return (
    <View style={styles.kontejner}>
      <Text style={styles.nadpis}>{t('period.monthlyStats')}</Text>
      
      <View style={styles.statistiky}>
        {/* Denní cíle */}
        <View style={styles.statistika}>
          <View style={styles.statistikaHeader}>
            <View style={[styles.ikonaKontejner, { backgroundColor: '#10b981' }]}>
              <Ionicons name="trophy" size={20} color="white" />
            </View>
            <Text style={styles.statistikaNadpis}>{t('overview.dailyGoals')}</Text>
          </View>
          <View style={styles.statistikaObsah}>
            <Text style={styles.statistikaHodnota}>
              {mesicniStatistiky.splneneCile}/{mesicniStatistiky.celkoveCile}
            </Text>
            <Text style={[styles.statistikaProcenta, { color: '#10b981' }]}>
              {mesicniStatistiky.procentaCilu}%
            </Text>
          </View>
        </View>

        {/* Celkem opakování */}
        <View style={styles.statistika}>
          <View style={styles.statistikaHeader}>
            <View style={[styles.ikonaKontejner, { backgroundColor: '#dc2626' }]}>
              <Ionicons name="repeat" size={20} color="white" />
            </View>
            <Text style={styles.statistikaNadpis}>{t('overview.totalRepetitions')}</Text>
          </View>
          <View style={styles.statistikaObsah}>
            <Text style={styles.statistikaHodnota}>
              {mesicniStatistiky.celkovaOpakovani}
            </Text>
          </View>
        </View>

        {/* Dokončená cvičení */}
        <View style={styles.statistika}>
          <View style={styles.statistikaHeader}>
            <View style={[styles.ikonaKontejner, { backgroundColor: '#3b82f6' }]}>
              <Ionicons name="checkmark-circle" size={20} color="white" />
            </View>
            <Text style={styles.statistikaNadpis}>{t('overview.completedExercises')}</Text>
          </View>
          <View style={styles.statistikaObsah}>
            <Text style={styles.statistikaHodnota}>
              {mesicniStatistiky.dokoncenaCviceni}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  kontejner: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  nadpis: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  statistiky: {
    gap: 16,
  },
  statistika: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
  },
  statistikaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  ikonaKontejner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statistikaNadpis: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4b5563',
    flex: 1,
  },
  statistikaObsah: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  statistikaHodnota: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statistikaProcenta: {
    fontSize: 16,
    fontWeight: '600',
  },
});
