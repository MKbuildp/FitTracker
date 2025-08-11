import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PridatCasProps } from '../types/types';
import { HistorieModal } from './HistorieModal';
import { RucniCasModal } from './RucniCasModal';
import { useTranslation } from '../../../hooks/useTranslation';

/** Kontejner pro přidávání záznamu času pomocí stopek */
export const PridatCas: React.FC<PridatCasProps> = ({ onUlozit, style, cviceni, zaznamy, onSmazatZaznam }) => {
  const { safeT } = useTranslation();
  const [cas, setCas] = useState(0);
  const [jeBezi, setJeBezi] = useState(false);
  const [zobrazitHistorii, setZobrazitHistorii] = useState(false);
  const [zobrazitRucniCas, setZobrazitRucniCas] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (jeBezi) {
      intervalRef.current = setInterval(() => {
        setCas(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [jeBezi]);

  const formatovatCas = (sekundy: number) => {
    const minuty = Math.floor(sekundy / 60);
    const zbyvajiciSekundy = sekundy % 60;
    return `${minuty.toString().padStart(2, '0')}:${zbyvajiciSekundy.toString().padStart(2, '0')}`;
  };

  const toggleStopky = () => {
    setJeBezi(!jeBezi);
  };

  const resetStopky = () => {
    setJeBezi(false);
    setCas(0);
  };

  const ulozitZaznam = () => {
    if (cas === 0) return;
    onUlozit(cas);
    resetStopky();
  };

  const formatovatHodnotu = (cas: number) => {
    const minuty = Math.floor(cas / 60);
    const sekundy = cas % 60;
    return `${minuty}:${sekundy.toString().padStart(2, '0')}`;
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
              name="timer" 
              size={20} 
              color="white" 
            />
          </View>
          <Text style={styly.headerText}>
            {safeT('detail.addNewRecord', 'Přidat nový záznam')}
          </Text>
          <View style={styly.headerPrava} />
        </View>
      </View>
      
      <View style={styly.obsah}>
        {/* Stopky */}
        <View style={styly.stopkyKontejner}>
          <View style={styly.ovladaciRadek}>
            <TouchableOpacity 
              style={[styly.ovladaciTlacitko, styly.resetTlacitko]}
              onPress={resetStopky}
              disabled={cas === 0}
            >
              <Ionicons 
                name="refresh" 
                size={19} 
                color={cas > 0 ? '#6b7280' : '#d1d5db'} 
              />
            </TouchableOpacity>
            
            <View style={styly.casDisplay}>
              <Text style={styly.casHodnota}>{formatovatCas(cas)}</Text>
              <Text style={styly.casJednotka}>mm:ss</Text>
            </View>
            
            <TouchableOpacity 
              style={[
                styly.ovladaciTlacitko, 
                jeBezi ? styly.pauseTlacitko : styly.startStopTlacitko
              ]}
              onPress={toggleStopky}
            >
              <Ionicons 
                name={jeBezi ? "pause" : "play"} 
                size={19} 
                color="white" 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Řádek tlačítek - Historie | Ručně | Uložit */}
        <View style={styly.spodniTlacitka}>
          <TouchableOpacity 
            style={[styly.spodniTlacitko, styly.historieTlacitko]}
            onPress={() => setZobrazitHistorii(true)}
          >
            <Ionicons name="time" size={16} color="#3730a3" />
            <Text style={styly.spodniTlacitkoText}>
              {safeT('detail.history', 'Historie')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styly.spodniTlacitko, styly.historieTlacitko]}
            onPress={() => setZobrazitRucniCas(true)}
          >
            <Ionicons name="create" size={16} color="#6b46c1" />
            <Text style={styly.spodniTlacitkoText}>
              {safeT('detail.manualTime', 'Ručně')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styly.spodniTlacitko,
              styly.ulozitTlacitko,
              cas > 0 && { backgroundColor: cviceni?.barva || '#2563eb' }
            ]}
            onPress={ulozitZaznam}
            disabled={cas <= 0}
          >
            <Ionicons 
              name="save" 
              size={16} 
              color={cas > 0 ? '#ffffff' : '#9ca3af'} 
            />
            <Text style={[
              styly.spodniTlacitkoText,
              cas > 0 && styly.ulozitTextAktivni
            ]}>
              {safeT('detail.saveRecord', 'Uložit')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modální okna */}
      {cviceni && (
        <>
          <HistorieModal
            viditelne={zobrazitHistorii}
            onZavrit={() => setZobrazitHistorii(false)}
            zaznamy={zaznamy}
            cviceni={cviceni}
            onSmazatZaznam={onSmazatZaznam}
            formatovatHodnotu={formatovatHodnotu}
          />

          <RucniCasModal
            viditelne={zobrazitRucniCas}
            onZavrit={() => setZobrazitRucniCas(false)}
            cviceni={cviceni}
            onUlozit={onUlozit}
          />
        </>
      )}
    </View>
  );
};

const styly = StyleSheet.create({
  pridatZaznamKontejner: {
    backgroundColor: 'white',
    borderRadius: 12,
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
  headerPrava: {
    width: 24,
  },
  headerStred: {
    flex: 1,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  obsah: {
    padding: 12, // Zmenšeno z 16 na 12 pro kompaktnější rozložení
  },
  stopkyKontejner: {
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
  casDisplay: {
    alignItems: 'center',
    flex: 1, // Vráceno na flex: 1
    margin: 0, // Odstraněn margin
    padding: 0, // Odstraněn padding
  },
  casHodnota: {
    fontSize: 29, // 36 * 0.8 = 28.8 ≈ 29
    fontWeight: 'bold',
    color: '#1f2937',
    fontFamily: 'monospace',
    margin: 0, // Odstraněn margin
    padding: 0, // Odstraněn padding
  },
  casJednotka: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2, // Zmenšeno z 4 na 2 (poloviční mezera)
    margin: 0, // Odstraněn margin (kromě marginTop)
    padding: 0, // Odstraněn padding
  },

  ovladaciTlacitko: {
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
  startStopTlacitko: {
    backgroundColor: '#10b981',
  },
  pauseTlacitko: {
    backgroundColor: '#f59e0b',
  },
  resetTlacitko: {
    backgroundColor: '#f3f4f6',
    borderWidth: 0, // Odstraněno ohraničení
    borderColor: 'transparent',
  },
  ulozitTlacitko: {
    backgroundColor: '#e5e7eb',
  },
  ulozitTextAktivni: {
    color: '#ffffff',
  },
}); 