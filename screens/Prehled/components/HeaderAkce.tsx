import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../types/types';
import { responsiveSpacingValues } from '../../../src/styles/theme';

interface HeaderAkceProps {
  onNastaveniPress: () => void;
}

/**
 * Komponenta pro akční tlačítka v hlavičce
 */
export const HeaderAkce: React.FC<HeaderAkceProps> = ({ onNastaveniPress }) => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate('MesicniPrehled')}
        style={styles.tlacitko}
      >
        <Ionicons name="calendar-outline" size={24} color="#1f2937" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onNastaveniPress}
        style={styles.tlacitko}
      >
        <Ionicons name="settings-outline" size={24} color="#1f2937" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: responsiveSpacingValues.sm,
  },
  tlacitko: {
    padding: responsiveSpacingValues.sm,
    marginLeft: responsiveSpacingValues.sm,
  },
});
