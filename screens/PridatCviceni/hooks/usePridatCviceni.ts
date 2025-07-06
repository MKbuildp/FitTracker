import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCviceni } from '../../../context/CviceniContext';
import { useTranslation } from '../../../hooks/useTranslation';
import { TypMereni, SmerovaniVykonu, RootStackParamList } from '../../../types';
import { PridatCviceniHook } from '../types/types';
import { 
  validateForm, 
  vypocitatDenniCilCas, 
  bezpecnaZmenaHodnoty, 
  zmenitSekundyBezpecne 
} from '../utils/helpers';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'PridatCviceni'>;

/** Hook pro správu stavu a logiky při přidávání cvičení */
export const usePridatCviceni = (): PridatCviceniHook => {
  const { pridatCviceni } = useCviceni();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<RootStackParamList, 'PridatCviceni'>>();
  const { t } = useTranslation();
  
  // Získání typu cvičení z parametrů navigace
  const vychoziTyp = route.params?.vychoziTyp ?? 'opakovani';
  
  // Stav formuláře
  const [nazev, setNazev] = useState('');
  const [typMereni] = useState<TypMereni>(vychoziTyp); // Již není možné měnit
  const [smerovani, setSmerovani] = useState<SmerovaniVykonu>('kratsi_lepsi');
  const [ukladaSe, setUkladaSe] = useState(false);
  
  // Stav pro denní cíl
  const [maCil, setMaCil] = useState(false);
  const [pocetOpakovani, setPocetOpakovani] = useState(10);
  const [minuty, setMinuty] = useState(1);
  const [sekundy, setSekundy] = useState(0);
  
  // Stav pro barvu
  const [vybranaBarva, setVybranaBarva] = useState<string | null>(null);

  /** Reset formuláře */
  const resetForm = () => {
    setNazev('');
    setSmerovani('kratsi_lepsi');
    setMaCil(false);
    setPocetOpakovani(10);
    setMinuty(1);
    setSekundy(0);
    setVybranaBarva(null);
  };

  /** Změna počtu opakování */
  const zmenitOpakovani = (zmena: number) => {
    const novaHodnota = bezpecnaZmenaHodnoty(pocetOpakovani, zmena, 1, 999);
    setPocetOpakovani(novaHodnota);
  };

  /** Změna minut */
  const zmenitMinuty = (zmena: number) => {
    const noveMinuty = bezpecnaZmenaHodnoty(minuty, zmena, 0, 99);
    setMinuty(noveMinuty);
  };

  /** Změna sekund */
  const zmenitSekundy = (zmena: number) => {
    const noveSekundy = zmenitSekundyBezpecne(
      sekundy, 
      minuty, 
      zmena, 
      setMinuty
    );
    setSekundy(noveSekundy);
  };

  /** Uložení nového cvičení */
  const ulozitCviceni = async () => {
    const chyba = validateForm(nazev, t);
    if (chyba) {
      Alert.alert(t('addExercise.errorTitle'), chyba);
      return;
    }

    setUkladaSe(true);
    try {
      let denniCil = 0;
      
      if (maCil) {
        if (typMereni === 'opakovani') {
          denniCil = pocetOpakovani;
        } else {
          denniCil = vypocitatDenniCilCas(minuty, sekundy);
        }
      }

      const data = {
        nazev: nazev.trim(),
        typMereni,
        smerovani: typMereni === 'cas' ? smerovani : 'kratsi_lepsi',
        denniCil,
        vybranaBarva,
      };

      await pridatCviceni(data);
      
      Alert.alert(
        t('addExercise.successTitle'),
        t('addExercise.successMessage'),
        [{ text: t('common.confirm'), onPress: () => {
          resetForm();
          navigation.goBack();
        }}]
      );
    } catch (error) {
      Alert.alert(t('addExercise.errorTitle'), t('addExercise.saveError'));
    } finally {
      setUkladaSe(false);
    }
  };

  return {
    // Stav
    nazev,
    typMereni,
    smerovani,
    ukladaSe,
    maCil,
    pocetOpakovani,
    minuty,
    sekundy,
    vybranaBarva,
    
    // Akce
    setNazev,
    setSmerovani,
    setMaCil,
    zmenitOpakovani,
    zmenitMinuty,
    zmenitSekundy,
    setVybranaBarva,
    resetForm,
    ulozitCviceni,
  };
}; 