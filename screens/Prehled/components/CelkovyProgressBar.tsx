import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../../../hooks/useTranslation';
import { CelkovyProgressBarProps } from '../types/types';
import { vypocitatCelkovyProgress } from '../utils/helpers';
import { responsiveComponents, responsiveTypography, responsiveSpacingValues, responsiveSize } from '../../../src/styles/theme';

/** Komponenta pro zobrazení celkového progressu všech cílů */
export const CelkovyProgressBar: React.FC<CelkovyProgressBarProps> = ({ zaznamy, cviceni }) => {
  const { t } = useTranslation();
  const { splneneCile, celkemCilu, celkoveProcenta, detaily } = vypocitatCelkovyProgress(zaznamy, cviceni);

  // Pokud nejsou nastavené žádné cíle, nezobrazujeme komponentu
  if (celkemCilu === 0) {
    return null;
  }

  // Určení barvy podle procent
  const getBarvaProgressu = (procenta: number) => {
    if (procenta >= 100) return '#10b981'; // Zelená - splněno
    if (procenta >= 75) return '#f59e0b';  // Oranžová - blízko cíle
    if (procenta >= 50) return '#3b82f6';  // Modrá - na dobré cestě
    return '#ef4444'; // Červená - daleko od cíle
  };

  const barvaProgressu = getBarvaProgressu(celkoveProcenta);
  
  // Barva ikony hodin - tyrkysová
  const barvaHodin = '#06b6d4'; // Tyrkysová barva

  /** Vícebarevný pohár komponenta */
  const VicebarevnyPohar = () => (
    <View style={styly.poharKontejner}>
      {/* Základní zlatý pohár */}
      <Ionicons name="trophy" size={23} color="#fbbf24" style={styly.poharZaklad} />
      {/* Bronzový okraj místo šedého */}
      <Ionicons name="trophy-outline" size={23} color="#cd7f32" style={styly.poharOkraj} />
      {/* Barevný akcent */}
      <View style={styly.poharAkcent}>
        <Ionicons name="star" size={8} color="#f59e0b" />
      </View>
    </View>
  );

  return (
    <View style={styly.kontejner}>
      {/* Hlavička s ikonou a názvem */}
      <View style={styly.hlavicka}>
        <View style={styly.hlavickaLeva}>
          <VicebarevnyPohar />
          <Text style={styly.nadpis}>{t('overview.dailyGoals')}</Text>
        </View>
        <View style={styly.hlavickaPrava}>
          <Text style={styly.pocetCilu}>{splneneCile}/{celkemCilu}</Text>
          <Ionicons 
            name={celkoveProcenta >= 100 ? "checkmark-circle" : "time"} 
            size={16} 
            color={barvaHodin} 
          />
        </View>
      </View>

      {/* Obsah s paddingem */}
      <View style={styly.obsah}>
        {/* Progress bar */}
        <View style={styly.progressKontejner}>
          <View style={styly.progressPozadi}>
            <View 
              style={[
                styly.progressVypln,
                { 
                  width: `${Math.min(celkoveProcenta, 100)}%`,
                  backgroundColor: barvaProgressu
                }
              ]} 
            />
            {/* Animovaný efekt pro splněné cíle */}
            {celkoveProcenta >= 100 && (
              <View style={[styly.progressBleskVypln, { backgroundColor: barvaProgressu }]} />
            )}
          </View>
          
          {/* Procenta */}
          <Text style={[styly.procentaText, { color: barvaProgressu }]}>
            {Math.round(celkoveProcenta)}%
          </Text>
        </View>

          {/* Detailní rozložení podle typu cvičení */}
          <View style={styly.detaily}>
            {detaily.opakovani.celkemCilu > 0 && (
              <View style={styly.detailPolozka}>
                <Ionicons name="repeat" size={16} color="#6366f1" />
                <Text style={styly.detailText}>
                  {t('nav.repetitions')}: {detaily.opakovani.splneno}/{detaily.opakovani.celkemCilu}
                </Text>
                <View style={styly.miniProgress}>
                  <View style={[styly.miniProgressPozadi]}>
                    <View 
                      style={[
                        styly.miniProgressVypln,
                        { 
                          width: `${Math.min(detaily.opakovani.procenta, 100)}%`,
                          backgroundColor: '#6366f1'
                        }
                      ]} 
                    />
                  </View>
                </View>
              </View>
            )}

            {detaily.cas.celkemCilu > 0 && (
              <View style={styly.detailPolozka}>
                <Ionicons name="timer" size={16} color="#10b981" />
                <Text style={styly.detailText}>
                  {t('nav.timers')}: {detaily.cas.splneno}/{detaily.cas.celkemCilu}
                </Text>
                <View style={styly.miniProgress}>
                  <View style={[styly.miniProgressPozadi]}>
                    <View 
                      style={[
                        styly.miniProgressVypln,
                        { 
                          width: `${Math.min(detaily.cas.procenta, 100)}%`,
                          backgroundColor: '#10b981'
                        }
                      ]} 
                    />
                  </View>
                </View>
              </View>
            )}
          </View>
      </View>
    </View>
  );
};

