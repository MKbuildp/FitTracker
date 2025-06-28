import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { Cviceni } from '../../../types';
import { useCviceni } from '../../../context/CviceniContext';

/** Hook pro správu stavu a logiky NastaveniModal */
export const useNastaveniModal = (cviceni: Cviceni) => {
  const { nastavitDenniCil } = useCviceni();
  const [editujeCil, setEditujeCil] = useState(false);
  
  // Pro opakování - přímo hodnota
  const [pocetOpakovani, setPocetOpakovani] = useState(cviceni.denniCil || 0);
  
  // Pro čas - minuty a sekundy odděleně
  const [minuty, setMinuty] = useState(Math.floor((cviceni.denniCil || 0) / 60));
  const [sekundy, setSekundy] = useState((cviceni.denniCil || 0) % 60);

  // Aktualizace hodnot při změně cvičení
  useEffect(() => {
    const aktualniCil = cviceni.denniCil || 0;
    setPocetOpakovani(aktualniCil);
    setMinuty(Math.floor(aktualniCil / 60));
    setSekundy(aktualniCil % 60);
  }, [cviceni.denniCil]);

  /** Uložení cíle */
  const ulozitCil = () => {
    let hodnota: number;
    
    if (cviceni.typMereni === 'opakovani') {
      hodnota = pocetOpakovani;
    } else {
      hodnota = minuty * 60 + sekundy;
    }
    
    if (hodnota >= 0) {
      nastavitDenniCil(cviceni.id, hodnota);
      setEditujeCil(false);
    } else {
      Alert.alert('Chyba', 'Cíl musí být kladné číslo.');
    }
  };

  /** Zrušení editace */
  const zrusitEditaci = () => {
    const aktualniCil = cviceni.denniCil || 0;
    setPocetOpakovani(aktualniCil);
    setMinuty(Math.floor(aktualniCil / 60));
    setSekundy(aktualniCil % 60);
    setEditujeCil(false);
  };

  /** Odstranění cíle */
  const odstranCil = () => {
    nastavitDenniCil(cviceni.id, 0);
    setPocetOpakovani(0);
    setMinuty(0);
    setSekundy(0);
  };

  /** Změna počtu opakování */
  const zmenitOpakovani = (zmena: number) => {
    const novaHodnota = Math.max(1, pocetOpakovani + zmena);
    setPocetOpakovani(novaHodnota);
  };

  /** Změna minut */
  const zmenitMinuty = (zmena: number) => {
    const noveMinuty = Math.max(0, Math.min(99, minuty + zmena));
    setMinuty(noveMinuty);
  };

  /** Změna sekund */
  const zmenitSekundy = (zmena: number) => {
    let noveSekundy = sekundy + zmena;
    if (noveSekundy >= 60) {
      noveSekundy = 0;
      const noveMinuty = Math.min(99, minuty + 1);
      setMinuty(noveMinuty);
    } else if (noveSekundy < 0) {
      if (minuty > 0) {
        noveSekundy = 59;
        setMinuty(minuty - 1);
      } else {
        noveSekundy = 0;
      }
    }
    setSekundy(noveSekundy);
  };

  /** Formátování cíle pro zobrazení */
  const formatovatCil = (hodnota: number) => {
    if (cviceni.typMereni === 'opakovani') {
      return `${hodnota}x`;
    }
    const min = Math.floor(hodnota / 60);
    const sec = hodnota % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return {
    // State
    editujeCil,
    pocetOpakovani,
    minuty,
    sekundy,
    
    // Actions
    setEditujeCil,
    ulozitCil,
    zrusitEditaci,
    odstranCil,
    zmenitOpakovani,
    zmenitMinuty,
    zmenitSekundy,
    formatovatCil,
  };
}; 