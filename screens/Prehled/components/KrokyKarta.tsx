import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSteps } from '../../../hooks/useSteps';
import { responsiveComponents, responsiveTypography, responsiveSpacingValues } from '../../../src/styles/theme';

/** Komponenta pro zobrazení kroků z telefonu */
export const KrokyKarta: React.FC = () => {
  const { steps, isAvailable, isLoading, error } = useSteps();

  // Formátování počtu kroků (s oddělovačem tisíců)
  const formatovatKroky = (pocet: number | null): string => {
    if (pocet === null) return '—';
    return pocet.toLocaleString('cs-CZ');
  };

  return (
    <View style={styly.kontejner}>
      <View style={[styly.karta, { borderColor: '#06b6d4' }]}>
        {/* Barevná hlavička */}
        <View style={[styly.barevnyHeader, { backgroundColor: '#06b6d4' }]}>
          <Text style={styly.headerText}>Kroky dnes</Text>
        </View>
        <View style={styly.obsah}>
          <Ionicons name="footsteps" size={24} color="#06b6d4" />
          {isLoading ? (
            <Text style={styly.statistikaCislo}>—</Text>
          ) : !isAvailable ? (
            <View style={styly.nepodporovanoKontejner}>
              <Text style={styly.nepodporovanoText}>Nepodporováno</Text>
              <Text style={styly.nepodporovanoPopis}>
                {Platform.OS === 'android' 
                  ? 'Vyžaduje Health Connect modul' 
                  : 'Není dostupné na této platformě'}
              </Text>
            </View>
          ) : error ? (
            <Text style={styly.chybaText}>{error}</Text>
          ) : (
            <Text style={styly.statistikaCislo}>
              {formatovatKroky(steps)}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styly = StyleSheet.create({
  kontejner: {
    marginBottom: responsiveSpacingValues.md,
    paddingHorizontal: responsiveSpacingValues.sm,
  },
  karta: {
    backgroundColor: 'white',
    borderRadius: responsiveComponents.cardBorderRadius,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1.2,
  },
  barevnyHeader: {
    paddingHorizontal: responsiveSpacingValues.sm,
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 32,
  },
  headerText: {
    fontSize: responsiveTypography.caption.fontSize - 1,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    lineHeight: 16,
  },
  obsah: {
    padding: responsiveSpacingValues.sm,
    alignItems: 'center',
    gap: responsiveSpacingValues.xs,
  },
  statistikaCislo: {
    fontSize: responsiveTypography.title.fontSize - 4,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 0,
    marginBottom: 0,
    lineHeight: 20,
  },
  chybaText: {
    fontSize: responsiveTypography.caption.fontSize,
    color: '#ef4444',
    fontWeight: '500',
  },
  nepodporovanoKontejner: {
    alignItems: 'center',
    gap: responsiveSpacingValues.xxs,
  },
  nepodporovanoText: {
    fontSize: responsiveTypography.caption.fontSize,
    color: '#6b7280',
    fontWeight: '500',
  },
  nepodporovanoPopis: {
    fontSize: responsiveTypography.caption.fontSize - 2,
    color: '#9ca3af',
    textAlign: 'center',
  },
});

