import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCviceni } from '../../../context/CviceniContext';
import { useTranslation } from '../../../hooks/useTranslation';

interface NastaveniCiluModalProps {
  viditelne: boolean;
  onZavrit: () => void;
}

/** Modální okno pro nastavení cílů progress barů */
export const NastaveniCiluModal: React.FC<NastaveniCiluModalProps> = ({
  viditelne,
  onZavrit,
}) => {
  const { nastaveniCilu, nastavitCileNajednou } = useCviceni();
  const { t } = useTranslation();
  const [cilOpakovani, setCilOpakovani] = useState(nastaveniCilu.cilOpakovani);
  const [cilDokoncenaCviceni, setCilDokoncenaCviceni] = useState(nastaveniCilu.cilDokoncenaCviceni);

  // Aktualizace lokálního stavu při změně nastavení
  useEffect(() => {
    setCilOpakovani(nastaveniCilu.cilOpakovani);
    setCilDokoncenaCviceni(nastaveniCilu.cilDokoncenaCviceni);
  }, [nastaveniCilu]);

  if (!viditelne) {
    return null;
  }

  /**
   * Uložení všech změn
   */
  const handleUlozit = async () => {
    try {
      await nastavitCileNajednou(cilOpakovani, cilDokoncenaCviceni);
      onZavrit();
    } catch (error) {
      Alert.alert(t('error.saveFailed'), t('error.saveFailed'));
    }
  };

  /**
   * Zrušení změn - návrat k původním hodnotám
   */
  const handleZrusit = () => {
    setCilOpakovani(nastaveniCilu.cilOpakovani);
    setCilDokoncenaCviceni(nastaveniCilu.cilDokoncenaCviceni);
    onZavrit();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={viditelne}
      onRequestClose={onZavrit}
    >
      <View style={styly.pozadi}>
        <View style={styly.modal}>
          {/* Hlavička */}
          <View style={styly.hlavicka}>
            <Text style={styly.nadpis}>{t('goals.title')}</Text>
            <TouchableOpacity onPress={onZavrit}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Obsah */}
          <View style={styly.obsah}>
            
            {/* Cíl opakování */}
            <View style={styly.polozka}>
              <View style={styly.polozkaHeader}>
                <Ionicons name="repeat" size={20} color="#dc2626" />
                <Text style={styly.polozkaTitle}>{t('goals.dailyRepetitionsGoal')}</Text>
              </View>
              
              <Text style={styly.popis}>
                {t('goals.dailyRepetitionsDescription')}
              </Text>
              
              <View style={styly.ovladace}>
                <TouchableOpacity
                  style={styly.tlacitkoMinus}
                  onPress={() => setCilOpakovani(prev => Math.max(1, prev - 5))}
                >
                  <Ionicons name="remove" size={20} color="#fff" />
                </TouchableOpacity>
                
                <View style={styly.hodnota}>
                  <Text style={styly.cislo}>{cilOpakovani}</Text>
                  <Text style={styly.jednotka}>{t('goals.repetitionsUnit')}</Text>
                </View>
                
                <TouchableOpacity
                  style={styly.tlacitkoPlus}
                  onPress={() => setCilOpakovani(prev => prev + 5)}
                >
                  <Ionicons name="add" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Cíl dokončených cvičení */}
            <View style={styly.polozka}>
              <View style={styly.polozkaHeader}>
                <Ionicons name="checkmark-circle" size={20} color="#3b82f6" />
                <Text style={styly.polozkaTitle}>{t('goals.completedExercisesGoal')}</Text>
              </View>
              
              <Text style={styly.popis}>
                {t('goals.completedExercisesDescription')}
              </Text>
              
              <View style={styly.ovladace}>
                <TouchableOpacity
                  style={styly.tlacitkoMinus}
                  onPress={() => setCilDokoncenaCviceni(prev => Math.max(1, prev - 1))}
                >
                  <Ionicons name="remove" size={20} color="#fff" />
                </TouchableOpacity>
                
                <View style={styly.hodnota}>
                  <Text style={styly.cislo}>{cilDokoncenaCviceni}</Text>
                  <Text style={styly.jednotka}>{t('goals.exercisesUnit')}</Text>
                </View>
                
                <TouchableOpacity
                  style={styly.tlacitkoPlus}
                  onPress={() => setCilDokoncenaCviceni(prev => prev + 1)}
                >
                  <Ionicons name="add" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

          </View>

          {/* Tlačítka */}
          <View style={styly.tlacitka}>
            <TouchableOpacity style={styly.zrusit} onPress={handleZrusit}>
              <Text style={styly.zrusitText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styly.ulozit} onPress={handleUlozit}>
              <Text style={styly.ulozitText}>{t('common.save')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styly = StyleSheet.create({
  pozadi: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  hlavicka: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  nadpis: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  obsah: {
    padding: 20,
  },
  polozka: {
    marginBottom: 24,
  },
  polozkaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  polozkaTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginLeft: 8,
  },
  popis: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  ovladace: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tlacitkoMinus: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tlacitkoPlus: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hodnota: {
    alignItems: 'center',
    marginHorizontal: 40,
  },
  cislo: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
  },
  jednotka: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  tlacitka: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  zrusit: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  ulozit: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
  },
  zrusitText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  ulozitText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
});