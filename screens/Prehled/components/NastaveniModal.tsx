import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../../../hooks/useTranslation';
import { NastaveniCiluModal } from './NastaveniCiluModal';
import { responsiveComponents, responsiveTypography, responsiveSpacingValues } from '../../../src/styles/theme';

interface NastaveniModalProps {
  viditelne: boolean;
  onZavrit: () => void;
}

/**
 * Modální okno pro obecná nastavení aplikace.
 */
export const NastaveniModal: React.FC<NastaveniModalProps> = ({
  viditelne,
  onZavrit,
}) => {
  const { t, currentLanguage, setLanguage } = useTranslation();
  const [zobrazitNastaveniCilu, setZobrazitNastaveniCilu] = useState(false);

  /**
   * Změna jazyka s potvrzením
   */
  const handleLanguageChange = async (newLanguage: 'cs' | 'en') => {
    if (newLanguage === currentLanguage) return;

    try {
      await setLanguage(newLanguage);
    } catch (error) {
      Alert.alert(
        t('error.saveFailed'),
        'Nepodařilo se změnit jazyk. Zkuste to znovu.'
      );
    }
  };

  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={viditelne}
        onRequestClose={onZavrit}
      >
        <TouchableWithoutFeedback onPress={onZavrit}>
          <View style={styly.modalPozadi}>
            <TouchableWithoutFeedback>
              <View style={styly.modalObsah}>
                <View style={styly.hlavicka}>
                  <Text style={styly.modalNadpis}>{t('settings.title')}</Text>
                  <TouchableOpacity onPress={onZavrit} style={styly.zavritTlacitko}>
                    <Ionicons name="close" size={28} color="#6b7280" />
                  </TouchableOpacity>
                </View>

                {/* Jazyk */}
                <View style={styly.sekce}>
                  <Text style={styly.sekceNadpis}>{t('settings.language')}</Text>
                  <View style={styly.jazykTlacitka}>
                    <TouchableOpacity
                      style={[
                        styly.jazykTlacitko,
                        currentLanguage === 'cs' && styly.jazykTlacitkoAktivni,
                      ]}
                      onPress={() => handleLanguageChange('cs')}
                      activeOpacity={0.7}
                    >
                      <Text style={styly.vlajka}>🇨🇿</Text>
                      <Text
                        style={[
                          styly.jazykText,
                          currentLanguage === 'cs' && styly.jazykTextAktivni,
                        ]}
                      >
                        {t('settings.czech')}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styly.jazykTlacitko,
                        currentLanguage === 'en' && styly.jazykTlacitkoAktivni,
                      ]}
                      onPress={() => handleLanguageChange('en')}
                      activeOpacity={0.7}
                    >
                      <Text style={styly.vlajka}>🇬🇧</Text>
                      <Text
                        style={[
                          styly.jazykText,
                          currentLanguage === 'en' && styly.jazykTextAktivni,
                        ]}
                      >
                        {t('settings.english')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Cíle pro progress bary */}
                <View style={styly.sekce}>
                  <Text style={styly.sekceNadpis}>{t('settings.progressGoals')}</Text>
                  <TouchableOpacity
                    style={styly.cilTlacitko}
                    onPress={() => setZobrazitNastaveniCilu(true)}
                    activeOpacity={0.7}
                  >
                    <View style={styly.cilTlacitkoObsah}>
                      <Ionicons name="settings" size={20} color="#2563eb" />
                      <Text style={styly.cilTlacitkoText}>
                        {t('settings.configureGoals')}
                      </Text>
                      <Ionicons name="chevron-forward" size={20} color="#6b7280" />
                    </View>
                  </TouchableOpacity>
                </View>

                {/* O aplikaci */}
                <View style={styly.sekce}>
                  <Text style={styly.sekceNadpis}>{t('about.title')}</Text>
                  
                  <Text style={styly.appInfo}>FitTracker 1.1.8</Text>
                  
                  <View style={styly.popisKontejner}>
                    <Text style={styly.popisText}>{t('about.appDescription')}</Text>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Modální okno pro nastavení cílů */}
      <NastaveniCiluModal
        viditelne={zobrazitNastaveniCilu}
        onZavrit={() => setZobrazitNastaveniCilu(false)}
      />
    </>
  );
};

const styly = StyleSheet.create({
  modalPozadi: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalObsah: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: responsiveComponents.cardBorderRadius,
    padding: responsiveSpacingValues.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  hlavicka: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsiveSpacingValues.lg,
  },
  modalNadpis: {
    fontSize: responsiveTypography.subtitle.fontSize,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    flex: 1,
    marginLeft: 28, // Kompenzace pro zavírací tlačítko
  },
  zavritTlacitko: {
    padding: responsiveSpacingValues.xs,
  },
  sekce: {
    paddingVertical: responsiveSpacingValues.md,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  sekceNadpis: {
    fontSize: responsiveTypography.body.fontSize,
    fontWeight: '600',
    color: '#374151',
    marginBottom: responsiveSpacingValues.md,
    textAlign: 'center', // Centrování nadpisů sekcí
  },
  jazykTlacitka: {
    flexDirection: 'row',
    gap: responsiveSpacingValues.sm,
  },
  jazykTlacitko: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: responsiveSpacingValues.sm,
    paddingHorizontal: responsiveSpacingValues.md,
    borderRadius: responsiveSpacingValues.sm,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: '#f8fafc',
  },
  jazykTlacitkoAktivni: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  vlajka: {
    fontSize: 20,
    marginRight: responsiveSpacingValues.sm,
  },
  jazykText: {
    fontSize: responsiveTypography.body.fontSize,
    fontWeight: '500',
    color: '#6b7280',
  },
  jazykTextAktivni: {
    color: '#2563eb',
    fontWeight: '600',
  },
  infoRadek: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: responsiveSpacingValues.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  infoLabel: {
    fontSize: responsiveTypography.caption.fontSize,
    fontWeight: '500',
    color: '#6b7280',
    flex: 1,
  },
  infoHodnota: {
    fontSize: responsiveTypography.caption.fontSize,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'right',
  },
  popisKontejner: {
    marginTop: responsiveSpacingValues.sm,
    paddingTop: responsiveSpacingValues.sm,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  popisText: {
    fontSize: responsiveTypography.caption.fontSize,
    lineHeight: 20,
    color: '#4b5563',
    textAlign: 'center',
  },
  appInfo: {
    fontSize: responsiveTypography.body.fontSize,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    marginBottom: responsiveSpacingValues.sm,
  },
  cilTlacitko: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: responsiveSpacingValues.sm,
    paddingHorizontal: responsiveSpacingValues.md,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f8fafc',
  },
  cilTlacitkoObsah: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  cilTlacitkoText: {
    fontSize: responsiveTypography.body.fontSize,
    fontWeight: '500',
    color: '#1f2937',
    marginLeft: 10,
    marginRight: 10,
  },
}); 