import { useState, useMemo } from 'react';
import { useCviceni } from '../../../context/CviceniContext';
import { DenniData } from '../types/types';
import { getDatyTydne, jeStejenDen } from '../utils/datumUtils';

/**
 * Hook pro práci s daty kalendáře
 */
export const useKalendarData = () => {
  const { stav } = useCviceni();
  const [vybranyDatum, setVybranyDatum] = useState(new Date());

  /**
   * Výpočet denních dat pro konkrétní datum
   */
  const getDenniData = (datum: Date): DenniData => {
    // Filtrujeme záznamy pro daný den
    const denniZaznamy = stav.zaznamy.filter(z => jeStejenDen(new Date(z.datumCas), datum));
    
    // Počítáme splněné cíle
    const splneneCile = stav.cviceni.reduce((pocet, cviceni) => {
      const zaznamy = denniZaznamy.filter(z => z.cviceniId === cviceni.id);
      if (!zaznamy.length) return pocet;
      
      let dennyVykon = 0;
      if (cviceni.typMereni === 'opakovani') {
        dennyVykon = zaznamy.reduce((sum, z) => sum + z.hodnota, 0);
      } else {
        dennyVykon = cviceni.smerovani === 'kratsi_lepsi'
          ? Math.min(...zaznamy.map(z => z.hodnota))
          : Math.max(...zaznamy.map(z => z.hodnota));
      }
      
      const jeSplneny = cviceni.maNastavenCil && cviceni.denniCil > 0 &&
        (cviceni.typMereni === 'opakovani' 
          ? dennyVykon >= cviceni.denniCil
          : cviceni.smerovani === 'kratsi_lepsi'
            ? dennyVykon <= cviceni.denniCil
            : dennyVykon >= cviceni.denniCil);
      
      return jeSplneny ? pocet + 1 : pocet;
    }, 0);

    // Počítáme dokončená cvičení (cvičení s alespoň jedním záznamem)
    const dokoncenaCviceni = stav.cviceni.reduce((pocet, cviceni) => {
      return denniZaznamy.some(z => z.cviceniId === cviceni.id) ? pocet + 1 : pocet;
    }, 0);

    // Počítáme celkový počet opakování
    const celkovaOpakovani = denniZaznamy.reduce((sum, zaznam) => {
      const cviceni = stav.cviceni.find(c => c.id === zaznam.cviceniId);
      return cviceni?.typMereni === 'opakovani' ? sum + zaznam.hodnota : sum;
    }, 0);

    return {
      datum,
      splneneCile,
      celkoveCile: stav.cviceni.filter(c => c.maNastavenCil).length,
      dokoncenaCviceni,
      celkovaOpakovani
    };
  };

  // Memoizované denní data pro vybraný datum
  const denniData = useMemo(() => getDenniData(vybranyDatum), [vybranyDatum, stav]);

  // Získání dat pro aktuální období (týden/měsíc)
  const obdobiData = useMemo(() => {
    const datyTydne = getDatyTydne(vybranyDatum);
    return datyTydne.map(datum => getDenniData(datum));
  }, [vybranyDatum, stav]);

  return {
    vybranyDatum,
    setVybranyDatum,
    denniData,
    obdobiData
  };
};
