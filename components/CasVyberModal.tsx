import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../hooks/useTranslation';
import { responsiveComponents, responsiveTypography, responsiveSpacingValues } from '../src/styles/theme';

interface CasVyberModalProps {
  viditelne: boolean;
  onZavrit: () => void;
  vychoziCas?: string; // Formát "HH:mm"
  onUlozit: (cas: string) => void; // Callback s časem ve formátu "HH:mm"
  nadpis?: string;
}

/**
 * Modální okno pro výběr času (hodiny a minuty) pomocí tlačítek +/-.
 * Vrací čas ve formátu "HH:mm".
 */
export const CasVyberModal: React.FC<CasVyberModalProps> = ({
  viditelne,
  onZavrit,
  vychoziCas = '08:00',
  onUlozit,
  nadpis,
}) => {
  const { t, safeT } = useTranslation();
  const [hodiny, setHodiny] = useState(8);
  const [minuty, setMinuty] = useState(0);

  // Inicializace hodnot z výchozího času
  useEffect(() => {
    if (vychoziCas) {
      const [h, m] = vychoziCas.split(':').map(Number);
      if (!isNaN(h) && h >= 0 && h <= 23) setHodiny(h);
      if (!isNaN(m) && m >= 0 && m <= 59) setMinuty(m);
    }
  }, [vychoziCas, viditelne]);

  if (!viditelne) {
    return null;
  }

  /**
   * Změna hodin
   */
  const zmenitHodiny = (zmena: number) => {
    setHodiny(prev => Math.max(0, Math.min(23, prev + zmena)));
  };

  /**
   * Změna minut s automatickým přetečením
   */
  const zmenitMinuty = (zmena: number) => {
    setMinuty(prev => {
      let noveMinuty = prev + zmena;
      
      // Zpracování přetečení
      if (noveMinuty < 0) {
        if (hodiny > 0) {
          setHodiny(h => h - 1);
          return 59;
        }
        return 0;
      } else if (noveMinuty > 59) {
        if (hodiny < 23) {
          setHodiny(h => h + 1);
          return 0;
        }
        return 59;
      }
      
      return noveMinuty;
    });
  };

  /**
   * Uložení času
   */
  const handleUlozit = () => {
    const cas = `${hodiny.toString().padStart(2, '0')}:${minuty.toString().padStart(2, '0')}`;
    onUlozit(cas);
    onZavrit();
  };

  return (
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
              {/* Hlavička */}
              <View style={styly.modalHeader}>
                <Text style={styly.modalNadpis}>
                  {nadpis || safeT('notifications.selectTime', 'Vyberte čas')}
                </Text>
                <TouchableOpacity onPress={onZavrit} style={styly.zavritTlacitko}>
                  <Ionicons name="close" size={24} color="#6b7280" />
                </TouchableOpacity>
              </View>

              {/* Ovládání času */}
              <View style={styly.casKontrolKontejner}>
                {/* Hodiny */}
                <View style={styly.casSloupec}>
                  <Text style={styly.casLabel}>
                    {safeT('notifications.hours', 'Hodiny')}
                  </Text>
                  <TouchableOpacity 
                    style={styly.tlacitkoZmeny}
                    onPress={() => zmenitHodiny(1)}
                    disabled={hodiny >= 23}
                  >
                    <Ionicons 
                      name="chevron-up" 
                      size={24} 
                      color={hodiny >= 23 ? '#9ca3af' : '#3b82f6'} 
                    />
                  </TouchableOpacity>
                  
                  <View style={styly.casHodnota}>
                    <Text style={styly.casHodnotaText}>
                      {hodiny.toString().padStart(2, '0')}
                    </Text>
                  </View>
                  
                  <TouchableOpacity 
                    style={styly.tlacitkoZmeny}
                    onPress={() => zmenitHodiny(-1)}
                    disabled={hodiny <= 0}
                  >
                    <Ionicons 
                      name="chevron-down" 
                      size={24} 
                      color={hodiny <= 0 ? '#9ca3af' : '#3b82f6'} 
                    />
                  </TouchableOpacity>
                </View>

                {/* Dvojtečka */}
                <Text style={styly.casSeparator}>:</Text>

                {/* Minuty */}
                <View style={styly.casSloupec}>
                  <Text style={styly.casLabel}>
                    {safeT('notifications.minutes', 'Minuty')}
                  </Text>
                  <TouchableOpacity 
                    style={styly.tlacitkoZmeny}
                    onPress={() => zmenitMinuty(1)}
                    disabled={hodiny >= 23 && minuty >= 59}
                  >
                    <Ionicons 
                      name="chevron-up" 
                      size={24} 
                      color={(hodiny >= 23 && minuty >= 59) ? '#9ca3af' : '#3b82f6'} 
                    />
                  </TouchableOpacity>
                  
                  <View style={styly.casHodnota}>
                    <Text style={styly.casHodnotaText}>
                      {minuty.toString().padStart(2, '0')}
                    </Text>
                  </View>
                  
                  <TouchableOpacity 
                    style={styly.tlacitkoZmeny}
                    onPress={() => zmenitMinuty(-1)}
                    disabled={hodiny <= 0 && minuty <= 0}
                  >
                    <Ionicons 
                      name="chevron-down" 
                      size={24} 
                      color={(hodiny <= 0 && minuty <= 0) ? '#9ca3af' : '#3b82f6'} 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Akční tlačítka */}
              <View style={styly.tlacitka}>
                <TouchableOpacity 
                  style={styly.zrusitTlacitko}
                  onPress={onZavrit}
                >
                  <Text style={styly.zrusitText}>{t('common.cancel')}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styly.ulozitTlacitko}
                  onPress={handleUlozit}
                >
                  <Ionicons 
                    name="checkmark" 
                    size={18} 
                    color="white" 
                  />
                  <Text style={styly.ulozitText}>{t('common.save')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styly = StyleSheet.create({
  modalPozadi: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalObsah: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: responsiveComponents.cardBorderRadius,
    padding: responsiveSpacingValues.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsiveSpacingValues.lg,
  },
  modalNadpis: {
    fontSize: responsiveTypography.subtitle.fontSize,
    fontWeight: '600',
    color: '#1f2937',
  },
  zavritTlacitko: {
    padding: responsiveSpacingValues.xs,
  },
  casKontrolKontejner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: responsiveSpacingValues.xl,
    gap: responsiveSpacingValues.lg,
  },
  casSloupec: {
    alignItems: 'center',
  },
  casLabel: {
    fontSize: responsiveTypography.caption.fontSize,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: responsiveSpacingValues.md,
  },
  tlacitkoZmeny: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: responsiveSpacingValues.sm,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  casHodnota: {
    backgroundColor: '#f8fafc',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: responsiveSpacingValues.sm,
    paddingHorizontal: responsiveSpacingValues.md,
    paddingVertical: responsiveSpacingValues.sm,
    marginBottom: responsiveSpacingValues.sm,
    minWidth: 60,
  },
  casHodnotaText: {
    fontSize: responsiveTypography.title.fontSize,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
  },
  casSeparator: {
    fontSize: responsiveTypography.title.fontSize + 8,
    fontWeight: 'bold',
    color: '#6b7280',
    marginTop: 40, // Kompenzace pro label
  },
  tlacitka: {
    flexDirection: 'row',
    gap: responsiveSpacingValues.sm,
    marginTop: responsiveSpacingValues.md,
  },
  zrusitTlacitko: {
    flex: 1,
    paddingVertical: responsiveSpacingValues.sm,
    borderRadius: responsiveSpacingValues.sm,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  ulozitTlacitko: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    borderRadius: responsiveSpacingValues.sm,
    paddingVertical: responsiveSpacingValues.sm,
    gap: responsiveSpacingValues.xs,
  },
  zrusitText: {
    fontSize: responsiveTypography.body.fontSize,
    fontWeight: '500',
    color: '#666',
  },
  ulozitText: {
    fontSize: responsiveTypography.body.fontSize,
    fontWeight: '500',
    color: '#fff',
  },
});



