import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CasVyberModal } from '../../../components/CasVyberModal';
import { useNotifications } from '../../../context/NotificationContext';
import { useTranslation } from '../../../hooks/useTranslation';
import { responsiveComponents, responsiveTypography, responsiveSpacingValues } from '../../../src/styles/theme';

interface NastaveniNotifikaciModalProps {
  viditelne: boolean;
  onZavrit: () => void;
}

/** Modální okno pro nastavení notifikací */
export const NastaveniNotifikaciModal: React.FC<NastaveniNotifikaciModalProps> = ({
  viditelne,
  onZavrit,
}) => {
  const { nastaveni, opravneni, nastavitNastaveni, ziskatOpravneni } = useNotifications();
  const { t } = useTranslation();
  const [povolene, setPovolene] = useState(nastaveni.povolene);
  const [casPripominky, setCasPripominky] = useState<string[]>([...nastaveni.casPripominky]);
  const [zobrazitCasVyber, setZobrazitCasVyber] = useState(false);
  const [indexEditovaneho, setIndexEditovaneho] = useState<number | null>(null);

  // Aktualizace lokálního stavu při změně nastavení
  useEffect(() => {
    setPovolene(nastaveni.povolene);
    setCasPripominky([...nastaveni.casPripominky]);
  }, [nastaveni]);

  if (!viditelne) {
    return null;
  }

  /**
   * Validace formátu času (HH:mm)
   */
  const validovatCas = (cas: string): boolean => {
    const regex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
    return regex.test(cas);
  };

  /**
   * Přidání nové připomínky
   */
  const handlePridatCas = () => {
    if (casPripominky.length >= 5) {
      Alert.alert(t('notifications.maxRemindersReached'), t('notifications.maxRemindersMessage'));
      return;
    }
    setCasPripominky([...casPripominky, '08:00']);
  };

  /**
   * Odebrání připomínky
   */
  const handleOdebratCas = (index: number) => {
    if (casPripominky.length <= 1) {
      Alert.alert(t('notifications.minRemindersRequired'), t('notifications.minRemindersMessage'));
      return;
    }
    const noveCasy = casPripominky.filter((_, i) => i !== index);
    setCasPripominky(noveCasy);
  };

  /**
   * Otevření modálního okna pro výběr času
   */
  const handleOtevritCasVyber = (index: number) => {
    setIndexEditovaneho(index);
    setZobrazitCasVyber(true);
  };

  /**
   * Uložení vybraného času
   */
  const handleUlozitCas = (cas: string) => {
    if (indexEditovaneho !== null) {
      const noveCasy = [...casPripominky];
      noveCasy[indexEditovaneho] = cas;
      setCasPripominky(noveCasy);
    }
    setZobrazitCasVyber(false);
    setIndexEditovaneho(null);
  };

  /**
   * Uložení změn
   */
  const handleUlozit = async () => {
    // Kontrola oprávnění
    if (povolene && opravneni === false) {
      const maOpravneni = await ziskatOpravneni();
      if (!maOpravneni) {
        Alert.alert(
          t('notifications.permissionDenied'),
          t('notifications.permissionDeniedMessage')
        );
        return;
      }
    }

    // Validace časů
    for (const cas of casPripominky) {
      if (!validovatCas(cas)) {
        Alert.alert(t('notifications.invalidTime'), t('notifications.invalidTimeMessage'));
        return;
      }
    }

    try {
      await nastavitNastaveni({
        povolene,
        casPripominky: casPripominky.filter(cas => validovatCas(cas)),
      });
      onZavrit();
    } catch (error) {
      Alert.alert(t('error.saveFailed'), t('error.saveFailed'));
    }
  };

  /**
   * Zrušení změn
   */
  const handleZrusit = () => {
    setPovolene(nastaveni.povolene);
    setCasPripominky([...nastaveni.casPripominky]);
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
            <Text style={styly.nadpis}>{t('notifications.title')}</Text>
            <TouchableOpacity onPress={onZavrit}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Obsah */}
          <ScrollView style={styly.obsah} showsVerticalScrollIndicator={false}>
            
            {/* Přepínač povolení */}
            <View style={styly.polozka}>
              <View style={styly.polozkaHeader}>
                <Ionicons 
                  name={povolene ? "notifications" : "notifications-off"} 
                  size={20} 
                  color={povolene ? "#22c55e" : "#6b7280"} 
                />
                <Text style={styly.polozkaTitle}>{t('notifications.enabled')}</Text>
              </View>
              
              <Text style={styly.popis}>
                {t('notifications.enabledDescription')}
              </Text>
              
              <TouchableOpacity
                style={[styly.prepinac, povolene && styly.prepinacAktivni]}
                onPress={() => setPovolene(!povolene)}
                activeOpacity={0.7}
              >
                <View style={[styly.prepinacKruh, povolene && styly.prepinacKruhAktivni]} />
              </TouchableOpacity>
            </View>

            {/* Časy připomínek */}
            {povolene && (
              <View style={styly.polozka}>
                <View style={styly.polozkaHeader}>
                  <Ionicons name="time" size={20} color="#3b82f6" />
                  <Text style={styly.polozkaTitle}>{t('notifications.reminderTimes')}</Text>
                </View>
                
                <Text style={styly.popis}>
                  {t('notifications.reminderTimesDescription')}
                </Text>

                {casPripominky.map((cas, index) => (
                  <View key={index} style={styly.casKontejner}>
                    <TouchableOpacity
                      style={styly.casTlacitko}
                      onPress={() => handleOtevritCasVyber(index)}
                      activeOpacity={0.7}
                    >
                      <View style={styly.casTlacitkoObsah}>
                        <Ionicons name="time-outline" size={20} color="#3b82f6" />
                        <Text style={styly.casText}>{cas}</Text>
                        <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
                      </View>
                    </TouchableOpacity>

                    {/* Tlačítko pro odebrání */}
                    <TouchableOpacity
                      style={styly.odebratTlacitko}
                      onPress={() => handleOdebratCas(index)}
                      disabled={casPripominky.length <= 1}
                    >
                      <Ionicons 
                        name="trash-outline" 
                        size={18} 
                        color={casPripominky.length <= 1 ? "#d1d5db" : "#ef4444"} 
                      />
                    </TouchableOpacity>
                  </View>
                ))}

                {casPripominky.length < 5 && (
                  <TouchableOpacity
                    style={styly.pridatTlacitko}
                    onPress={handlePridatCas}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="add-circle-outline" size={20} color="#3b82f6" />
                    <Text style={styly.pridatText}>{t('notifications.addReminder')}</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

          </ScrollView>

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

      {/* Modální okno pro výběr času */}
      <CasVyberModal
        viditelne={zobrazitCasVyber}
        onZavrit={() => {
          setZobrazitCasVyber(false);
          setIndexEditovaneho(null);
        }}
        vychoziCas={indexEditovaneho !== null ? casPripominky[indexEditovaneho] : '08:00'}
        onUlozit={handleUlozitCas}
        nadpis={t('notifications.selectTime')}
      />
    </Modal>
  );
};

const styly = StyleSheet.create({
  pozadi: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: responsiveSpacingValues.lg,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: responsiveComponents.cardBorderRadius,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
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
    padding: responsiveSpacingValues.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  nadpis: {
    fontSize: responsiveTypography.subtitle.fontSize,
    fontWeight: '600',
    color: '#333',
  },
  obsah: {
    padding: responsiveSpacingValues.lg,
  },
  polozka: {
    marginBottom: responsiveSpacingValues.lg,
  },
  polozkaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveSpacingValues.sm,
  },
  polozkaTitle: {
    fontSize: responsiveTypography.body.fontSize,
    fontWeight: '500',
    color: '#333',
    marginLeft: responsiveSpacingValues.sm,
  },
  popis: {
    fontSize: responsiveTypography.caption.fontSize,
    color: '#666',
    marginBottom: responsiveSpacingValues.md,
  },
  prepinac: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#d1d5db',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  prepinacAktivni: {
    backgroundColor: '#22c55e',
  },
  prepinacKruh: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
  },
  prepinacKruhAktivni: {
    alignSelf: 'flex-end',
  },
  casKontejner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveSpacingValues.sm,
    gap: responsiveSpacingValues.sm,
  },
  casTlacitko: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: responsiveSpacingValues.sm,
    backgroundColor: '#f9fafb',
  },
  casTlacitkoObsah: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: responsiveSpacingValues.md,
    gap: responsiveSpacingValues.sm,
  },
  casText: {
    flex: 1,
    fontSize: responsiveTypography.body.fontSize,
    fontWeight: '500',
    color: '#1f2937',
  },
  odebratTlacitko: {
    padding: responsiveSpacingValues.sm,
  },
  pridatTlacitko: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: responsiveSpacingValues.sm,
    paddingHorizontal: responsiveSpacingValues.md,
    borderRadius: responsiveSpacingValues.sm,
    borderWidth: 1,
    borderColor: '#3b82f6',
    borderStyle: 'dashed',
    marginTop: responsiveSpacingValues.sm,
  },
  pridatText: {
    fontSize: responsiveTypography.body.fontSize,
    color: '#3b82f6',
    marginLeft: responsiveSpacingValues.xs,
    fontWeight: '500',
  },
  tlacitka: {
    flexDirection: 'row',
    gap: responsiveSpacingValues.sm,
    padding: responsiveSpacingValues.lg,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  zrusit: {
    flex: 1,
    paddingVertical: responsiveSpacingValues.sm,
    borderRadius: responsiveSpacingValues.sm,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  ulozit: {
    flex: 1,
    paddingVertical: responsiveSpacingValues.sm,
    borderRadius: responsiveSpacingValues.sm,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
  },
  zrusitText: {
    fontSize: responsiveTypography.body.fontSize,
    fontWeight: '500',
    color: '#666',
  },
  ulozitText: {
    fontSize: responsiveTypography.body.fontSize,
    fontWeight: '500',
    color: '#fff',
  },
});

