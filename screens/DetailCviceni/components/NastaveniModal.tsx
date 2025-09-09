import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import { Cviceni } from '../../../types';
import { useNastaveniModal } from '../hooks/useNastaveniModal';
import { DenniCilEditor } from './DenniCilEditor';
import { BarvyEditor } from './BarvyEditor';
import { NebezpecnaZona } from './NebezpecnaZona';
import { useTranslation } from '../../../hooks/useTranslation';
import { Ionicons } from '@expo/vector-icons';
import { responsiveComponents, responsiveTypography, responsiveSpacingValues } from '../../../src/styles/theme';

/** Modální okno pro nastavení cvičení */
export const NastaveniModal: React.FC<{
  viditelne: boolean;
  onZavrit: () => void;
  cviceni: Cviceni;
  onSmazat: () => void;
  onZmenitBarvu: (barva: string) => void;
}> = ({ viditelne, onZavrit, cviceni, onSmazat, onZmenitBarvu }) => {
  const { t } = useTranslation();
  const hookData = useNastaveniModal(cviceni);

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
                <Text style={styly.modalNadpis}>{t('detail.exerciseSettings')}</Text>
                <TouchableOpacity onPress={onZavrit} style={styly.zavritTlacitko}>
                  <Ionicons name="close" size={24} color="#6b7280" />
                </TouchableOpacity>
              </View>
              
              <DenniCilEditor
                cviceni={cviceni}
                editujeCil={hookData.editujeCil}
                pocetOpakovani={hookData.pocetOpakovani}
                minuty={hookData.minuty}
                sekundy={hookData.sekundy}
                formatovatCil={hookData.formatovatCil}
                setEditujeCil={hookData.setEditujeCil}
                odstranCil={hookData.odstranCil}
                zmenitOpakovani={hookData.zmenitOpakovani}
                zmenitMinuty={hookData.zmenitMinuty}
                zmenitSekundy={hookData.zmenitSekundy}
                ulozitCil={hookData.ulozitCil}
                zrusitEditaci={hookData.zrusitEditaci}
              />

              <BarvyEditor
                cviceni={cviceni}
                onZmenitBarvu={onZmenitBarvu}
              />

              <NebezpecnaZona
                onSmazat={onSmazat}
              />
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
  modalNadpis: {
    fontSize: responsiveTypography.title.fontSize,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: responsiveSpacingValues.lg,
    textAlign: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: responsiveSpacingValues.lg,
  },
  zavritTlacitko: {
    padding: responsiveSpacingValues.xs,
  },
}); 