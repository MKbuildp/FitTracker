import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePlatby } from '../../../context/PlatbyContext';
import { useTranslation } from '../../../hooks/useTranslation';

/** Props pro PremiumModal */
interface PremiumModalProps {
  viditelne: boolean;
  onZavrit: () => void;
  onKoupitPremium?: () => void;
  onObnovitNakupy?: () => void;
}

/**
 * @description Modální okno pro zobrazení nabídky Premium verze a zahájení nákupu.
 */
const PremiumModal = ({ viditelne, onZavrit, onKoupitPremium, onObnovitNakupy }: PremiumModalProps) => {
  const { t } = useTranslation();
  const { jePremium, setJePremium, produkty, koupitPremium, nacitaSe, inicializovano, aktivovatPremiumPromoKodem } = usePlatby();
  const premiumProdukt = produkty.length > 0 ? produkty[0] : null;
  const [promoKod, setPromoKod] = useState('');
  const [jePromoModalViditelny, setJePromoModalViditelny] = useState(false);

  const handleKoupitPremium = async () => {
    if (onKoupitPremium) {
      onKoupitPremium();
    } else {
      await koupitPremium();
    }
  };

  const handleObnovitNakupy = () => {
    if (onObnovitNakupy) {
      onObnovitNakupy();
    }
  };

  const handleOveritKod = async () => {
    try {
      const uspech = await aktivovatPremiumPromoKodem(promoKod);
      if (uspech) {
        Alert.alert(t('promo_code_success_title'), t('promo_code_success_message'));
        onZavrit();
      } else {
        Alert.alert(t('promo_code_error_title'), t('promo_code_error_message'));
      }
    } catch (error) {
      console.error('Chyba při ověřování promo kódu:', error);
      Alert.alert(t('promo_code_error_title'), t('promo_code_error_message'));
    }
  };

  const renderContent = () => {
    if (!inicializovano || nacitaSe) {
      return <ActivityIndicator size="large" color="#2563eb" />;
    }

    if (jePremium) {
      return (
        <View style={styles.contentContainer}>
          <Ionicons name="shield-checkmark" size={60} color="#059669" />
          <Text style={styles.title}>{t('premium_modal_owned_title')}</Text>
          <Text style={styles.description}>{t('premium_modal_owned_description')}</Text>
        </View>
      );
    }
    
    if (!premiumProdukt) {
      return (
        <View style={styles.contentContainer}>
          <Ionicons name="alert-circle-outline" size={60} color="#f97316" />
          <Text style={styles.title}>{t('premium_modal_error_title')}</Text>
          <Text style={styles.description}>{t('premium_modal_error_description')}</Text>
        </View>
      );
    }

    return (
      <View style={styles.contentContainer}>
        <Ionicons name="sparkles" size={60} color="#f59e0b" />
        <Text style={styles.title}>{t('premium.title')}</Text>

        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={24} color="#059669" />
            <Text style={styles.featureText}>{t('premium.unlimitedExercises')}</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.purchaseButton} onPress={handleKoupitPremium}>
          <Text style={styles.purchaseButtonText}>
            {t('premium_modal_unlock_button')} ({premiumProdukt.price})
          </Text>
        </TouchableOpacity>

        {onObnovitNakupy && (
          <TouchableOpacity style={styles.restoreButton} onPress={handleObnovitNakupy}>
            <Text style={styles.restoreButtonText}>
              {t('premium.restorePurchases')}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.promoOpenButton} onPress={() => setJePromoModalViditelny(true)}>
          <Text style={styles.promoOpenButtonText}>{t('promo_code_button')}</Text>
        </TouchableOpacity>

        {jePromoModalViditelny && (
          <PromoKodModal
            viditelne={jePromoModalViditelny}
            onZavrit={() => setJePromoModalViditelny(false)}
            onOverit={async (kod: string) => {
              setPromoKod(kod);
              await handleOveritKod();
              setJePromoModalViditelny(false);
            }}
          />
        )}
      </View>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={viditelne}
      onRequestClose={onZavrit}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.closeButton} onPress={onZavrit}>
            <Ionicons name="close-circle" size={30} color="#9ca3af" />
          </TouchableOpacity>
          {renderContent()}
        </View>
      </View>
    </Modal>
  );
};

/**
 * Modální okno pro zadání promo kódu
 */
interface PromoKodModalProps {
  viditelne: boolean;
  onZavrit: () => void;
  onOverit: (kod: string) => Promise<void>;
}

const PromoKodModal: React.FC<PromoKodModalProps> = ({ viditelne, onZavrit, onOverit }) => {
  const { t } = useTranslation();
  const [kod, setKod] = useState('');

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={viditelne}
      onRequestClose={onZavrit}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)' }}>
        <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 24, width: '85%', alignItems: 'center' }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>{t('promo_code_button')}</Text>
          <TextInput
            style={{
              backgroundColor: '#f3f4f6',
              borderRadius: 10,
              paddingVertical: 12,
              paddingHorizontal: 15,
              width: '100%',
              fontSize: 16,
              color: '#1f2937',
              marginBottom: 16,
            }}
            placeholder={t('promo_code_placeholder')}
            placeholderTextColor="#9ca3af"
            value={kod}
            onChangeText={setKod}
            autoCapitalize="characters"
          />
          <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
            <TouchableOpacity
              style={{ backgroundColor: '#2563eb', borderRadius: 20, paddingVertical: 10, paddingHorizontal: 24, flex: 1, marginRight: 8 }}
              onPress={() => onOverit(kod)}
            >
              <Text style={{ color: 'white', fontWeight: '600', fontSize: 16, textAlign: 'center' }}>{t('promo_code_button')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: '#e5e7eb', borderRadius: 20, paddingVertical: 10, paddingHorizontal: 18, flex: 1, marginLeft: 8 }}
              onPress={onZavrit}
            >
              <Text style={{ color: '#374151', fontWeight: '500', fontSize: 16, textAlign: 'center' }}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  contentContainer: {
    alignItems: 'center',
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    marginBottom: 20,
  },
  featuresContainer: {
    alignSelf: 'flex-start',
    marginBottom: 25,
    paddingLeft: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 10,
  },
  purchaseButton: {
    backgroundColor: '#2563eb',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 30,
    elevation: 2,
    width: '100%',
    marginBottom: 10,
  },
  purchaseButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
  },
  restoreButton: {
    backgroundColor: 'transparent',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 30,
    width: '100%',
  },
  restoreButtonText: {
    color: '#6b7280',
    fontWeight: '500',
    textAlign: 'center',
    fontSize: 16,
  },
  promoOpenButton: {
    backgroundColor: 'transparent',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 30,
    width: '100%',
    marginBottom: 10,
  },
  promoOpenButtonText: {
    color: '#2563eb',
    fontWeight: '500',
    textAlign: 'center',
    fontSize: 16,
  },
}); 

export { PremiumModal };
export default PremiumModal; 