import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Cviceni } from '../../../types';
import { useTranslation } from '../../../hooks/useTranslation';
import { responsiveComponents, responsiveTypography, responsiveSpacingValues } from '../../../src/styles/theme';

/** Komponenta pro editaci denního cíle cvičení */
export const DenniCilEditor: React.FC<{
  cviceni: Cviceni;
  editujeCil: boolean;
  pocetOpakovani: number;
  minuty: number;
  sekundy: number;
  formatovatCil: (hodnota: number) => string;
  setEditujeCil: (edituje: boolean) => void;
  odstranCil: () => void;
  zmenitOpakovani: (zmena: number) => void;
  zmenitMinuty: (zmena: number) => void;
  zmenitSekundy: (zmena: number) => void;
  ulozitCil: () => void;
  zrusitEditaci: () => void;
}> = ({
  cviceni,
  editujeCil,
  pocetOpakovani,
  minuty,
  sekundy,
  formatovatCil,
  setEditujeCil,
  odstranCil,
  zmenitOpakovani,
  zmenitMinuty,
  zmenitSekundy,
  ulozitCil,
  zrusitEditaci,
}) => {
  const { t } = useTranslation();

  return (
    <View style={styly.sekce}>
      <View style={styly.sekceNadpis}>
        <Ionicons name="flag-outline" size={20} color="#1f2937" />
        <Text style={styly.sekceText}>{t('stats.dailyGoal')}</Text>
      </View>

      {/* Aktuální cíl */}
      {cviceni.maNastavenCil && !editujeCil && (
        <View style={styly.aktualniCilKontejner}>
          <Text style={styly.aktualniCilText}>
            {t('detail.current')}: {formatovatCil(cviceni.denniCil)}
          </Text>
          <TouchableOpacity onPress={odstranCil} style={styly.odstranCilTlacitko}>
            <Ionicons name="close-circle" size={18} color="#dc2626" />
          </TouchableOpacity>
        </View>
      )}

      {/* Editace cíle */}
      {editujeCil ? (
        <View style={styly.editaceCileKontejner}>
          {cviceni.typMereni === 'opakovani' ? (
            // Editace opakování
            <View style={styly.editaceOpakovaniKontejner}>
              <Text style={styly.editaceLabel}>{t('detail.repetitionsCount')}:</Text>
              <View style={styly.hodnotaKontejner}>
                <TouchableOpacity 
                  style={styly.tlacitkoZmeny}
                  onPress={() => zmenitOpakovani(-1)}
                  disabled={pocetOpakovani <= 1}
                >
                  <Ionicons name="remove" size={20} color={pocetOpakovani <= 1 ? '#9ca3af' : '#6b7280'} />
                </TouchableOpacity>
                
                <View style={styly.hodnotaZobrazeni}>
                  <Text style={styly.hodnotaText}>{pocetOpakovani}</Text>
                </View>
                
                <TouchableOpacity 
                  style={styly.tlacitkoZmeny}
                  onPress={() => zmenitOpakovani(1)}
                >
                  <Ionicons name="add" size={20} color="#6b7280" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            // Editace času
            <View style={styly.editaceCasuKontejner}>
              <View style={styly.casKontejner}>
                {/* Minuty */}
                <View style={styly.casSloupec}>
                  <TouchableOpacity 
                    style={styly.tlacitkoZmeny}
                    onPress={() => zmenitMinuty(1)}
                  >
                    <Ionicons name="chevron-up" size={20} color="#6b7280" />
                  </TouchableOpacity>
                  
                  <View style={styly.casHodnota}>
                    <Text style={styly.casText}>{minuty.toString().padStart(2, '0')}</Text>
                  </View>
                  
                  <TouchableOpacity 
                    style={styly.tlacitkoZmeny}
                    onPress={() => zmenitMinuty(-1)}
                    disabled={minuty <= 0}
                  >
                    <Ionicons name="chevron-down" size={20} color={minuty <= 0 ? '#9ca3af' : '#6b7280'} />
                  </TouchableOpacity>
                  
                  <Text style={styly.editaceLabel}>{t('detail.minutes')}</Text>
                </View>

                <Text style={styly.casSeparator}>:</Text>

                {/* Sekundy */}
                <View style={styly.casSloupec}>
                  <TouchableOpacity 
                    style={styly.tlacitkoZmeny}
                    onPress={() => zmenitSekundy(1)} // Změněno z 15 na 1
                  >
                    <Ionicons name="chevron-up" size={20} color="#6b7280" />
                  </TouchableOpacity>
                  
                  <View style={styly.casHodnota}>
                    <Text style={styly.casText}>{sekundy.toString().padStart(2, '0')}</Text>
                  </View>
                  
                  <TouchableOpacity 
                    style={styly.tlacitkoZmeny}
                    onPress={() => zmenitSekundy(-1)} // Změněno z -15 na -1
                    disabled={sekundy <= 0}
                  >
                    <Ionicons name="chevron-down" size={20} color={sekundy <= 0 ? '#9ca3af' : '#6b7280'} />
                  </TouchableOpacity>
                  
                  <Text style={styly.editaceLabel}>{t('detail.seconds')}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Akční tlačítka */}
          <View style={styly.akceEditaceTlacitka}>
            <TouchableOpacity onPress={zrusitEditaci} style={styly.zrusitTlacitko}>
              <Ionicons name="close" size={16} color="#6b7280" />
              <Text style={styly.zrusitText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={ulozitCil} style={styly.ulozitTlacitko}>
              <Ionicons name="checkmark" size={16} color="#ffffff" />
              <Text style={styly.ulozitText}>{t('common.save')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // Tlačítko pro spuštění editace
        <TouchableOpacity onPress={() => setEditujeCil(true)} style={styly.editaceCileTlacitko}>
          <Ionicons name="create-outline" size={16} color="#2563eb" />
          <Text style={styly.editaceCileTlacitkoText}>
            {cviceni.maNastavenCil ? t('common.edit') : t('common.add')} {t('stats.goal').toLowerCase()}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styly = StyleSheet.create({
  // Sekce
  sekce: {
    marginBottom: 24,
  },
  sekceNadpis: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Zarovnání na střed
    marginBottom: 12,
    gap: 8,
  },
  sekceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },

  // Denní cíl
  aktualniCilKontejner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  aktualniCilText: {
    fontSize: responsiveTypography.caption.fontSize,
    fontWeight: '500',
    color: '#166534',
  },
  odstranCilTlacitko: {
    padding: responsiveSpacingValues.xs,
  },

  // Editace cíle
  editaceCileKontejner: {
    backgroundColor: '#f9fafb',
    borderRadius: responsiveSpacingValues.sm,
    padding: responsiveSpacingValues.md,
  },
  editaceLabel: {
    fontSize: responsiveTypography.caption.fontSize,
    fontWeight: '500',
    color: '#374151',
    marginBottom: responsiveSpacingValues.sm,
    textAlign: 'center',
  },

  // Editace opakování
  editaceOpakovaniKontejner: {
    alignItems: 'center',
  },
  hodnotaKontejner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveSpacingValues.md,
  },
  hodnotaZobrazeni: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#2563eb',
    borderRadius: responsiveSpacingValues.sm,
    paddingHorizontal: responsiveSpacingValues.lg,
    paddingVertical: responsiveSpacingValues.sm,
    minWidth: 80,
    alignItems: 'center',
  },
  hodnotaText: {
    fontSize: responsiveTypography.title.fontSize,
    fontWeight: 'bold',
    color: '#2563eb',
  },

  // Editace času
  editaceCasuKontejner: {
    alignItems: 'center',
  },
  casKontejner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  casSloupec: {
    alignItems: 'center',
    gap: 8,
  },
  casHodnota: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#2563eb',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minWidth: 60,
    alignItems: 'center',
  },
  casText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  casSeparator: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
    marginHorizontal: 4,
  },

  // Společné pro tlačítka změny
  tlacitkoZmeny: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 40,
    minHeight: 40,
  },

  // Akční tlačítka editace
  akceEditaceTlacitka: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 16,
  },
  zrusitTlacitko: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  zrusitText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  ulozitTlacitko: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  ulozitText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },

  // Tlačítko pro spuštění editace
  editaceCileTlacitko: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2563eb',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  editaceCileTlacitkoText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2563eb',
  },
}); 