import { useState, useEffect, useMemo, useCallback } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useCviceni } from '../../../context/CviceniContext';
import { useTranslation } from '../../../hooks/useTranslation';
import { NavigationProp, RoutePropType, UseDetailCviceniReturn, DetailStatistiky } from '../types/types';
import { jeDnes } from '../utils/helpers';

/** Hook pro logiku DetailCviceni obrazovky */
export const useDetailCviceni = (): UseDetailCviceniReturn => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();
  const { stav, pridatZaznam, smazatCviceni, upravitBarvuCviceni, smazatZaznam } = useCviceni();
  const { t } = useTranslation();

  const [jeModalViditelny, setJeModalViditelny] = useState(false);

  // Najdeme aktuální cvičení
  const cviceni = useMemo(() => 
    stav.cviceni.find((c: any) => c.id === route.params.cviceniId),
    [stav.cviceni, route.params.cviceniId]
  );

  // Filtrujeme záznamy pro toto cvičení
  const zaznamy = useMemo(() => 
    stav.zaznamy
      .filter((z: any) => z.cviceniId === route.params.cviceniId)
      .sort((a: any, b: any) => new Date(b.datumCas).getTime() - new Date(a.datumCas).getTime()),
    [stav.zaznamy, route.params.cviceniId]
  );

  // Výpočet rozšířených statistik s celkovou hodnotou
  const statistiky = useMemo((): DetailStatistiky => {
    if (zaznamy.length === 0) {
      return { 
        pocetZaznamu: 0, 
        nejlepsiVykon: 0, 
        prumernyVykon: 0,
        celkemHodnota: 0,
        dnesniVykon: 0
      };
    }

    const hodnoty = zaznamy.map(z => z.hodnota);
    const pocetZaznamu = zaznamy.length;
    const soucet = hodnoty.reduce((acc, val) => acc + val, 0);
    const prumernyVykon = Math.round(soucet / pocetZaznamu);

    let nejlepsiVykon: number;
    if (cviceni?.smerovani === 'kratsi_lepsi') {
      nejlepsiVykon = Math.min(...hodnoty);
    } else {
      nejlepsiVykon = Math.max(...hodnoty);
    }

    // Celková hodnota závisí na typu měření
    let celkemHodnota: number;
    if (cviceni?.typMereni === 'opakovani') {
      // U opakování sečteme všechny hodnoty
      celkemHodnota = soucet;
    } else {
      // U času sečteme všechny časy
      celkemHodnota = soucet;
    }

    // Výpočet dnešního výkonu
    const dnesniZaznamy = zaznamy.filter(z => jeDnes(new Date(z.datumCas)));
    let dnesniVykon = 0;

    if (dnesniZaznamy.length > 0) {
      if (cviceni?.typMereni === 'opakovani') {
        // U opakování sečteme všechny dnešní hodnoty
        dnesniVykon = dnesniZaznamy.reduce((sum, z) => sum + z.hodnota, 0);
      } else {
        // U času najdeme nejlepší (podle směrování)
        dnesniVykon = cviceni?.smerovani === 'kratsi_lepsi'
          ? Math.min(...dnesniZaznamy.map(z => z.hodnota))
          : Math.max(...dnesniZaznamy.map(z => z.hodnota));
      }
    }

    return { 
      pocetZaznamu, 
      nejlepsiVykon, 
      prumernyVykon,
      celkemHodnota,
      dnesniVykon
    };
  }, [zaznamy, cviceni?.smerovani, cviceni?.typMereni]);

  // Název obrazovky se nastavuje přímo v komponentě spolu s headerRight

  /** Uložení nového záznamu */
  const ulozitZaznam = async (hodnota: number) => {
    try {
      await pridatZaznam({ cviceniId: route.params.cviceniId, hodnota });
    } catch (error) {
      Alert.alert(t('delete.errorTitle'), t('delete.recordErrorMessage'));
    }
  };

  /** Potvrzení smazání cvičení */
  const potvrditSmazaniCviceni = () => {
    Alert.alert(
      t('delete.confirmTitle'),
      t('delete.confirmMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await smazatCviceni(route.params.cviceniId);
              navigation.goBack();
            } catch (error) {
              Alert.alert(t('delete.errorTitle'), t('delete.errorMessage'));
            }
          },
        },
      ]
    );
  };

  /** Změna barvy cvičení */
  const zmenitBarvuCviceni = async (barva: string) => {
    try {
      await upravitBarvuCviceni(route.params.cviceniId, barva);
    } catch (error) {
      Alert.alert(t('delete.errorTitle'), t('error.saveFailed'));
    }
  };

  /** Smazání záznamu s potvrzením */
  const smazatZaznamSPotvrzenim = (zaznamId: string) => {
    Alert.alert(
      t('detail.deleteRecord'),
      t('detail.deleteRecordConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { 
          text: t('common.delete'), 
          style: 'destructive',
          onPress: async () => {
            try {
              await smazatZaznam(zaznamId);
            } catch (error) {
              Alert.alert(t('delete.errorTitle'), t('delete.recordErrorMessage'));
            }
          }
        },
      ]
    );
  };

  /** Formátování hodnoty podle typu měření */
  const formatovatHodnotu = (hodnota: number): string => {
    if (!cviceni) return '0';
    
    if (cviceni.typMereni === 'opakovani') {
      return `${hodnota}`;
    } else {
      const minuty = Math.floor(hodnota / 60);
      const sekundy = hodnota % 60;
      return `${minuty}:${sekundy.toString().padStart(2, '0')}`;
    }
  };

  /** Otevře nastavení modal pro úpravu denního cíle */
  const otevritNastaveniModal = useCallback(() => {
    setJeModalViditelny(true);
  }, []);

  return {
    jeModalViditelny,
    setJeModalViditelny,
    cviceni,
    zaznamy,
    statistiky,
    ulozitZaznam,
    potvrditSmazaniCviceni,
    zmenitBarvuCviceni,
    formatovatHodnotu,
    smazatZaznamSPotvrzenim,
    vsechnaCviceni: stav.cviceni,
    otevritNastaveniModal, // Nový handler
  };
}; 