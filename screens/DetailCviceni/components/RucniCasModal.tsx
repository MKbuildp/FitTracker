import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Cviceni } from '../../../types';
import { useTranslation } from '../../../hooks/useTranslation';
import { responsiveComponents, responsiveTypography, responsiveSpacingValues } from '../../../src/styles/theme';

/** Props pro RucniCasModal */
interface RucniCasModalProps {
  viditelne: boolean;
  onZavrit: () => void;
  cviceni: Cviceni;
  onUlozit: (cas: number) => void;
}

/** Modální okno pro ruční zadání času */
export const RucniCasModal: React.FC<RucniCasModalProps> = ({
  viditelne,
  onZavrit,
  cviceni,
  onUlozit,
}) => {
  const { safeT } = useTranslation();
  const [minuty, setMinuty] = useState(0);
  const [sekundy, setSekundy] = useState(0);

  const zmenitMinuty = (zmena: number) => {
    setMinuty(prev => Math.max(0, prev + zmena));
  };

  const zmenitSekundy = (zmena: number) => {
    setSekundy(prev => {
      const noveSekundy = prev + zmena;
      if (noveSekundy >= 60) {
        setMinuty(min => min + 1);
        return 0;
      } else if (noveSekundy < 0) {
        if (minuty > 0) {
          setMinuty(min => min - 1);
          return 59;
        }
        return 0;
      }
      return noveSekundy;
    });
  };

  const ulozitCas = () => {
    const celkovyCase = minuty * 60 + sekundy;
    if (celkovyCase > 0) {
      onUlozit(celkovyCase);
      setMinuty(0);
      setSekundy(0);
      onZavrit();
    }
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
              <View style={styly.modalHeader}>
                <Text style={styly.modalNadpis}>
                  {safeT('detail.enterTime', 'Zadejte čas')}
                </Text>
                <TouchableOpacity onPress={onZavrit} style={styly.zavritTlacitko}>
                  <Ionicons name="close" size={24} color="#6b7280" />
                </TouchableOpacity>
              </View>



              {/* Ovládání času */}
              <View style={styly.casKontrolKontejner}>
                {/* Minuty */}
                <View style={styly.casSloupec}>
                  <Text style={styly.casLabel}>
                    {safeT('detail.minutes', 'Minuty')}
                  </Text>
                  <TouchableOpacity 
                    style={styly.tlacitkoZmeny}
                    onPress={() => zmenitMinuty(1)}
                  >
                    <Ionicons name="chevron-up" size={24} color="#2563eb" />
                  </TouchableOpacity>
                  
                  <View style={styly.casHodnota}>
                    <Text style={styly.casHodnotaText}>{minuty.toString().padStart(2, '0')}</Text>
                  </View>
                  
                  <TouchableOpacity 
                    style={styly.tlacitkoZmeny}
                    onPress={() => zmenitMinuty(-1)}
                    disabled={minuty <= 0}
                  >
                    <Ionicons 
                      name="chevron-down" 
                      size={24} 
                      color={minuty <= 0 ? '#9ca3af' : '#2563eb'} 
                    />
                  </TouchableOpacity>
                </View>

                {/* Dvojtečka */}
                <Text style={styly.casSeparator}>:</Text>

                {/* Sekundy */}
                <View style={styly.casSloupec}>
                  <Text style={styly.casLabel}>
                    {safeT('detail.seconds', 'Sekundy')}
                  </Text>
                  <TouchableOpacity 
                    style={styly.tlacitkoZmeny}
                    onPress={() => zmenitSekundy(1)}
                  >
                    <Ionicons name="chevron-up" size={24} color="#2563eb" />
                  </TouchableOpacity>
                  
                  <View style={styly.casHodnota}>
                    <Text style={styly.casHodnotaText}>{sekundy.toString().padStart(2, '0')}</Text>
                  </View>
                  
                  <TouchableOpacity 
                    style={styly.tlacitkoZmeny}
                    onPress={() => zmenitSekundy(-1)}
                    disabled={sekundy <= 0 && minuty <= 0}
                  >
                    <Ionicons 
                      name="chevron-down" 
                      size={24} 
                      color={(sekundy <= 0 && minuty <= 0) ? '#9ca3af' : '#2563eb'} 
                    />
                  </TouchableOpacity>
                </View>
              </View>



              {/* Akční tlačítka */}
              <TouchableOpacity 
                style={[
                  styly.ulozitTlacitko, 
                  (minuty === 0 && sekundy === 0) && styly.ulozitTlacitkoNeaktivni
                ]}
                onPress={ulozitCas}
                disabled={minuty === 0 && sekundy === 0}
              >
                <Ionicons 
                  name="checkmark" 
                  size={18} 
                  color={(minuty === 0 && sekundy === 0) ? '#9ca3af' : 'white'} 
                />
                <Text style={[
                  styly.ulozitText,
                  (minuty === 0 && sekundy === 0) && styly.ulozitTextNeaktivni
                ]}>
                  {safeT('detail.saveTime', 'Uložit čas')}
                </Text>
              </TouchableOpacity>
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
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalObsah: {
    width: '90%',
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
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsiveSpacingValues.lg,
  },
  modalNadpis: {
    fontSize: responsiveTypography.title.fontSize,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  zavritTlacitko: {
    padding: responsiveSpacingValues.xs,
  },

  casKontrolKontejner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    gap: 24,
  },
  casSloupec: {
    alignItems: 'center',
  },
  casLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 12,
  },
  tlacitkoZmeny: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  casHodnota: {
    backgroundColor: '#f8fafc',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: responsiveSpacingValues.sm,
    paddingHorizontal: responsiveSpacingValues.md,
    paddingVertical: responsiveSpacingValues.sm,
    marginBottom: responsiveSpacingValues.sm,
  },
  casHodnotaText: {
    fontSize: responsiveTypography.title.fontSize,
    fontWeight: 'bold',
    color: '#1f2937',
    fontFamily: 'monospace',
    textAlign: 'center',
    minWidth: 40,
  },
  casSeparator: {
    fontSize: responsiveTypography.title.fontSize + 4, // Větší než title
    fontWeight: 'bold',
    color: '#6b7280',
    marginTop: 40,
  },

  ulozitTlacitko: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    borderRadius: responsiveSpacingValues.sm,
    padding: responsiveSpacingValues.sm,
    gap: responsiveSpacingValues.sm,
  },
  ulozitTlacitkoNeaktivni: {
    backgroundColor: '#e5e7eb',
  },
  ulozitText: {
    color: 'white',
    fontSize: responsiveTypography.body.fontSize,
    fontWeight: '600',
  },
  ulozitTextNeaktivni: {
    color: '#9ca3af',
  },
}); 