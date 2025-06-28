import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PridatOpakovaniProps } from '../types/types';
import { HistorieModal } from './HistorieModal';
import { useTranslation } from '../../../hooks/useTranslation';

/** Kontejner pro přidávání záznamu opakování pomocí počítadla */
export const PridatOpakovani: React.FC<PridatOpakovaniProps> = ({ onUlozit, style, cviceni, zaznamy, onSmazatZaznam }) => {
  const { t } = useTranslation();
  const [pocet, setPocet] = useState(0);
  const [zobrazitHistorii, setZobrazitHistorii] = useState(false);

  const zvysitPocet = () => {
    setPocet(prev => prev + 1);
  };

  const snizitPocet = () => {
    setPocet(prev => Math.max(0, prev - 1));
  };

  const pricistRychlouVolbu = (hodnota: number) => {
    setPocet(prev => prev + hodnota);
  };

  const ulozitZaznam = () => {
    if (pocet === 0) return;
    onUlozit(pocet);
    setPocet(0);
  };

  const formatovatHodnotu = (pocet: number) => {
    return pocet.toString();
  };

  return (
    <View style={[
      styly.pridatZaznamKontejner,
      {
        borderWidth: 1.2,
        borderColor: cviceni?.barva || '#e5e7eb',
      }
    ]}>
      {/* Barevná hlavička */}
      <View style={[styly.barevnyHeader, { backgroundColor: cviceni?.barva || '#e5e7eb' }]}>
        <View style={styly.headerObsah}>
          <View style={styly.headerLeva}>
            <Ionicons 
              name="repeat" 
              size={20} 
              color="white" 
            />
          </View>
          <Text style={styly.headerText}>{t('detail.addNewRecord')}</Text>
          <View style={styly.headerPrava} />
        </View>
      </View>

      <View style={styly.obsah}>
        {/* Počítadlo */}
        <View style={styly.pocitadloKontejner}>
          <View style={styly.ovladaciRadek}>
            <TouchableOpacity 
              style={[styly.kruhoveTlacitko, styly.minusTlacitko]}
              onPress={snizitPocet}
              disabled={pocet <= 0}
            >
              <Ionicons 
                name="remove" 
                size={19} 
                color={pocet > 0 ? '#6b7280' : '#d1d5db'} 
              />
            </TouchableOpacity>
            
            <View style={styly.pocetDisplay}>
              <Text style={styly.pocetHodnota}>{formatovatHodnotu(pocet)}</Text>
              <Text style={styly.pocetJednotka}>{t('detail.repetitionsUnit')}</Text>
            </View>
            
            <TouchableOpacity 
              style={[styly.kruhoveTlacitko, styly.plusTlacitko]}
              onPress={zvysitPocet}
            >
              <Ionicons name="add" size={19} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Řádek tlačítek - Historie | +10 | Uložit */}
        <View style={styly.spodniTlacitka}>
          <TouchableOpacity 
            style={[styly.spodniTlacitko, styly.historieTlacitko]}
            onPress={() => setZobrazitHistorii(true)}
          >
            <Ionicons name="time" size={16} color="#3730a3" />
            <Text style={styly.spodniTlacitkoText}>{t('detail.history')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styly.spodniTlacitko, styly.historieTlacitko]}
            onPress={() => pricistRychlouVolbu(10)}
          >
            <Text style={styly.spodniTlacitkoText}>+10</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styly.spodniTlacitko,
              styly.ulozitTlacitko,
              pocet > 0 && { backgroundColor: cviceni?.barva || '#2563eb' }
            ]}
            onPress={ulozitZaznam}
            disabled={pocet <= 0}
          >
            <Ionicons 
              name="save" 
              size={16} 
              color={pocet > 0 ? '#ffffff' : '#9ca3af'} 
            />
            <Text style={[
              styly.spodniTlacitkoText,
              pocet > 0 && styly.ulozitTextAktivni
            ]}>
{t('detail.saveRecord')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modální okno historie */}
      {cviceni && (
        <HistorieModal
          viditelne={zobrazitHistorii}
          onZavrit={() => setZobrazitHistorii(false)}
          zaznamy={zaznamy}
          cviceni={cviceni}
          onSmazatZaznam={onSmazatZaznam}
          formatovatHodnotu={formatovatHodnotu}
        />
      )}
    </View>
  );
};

const styly = StyleSheet.create({
  pridatZaznamKontejner: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  barevnyHeader: {
    paddingVertical: 7,
    paddingHorizontal: 16,
  },
  headerObsah: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  headerLeva: {
    width: 24,
    alignItems: 'flex-start',
  },
  headerStred: {
    flex: 1,
    alignItems: 'center',
  },
  headerPrava: {
    width: 24,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  obsah: {
    padding: 12, // Zmenšeno z 16 na 12 pro kompaktnější rozložení
  },
  pocitadloKontejner: {
    backgroundColor: 'transparent', // Odstraněno pozadí
    borderRadius: 12,
    padding: 10.5, // Zmenšeno z 14 na 10.5 (další 25% redukce)
    marginBottom: 0, // Odstraněn margin
    borderWidth: 0, // Odstraněn border
    borderColor: 'transparent',
  },
  spodniTlacitka: {
    flexDirection: 'row',
    gap: 8,
  },
  spodniTlacitko: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  spodniTlacitkoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  historieTlacitko: {
    borderColor: '#c7d2fe',
    backgroundColor: '#eef2ff',
  },
  ovladaciRadek: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly', // Změněno na space-evenly pro nejmenší mezery
    margin: 0, // Odstraněn margin
    padding: 0, // Odstraněn padding
  },
  pocetDisplay: {
    alignItems: 'center',
    flex: 1, // Vráceno na flex: 1
    margin: 0, // Odstraněn margin
    padding: 0, // Odstraněn padding
  },
  pocetHodnota: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1f2937',
    fontFamily: 'monospace',
    margin: 0, // Odstraněn margin
    padding: 0, // Odstraněn padding
  },
  pocetJednotka: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2, // Zmenšeno z 4 na 2 (poloviční mezera)
    margin: 0, // Odstraněn margin (kromě marginTop)
    padding: 0, // Odstraněn padding
  },

  kruhoveTlacitko: {
    width: 45, // Zmenšeno z 56 na 45 (20% redukce)
    height: 45, // Zmenšeno z 56 na 45 (20% redukce)
    borderRadius: 22.5, // Zmenšeno z 28 na 22.5 (20% redukce)
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0, // Odstraněn margin
    padding: 0, // Odstraněn padding
    shadowColor: 'transparent', // Odstraněn stín
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0, // Odstraněn Android stín
  },
  minusTlacitko: {
    backgroundColor: '#f3f4f6',
    borderWidth: 0, // Odstraněno ohraničení
    borderColor: 'transparent',
  },
  plusTlacitko: {
    backgroundColor: '#10b981',
  },
  ulozitTlacitko: {
    backgroundColor: '#e5e7eb',
  },
  ulozitTextAktivni: {
    color: '#ffffff',
  },
}); 