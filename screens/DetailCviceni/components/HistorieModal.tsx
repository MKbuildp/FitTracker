import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ZaznamVykonu, Cviceni } from '../../../types';
import { useTranslation } from '../../../hooks/useTranslation';
import { responsiveComponents, responsiveTypography, responsiveSpacingValues } from '../../../src/styles/theme';

/** Props pro HistorieModal */
interface HistorieModalProps {
  viditelne: boolean;
  onZavrit: () => void;
  zaznamy: ZaznamVykonu[];
  cviceni: Cviceni;
  onSmazatZaznam: (zaznamId: string) => void;
  formatovatHodnotu: (hodnota: number) => string;
}

/** Komponenta pro jednu položku historie */
const HistoriePolozka: React.FC<{
  zaznam: ZaznamVykonu;
  cviceni: Cviceni;
  onSmazat: (id: string) => void;
  formatovatHodnotu: (hodnota: number) => string;
}> = ({ zaznam, cviceni, onSmazat, formatovatHodnotu }) => {
  const formatovatDatum = (datum: Date) => {
    return new Date(datum).toLocaleString('cs-CZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styly.historiePolozka}>
      <View style={styly.historieObsah}>
        <Text style={styly.historieHodnota}>
          {formatovatHodnotu(zaznam.hodnota)}
        </Text>
        <Text style={styly.historieDatum}>
          {formatovatDatum(zaznam.datumCas)}
        </Text>
      </View>
      <TouchableOpacity
        style={styly.smazatTlacitko}
        onPress={() => onSmazat(zaznam.id)}
      >
        <Ionicons name="trash-outline" size={18} color="#dc2626" />
      </TouchableOpacity>
    </View>
  );
};

/** Modální okno pro historii záznamů */
export const HistorieModal: React.FC<HistorieModalProps> = ({
  viditelne,
  onZavrit,
  zaznamy,
  cviceni,
  onSmazatZaznam,
  formatovatHodnotu,
}) => {
  const { safeT } = useTranslation();
  
  // Posledních 5 záznamů seřazených podle data
  const posledniZaznamy = zaznamy
    .sort((a, b) => new Date(b.datumCas).getTime() - new Date(a.datumCas).getTime())
    .slice(0, 5);

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
                  {safeT('detail.lastFiveRecords', 'Posledních 5 záznamů')}
                </Text>
                <TouchableOpacity onPress={onZavrit} style={styly.zavritTlacitko}>
                  <Ionicons name="close" size={24} color="#6b7280" />
                </TouchableOpacity>
              </View>

              {posledniZaznamy.length === 0 ? (
                <View style={styly.zadneZaznamyKontejner}>
                  <Ionicons name="document-outline" size={48} color="#9ca3af" />
                  <Text style={styly.zadneZaznamyText}>
                    {safeT('detail.noRecords', 'Žádné záznamy')}
                  </Text>
                  <Text style={styly.zadneZaznamyPopis}>
                    {safeT('detail.noRecordsDescription', 'Zatím nemáte žádné záznamy k zobrazení')}
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={posledniZaznamy}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <HistoriePolozka
                      zaznam={item}
                      cviceni={cviceni}
                      onSmazat={onSmazatZaznam}
                      formatovatHodnotu={formatovatHodnotu}
                    />
                  )}
                  ItemSeparatorComponent={() => <View style={styly.separator} />}
                  showsVerticalScrollIndicator={false}
                />
              )}
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
    maxHeight: '70%',
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
  historiePolozka: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: responsiveSpacingValues.sm,
    padding: responsiveSpacingValues.sm,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  historieObsah: {
    flex: 1,
  },
  historieHodnota: {
    fontSize: responsiveTypography.body.fontSize,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: responsiveSpacingValues.xs,
  },
  historieDatum: {
    fontSize: responsiveTypography.caption.fontSize - 2, // Menší než caption
    color: '#6b7280',
  },
  smazatTlacitko: {
    padding: responsiveSpacingValues.sm,
  },
  separator: {
    height: responsiveSpacingValues.sm,
  },
  zadneZaznamyKontejner: {
    alignItems: 'center',
    paddingVertical: responsiveSpacingValues.xl,
  },
  zadneZaznamyText: {
    fontSize: responsiveTypography.subtitle.fontSize,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: responsiveSpacingValues.md,
    marginBottom: responsiveSpacingValues.sm,
  },
  zadneZaznamyPopis: {
    fontSize: responsiveTypography.caption.fontSize,
    color: '#6b7280',
    textAlign: 'center',
  },
}); 