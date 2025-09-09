import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TypMereni } from '../../../types';
import { useTranslation } from '../../../hooks/useTranslation';
import { responsiveComponents, responsiveTypography, responsiveSpacingValues } from '../../../src/styles/theme';

interface DenniCilVyberProps {
  typMereni: TypMereni;
  maCil: boolean;
  onMaCilChange: (maCil: boolean) => void;
  pocetOpakovani: number;
  onPocetOpakovaniChange: (delta: number) => void;
  minuty: number;
  onMinutyChange: (delta: number) => void;
  sekundy: number;
  onSekundyChange: (delta: number) => void;
}

/** Komponenta pro nastavení denního cíle s ovládáním podle NastaveniModal */
const DenniCilVyber: React.FC<DenniCilVyberProps> = ({
  typMereni,
  maCil,
  onMaCilChange,
  pocetOpakovani,
  onPocetOpakovaniChange,
  minuty,
  onMinutyChange,
  sekundy,
  onSekundyChange,
}) => {
  const { t } = useTranslation();
  const [editujeCil, setEditujeCil] = useState(false);

  /** Formátování cíle pro zobrazení */
  const formatovatCil = (hodnota: number) => {
    if (typMereni === 'opakovani') {
      return `${hodnota}×`;
    }
    const min = Math.floor(hodnota / 60);
    const sec = hodnota % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  /** Změna počtu opakování */
  const zmenitOpakovani = (zmena: number) => {
    onPocetOpakovaniChange(zmena);
  };

  /** Změna minut */
  const zmenitMinuty = (zmena: number) => {
    onMinutyChange(zmena);
  };

  /** Změna sekund */
  const zmenitSekundy = (zmena: number) => {
    onSekundyChange(zmena);
  };

  /** Zapnutí/vypnutí cíle */
  const toggleCil = (hodnota: boolean) => {
    onMaCilChange(hodnota);
    if (hodnota) {
      setEditujeCil(true);
    } else {
      setEditujeCil(false);
    }
  };

  /** Uložení změn */
  const ulozitZmeny = () => {
    setEditujeCil(false);
  };

  /** Zobrazovaná hodnota cíle */
  const zobrazovanaHodnota = maCil 
    ? formatovatCil(typMereni === 'opakovani' ? pocetOpakovani : minuty * 60 + sekundy)
    : (typMereni === 'opakovani' ? '0×' : '00:00');

  return (
    <View style={styly.sekce}>
      <View style={styly.nadpisKontejner}>
        <Ionicons name="flag-outline" size={20} color="#6b7280" />
        <Text style={styly.popisek}>{t('addExercise.dailyGoal')}</Text>
      </View>
      
      {/* Řádek s hodnotou a přepínačem */}
      <View style={styly.cilRadek}>
        <TouchableOpacity 
          style={[styly.hodnotaPole, !maCil && styly.hodnotaPoleNeaktivni]}
          onPress={() => maCil && setEditujeCil(true)}
          disabled={!maCil}
        >
          <Text style={[styly.hodnotaText, !maCil && styly.hodnotaTextNeaktivni]}>
            {zobrazovanaHodnota}
          </Text>
        </TouchableOpacity>
        
        <Switch
          value={maCil}
          onValueChange={toggleCil}
          trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
          thumbColor={maCil ? '#2563eb' : '#f3f4f6'}
        />
      </View>

      {maCil && editujeCil && (
        <View style={styly.editaceCileKontejner}>

          {typMereni === 'opakovani' ? (
            // Editace opakování
            <View style={styly.editaceOpakovaniKontejner}>
              <Text style={styly.editaceLabel}>{t('addExercise.repetitionCount')}</Text>
              <View style={styly.hodnotaKontejner}>
                <TouchableOpacity 
                  style={styly.tlacitkoZmeny}
                  onPress={() => zmenitOpakovani(-1)}
                  disabled={pocetOpakovani <= 1}
                >
                  <Ionicons name="remove" size={20} color={pocetOpakovani <= 1 ? '#9ca3af' : '#6b7280'} />
                </TouchableOpacity>
                
                <View style={styly.hodnotaZobrazeni}>
                  <Text style={styly.editaceHodnotaText}>{pocetOpakovani}</Text>
                </View>
                
                <TouchableOpacity 
                  style={styly.tlacitkoZmeny}
                  onPress={() => zmenitOpakovani(1)}
                >
                  <Ionicons name="add" size={20} color="#6b7280" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            // Editace času
            <View style={styly.editaceCasuKontejner}>
              <Text style={styly.editaceLabel}>{t('addExercise.timeMinutesSeconds')}</Text>
              <View style={styly.casKontejner}>
                {/* Minuty */}
                <View style={styly.casSloupec}>
                  <TouchableOpacity 
                    style={styly.tlacitkoZmeny}
                    onPress={() => zmenitMinuty(1)}
                  >
                    <Ionicons name="chevron-up" size={20} color="#6b7280" />
                  </TouchableOpacity>
                  
                  <View style={styly.casHodnota}>
                    <Text style={styly.casText}>{minuty.toString().padStart(2, '0')}</Text>
                  </View>
                  
                  <TouchableOpacity 
                    style={styly.tlacitkoZmeny}
                    onPress={() => zmenitMinuty(-1)}
                    disabled={minuty <= 0}
                  >
                    <Ionicons name="chevron-down" size={20} color={minuty <= 0 ? '#9ca3af' : '#6b7280'} />
                  </TouchableOpacity>
                </View>

                {/* Dvojtečka */}
                <Text style={styly.casSeparator}>:</Text>

                {/* Sekundy */}
                <View style={styly.casSloupec}>
                  <TouchableOpacity 
                    style={styly.tlacitkoZmeny}
                    onPress={() => zmenitSekundy(1)}
                  >
                    <Ionicons name="chevron-up" size={20} color="#6b7280" />
                  </TouchableOpacity>
                  
                  <View style={styly.casHodnota}>
                    <Text style={styly.casText}>{sekundy.toString().padStart(2, '0')}</Text>
                  </View>
                  
                  <TouchableOpacity 
                    style={styly.tlacitkoZmeny}
                    onPress={() => zmenitSekundy(-1)}
                    disabled={sekundy <= 0 && minuty <= 0}
                  >
                    <Ionicons name="chevron-down" size={20} color={(sekundy <= 0 && minuty <= 0) ? '#9ca3af' : '#6b7280'} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          
          {/* Tlačítko uložit */}
          <TouchableOpacity 
            style={styly.ulozitTlacitko}
            onPress={ulozitZmeny}
          >
            <Text style={styly.ulozitText}>{t('common.save')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styly = StyleSheet.create({
  sekce: {
    marginBottom: responsiveSpacingValues.lg,
  },
  nadpisKontejner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: responsiveSpacingValues.sm,
    gap: responsiveSpacingValues.sm,
  },
  popisek: {
    fontSize: responsiveTypography.body.fontSize,
    fontWeight: '600',
    color: '#374151',
  },
  pomocnyText: {
    fontSize: responsiveTypography.caption.fontSize,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: responsiveSpacingValues.sm,
  },
  switchKontejner: {
    alignItems: 'center',
    marginBottom: responsiveSpacingValues.md,
  },

  // Nový layout s řádkem
  cilRadek: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: responsiveSpacingValues.sm,
    marginBottom: responsiveSpacingValues.md,
  },
  hodnotaPole: {
    flex: 0.6,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#2563eb',
    borderRadius: responsiveSpacingValues.sm,
    paddingHorizontal: responsiveSpacingValues.md,
    paddingVertical: responsiveSpacingValues.sm,
    alignItems: 'center',
  },
  hodnotaPoleNeaktivni: {
    backgroundColor: '#f3f4f6',
    borderColor: '#d1d5db',
  },
  hodnotaText: {
    fontSize: responsiveTypography.body.fontSize,
    fontWeight: '600',
    color: '#2563eb',
  },
  hodnotaTextNeaktivni: {
    color: '#9ca3af',
  },

  // Editace cíle
  editaceCileKontejner: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 16,
  },
  
  // Aktuální cíl
  aktualniCilKontejner: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#93c5fd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  aktualniCilText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1d4ed8',
  },
  
  editaceLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 12,
    textAlign: 'center',
  },

  // Editace opakování
  editaceOpakovaniKontejner: {
    alignItems: 'center',
  },
  hodnotaKontejner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  hodnotaZobrazeni: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#2563eb',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  editaceHodnotaText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
  },

  // Editace času
  editaceCasuKontejner: {
    alignItems: 'center',
  },
  casKontejner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  casSloupec: {
    alignItems: 'center',
    gap: 8,
  },
  casHodnota: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#2563eb',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minWidth: 60,
    alignItems: 'center',
  },
  casText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  casSeparator: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
    marginHorizontal: 4,
  },

  // Společné pro tlačítka změny
  tlacitkoZmeny: {
    backgroundColor: '#f3f4f6',
    borderRadius: responsiveSpacingValues.sm,
    padding: responsiveSpacingValues.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: responsiveComponents.actionButtonSize,
    minHeight: responsiveComponents.actionButtonSize,
  },

  // Tlačítko uložit
  ulozitTlacitko: {
    backgroundColor: '#2563eb',
    borderRadius: responsiveSpacingValues.sm,
    paddingHorizontal: responsiveSpacingValues.lg,
    paddingVertical: responsiveSpacingValues.sm,
    alignItems: 'center',
    marginTop: responsiveSpacingValues.md,
  },
  ulozitText: {
    fontSize: responsiveTypography.body.fontSize,
    fontWeight: '600',
    color: 'white',
  },
});

export default DenniCilVyber; 