const styly = StyleSheet.create({
  kontejner: {
    backgroundColor: 'white',
    borderRadius: responsiveComponents.cardBorderRadius,
    marginBottom: responsiveSpacingValues.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 6,
    borderWidth: 1.2,
    borderColor: '#2563eb',
    overflow: 'hidden',
  },
  hlavicka: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e2e8f0',
    padding: responsiveSpacingValues.sm,
    borderTopLeftRadius: responsiveComponents.cardBorderRadius,
    borderTopRightRadius: responsiveComponents.cardBorderRadius,
    borderBottomWidth: 1.2,
    borderBottomColor: '#2563eb',
  },
  obsah: {
    paddingHorizontal: responsiveSpacingValues.md,
    paddingBottom: responsiveSpacingValues.md,
    paddingTop: responsiveSpacingValues.md,
  },
  hlavickaLeva: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveSpacingValues.sm,
  },
  hlavickaPrava: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  nadpis: {
    fontSize: responsiveTypography.subtitle.fontSize,
    fontWeight: '600',
    color: '#374151',
  },
  pocetCilu: {
    fontSize: responsiveTypography.body.fontSize,
    fontWeight: '600',
    color: '#6b7280',
  },
  progressKontejner: {
    marginBottom: responsiveSpacingValues.sm,
  },
  progressPozadi: {
    height: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
  },
  progressVypln: {
    height: '100%',
    borderRadius: 6,
    position: 'relative',
  },
  progressBleskVypln: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
    borderRadius: 6,
  },
  procentaText: {
    fontSize: responsiveTypography.caption.fontSize,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 6,
  },
  detaily: {
    gap: responsiveSpacingValues.sm,
  },
  detailPolozka: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveSpacingValues.sm,
  },
  detailText: {
    fontSize: responsiveTypography.body.fontSize - 1, // O něco menší než body
    color: '#6b7280',
    flex: 1,
    marginRight: responsiveSpacingValues.sm, // Přidána mezera mezi textem a progress barem
  },
  miniProgress: {
    width: responsiveSize(80), // Responzivní šířka
    minWidth: responsiveSize(80), // Zajistí minimální šířku
  },
  miniProgressPozadi: {
    height: 5, // Zvětšeno o 1px z 4 na 5
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    overflow: 'hidden',
  },
  miniProgressVypln: {
    height: '100%',
    borderRadius: 2,
  },
  poharKontejner: {
    position: 'relative',
    width: responsiveSize(23),
    height: responsiveSize(23),
    alignItems: 'center',
    justifyContent: 'center',
  },
  poharZaklad: {
    position: 'absolute',
  },
  poharOkraj: {
    position: 'absolute',
  },
  poharAkcent: {
    position: 'absolute',
    top: 2,
    right: 2,
  },

}); 