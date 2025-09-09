import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCviceni } from '../../../context/CviceniContext';
import { ZaznamPolozkaProps } from '../types/types';
import { useTranslation } from '../../../hooks/useTranslation';
import { responsiveComponents, responsiveTypography, responsiveSpacingValues } from '../../../src/styles/theme';

/** Komponenta pro jeden záznam v historii */
export const ZaznamPolozka: React.FC<ZaznamPolozkaProps> = React.memo(({ zaznam, cviceni }) => {
  const { smazatZaznam } = useCviceni();
  const { t } = useTranslation();

  /** Formátování hodnoty záznamu */
  const formatovatHodnotu = () => {
    if (cviceni.typMereni === 'opakovani') {
      return `${zaznam.hodnota}`;
    } else {
      const minuty = Math.floor(zaznam.hodnota / 60);
      const sekundy = zaznam.hodnota % 60;
      return `${minuty}:${sekundy.toString().padStart(2, '0')}`;
    }
  };

  /** Smazání záznamu s potvrzením */
  const potvrditSmazani = () => {
    Alert.alert(
      t('detail.deleteRecord'),
      t('detail.deleteRecordConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { 
          text: t('common.delete'), 
          style: 'destructive',
          onPress: () => smazatZaznam(zaznam.id)
        },
      ]
    );
  };

  return (
    <View style={styly.zaznamPolozka}>
      <View style={styly.zaznamObsah}>
        <Text style={styly.zaznamHodnota}>{formatovatHodnotu()}</Text>
        <Text style={styly.zaznamDatum}>
          {new Date(zaznam.datumCas).toLocaleDateString('cs-CZ')} • {new Date(zaznam.datumCas).toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
      <TouchableOpacity
        style={styly.smazatZaznamTlacitko}
        onPress={potvrditSmazani}
      >
        <Ionicons name="trash-outline" size={16} color="#dc2626" />
      </TouchableOpacity>
    </View>
  );
});

const styly = StyleSheet.create({
  zaznamPolozka: {
    backgroundColor: 'white',
    borderRadius: responsiveSpacingValues.sm,
    padding: responsiveSpacingValues.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  zaznamObsah: {
    flex: 1,
  },
  zaznamHodnota: {
    fontSize: responsiveTypography.subtitle.fontSize,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: responsiveSpacingValues.xs,
  },
  zaznamDatum: {
    fontSize: responsiveTypography.caption.fontSize - 2, // Menší než caption
    color: '#6b7280',
  },
  smazatZaznamTlacitko: {
    padding: responsiveSpacingValues.sm,
    borderRadius: 6,
    backgroundColor: '#fef2f2',
  },
}); 