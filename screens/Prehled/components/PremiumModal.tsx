import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePlatby } from '../../../context/PlatbyContext';
import { useTranslation } from '../../../hooks/useTranslation';

/** Props pro PremiumModal */
interface PremiumModalProps {
  visible: boolean;
  onClose: () => void;
}

/**
 * @description Modální okno pro zobrazení nabídky Premium verze a zahájení nákupu.
 */
const PremiumModal = ({ visible, onClose }: PremiumModalProps) => {
  const { t } = useTranslation();
  const { jePremium, produkty, koupitPremium, nacitaSe, inicializovano } = usePlatby();
  const premiumProdukt = produkty.length > 0 ? produkty[0] : null;

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
        <Text style={styles.title}>{premiumProdukt.title || t('premium_modal_title')}</Text>
        <Text style={styles.description}>{premiumProdukt.description || t('premium_modal_description')}</Text>

        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={24} color="#059669" />
            <Text style={styles.featureText}>{t('premium_feature_1')}</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={24} color="#059669" />
            <Text style={styles.featureText}>{t('premium_feature_2')}</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={24} color="#059669" />
            <Text style={styles.featureText}>{t('premium_feature_3')}</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.purchaseButton} onPress={koupitPremium}>
          <Text style={styles.purchaseButtonText}>
            {t('premium_modal_unlock_button')} ({premiumProdukt.price})
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close-circle" size={30} color="#9ca3af" />
          </TouchableOpacity>
          {renderContent()}
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
  },
  purchaseButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
  },
});

export default PremiumModal; 