import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../hooks/useTranslation';

/**
 * Prémiové tlačítko pro otevření Premium modalu (znovupoužitelné)
 * Používá se v Nastavení a Welcome modalu
 */
interface PremiumTlacitkoProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

const PremiumTlacitko: React.FC<PremiumTlacitkoProps> = ({ onPress, style }) => {
  const { t } = useTranslation();
  return (
    <TouchableOpacity style={[styles.premiumTlacitko, style]} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.premiumTlacitkoObsah}>
        <Ionicons name="star" size={22} color="#f59e0b" />
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.premiumTlacitkoText}>{t('premium.title')}</Text>
          <Text style={styles.premiumTlacitkoSubtitle}>{t('premium.unlimitedExercises')}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  premiumTlacitko: {
    backgroundColor: '#f8fafc',
    borderWidth: 2,
    borderColor: '#f59e0b',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    alignSelf: 'stretch',
  },
  premiumTlacitkoObsah: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumTlacitkoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f59e0b',
    marginLeft: 8,
    textAlign: 'center',
  },
  premiumTlacitkoSubtitle: {
    fontSize: 13,
    color: '#f59e0b',
    marginLeft: 8,
    textAlign: 'center',
    marginTop: 2,
  },
});

export default PremiumTlacitko; 