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
  const { t } = useTranslation();
  
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
                <Text style={styly.modalNadpis}>{t('detail.lastFiveRecords')}</Text>
                <TouchableOpacity onPress={onZavrit} style={styly.zavritTlacitko}>
                  <Ionicons name="close" size={24} color="#6b7280" />
                </TouchableOpacity>
              </View>

              {posledniZaznamy.length === 0 ? (
                <View style={styly.zadneZaznamyKontejner}>
                  <Ionicons name="document-outline" size={48} color="#9ca3af" />
                  <Text style={styly.zadneZaznamyText}>{t('detail.noRecords')}</Text>
                  <Text style={styly.zadneZaznamyPopis}>
                    {t('detail.noRecordsDescription')}
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
    borderRadius: 12,
    padding: 20,
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
    marginBottom: 20,
  },
  modalNadpis: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  zavritTlacitko: {
    padding: 4,
  },
  historiePolozka: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  historieObsah: {
    flex: 1,
  },
  historieHodnota: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 4,
  },
  historieDatum: {
    fontSize: 12,
    color: '#6b7280',
  },
  smazatTlacitko: {
    padding: 8,
  },
  separator: {
    height: 8,
  },
  zadneZaznamyKontejner: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  zadneZaznamyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  zadneZaznamyPopis: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
}); 