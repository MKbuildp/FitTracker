import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../../../hooks/useTranslation';
import PremiumTlacitko from '../../../components/PremiumTlacitko';

/** Props pro WelcomeModal */
interface WelcomeModalProps {
  viditelne: boolean;
  onZavrit: () => void;
  onUpgradeToPremium: () => void;
  onPokracovat: () => void;
}

/**
 * Uvítací modální okno pro nové uživatele
 */
export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  viditelne,
  onZavrit,
  onUpgradeToPremium,
  onPokracovat,
}) => {
  const { t } = useTranslation();

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
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Hlavní nadpis */}
                <Text style={styly.hlavniNadpis}>{t('welcome.title')}</Text>
                <Text style={styly.podnadpis}>{t('welcome.subtitle')}</Text>

                {/* Free verze sekce */}
                <View style={styly.freeVerzeSekce}>
                  <View style={styly.freeVerzeHeader}>
                    <Text style={styly.freeVerzeText}>{t('welcome.freeVersion')}</Text>
                  </View>
                  
                  <View style={styly.freeVerzeObsah}>
                    <View style={styly.omezeniPolozka}>
                      <Ionicons name="refresh" size={20} color="#6b7280" />
                      <Text style={styly.omezeniText}>
                        {t('welcome.repetitionExercises')}
                      </Text>
                    </View>
                    
                    <View style={styly.omezeniPolozka}>
                      <Ionicons name="timer-outline" size={20} color="#6b7280" />
                      <Text style={styly.omezeniText}>
                        {t('welcome.timeExercises')}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Premium sekce a tlačítko – nyní zobrazeno (česká indexace) */}
                <View style={styly.premiumSekce}>
                  <PremiumTlacitko onPress={onUpgradeToPremium} />
                </View>

                {/* Pokračovat tlačítko */}
                <TouchableOpacity
                  style={[styly.pokracovatTlacitko, { marginTop: 16 }]}
                  onPress={onPokracovat}
                  activeOpacity={0.7}
                >
                  <Text style={styly.pokracovatTlacitkoText}>
                    {t('welcome.continueWithFree')}
                  </Text>
                </TouchableOpacity>
              </ScrollView>
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalObsah: {
    width: '90%',
    maxHeight: '85%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  hlavniNadpis: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  podnadpis: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  freeVerzeSekce: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 24,
    overflow: 'hidden',
  },
  freeVerzeHeader: {
    backgroundColor: '#1f2937',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  freeVerzeText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  freeVerzeObsah: {
    padding: 20,
  },
  omezeniPolozka: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  omezeniText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
    flex: 1,
  },
  premiumSekce: {
    marginBottom: 24,
  },
  pokracovatTlacitko: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  pokracovatTlacitkoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
  },
}); 