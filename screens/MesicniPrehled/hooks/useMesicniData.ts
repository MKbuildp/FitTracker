import { useMemo } from 'react';
import { useCviceni } from '../../../context/CviceniContext';
import { DenniData } from '../../Prehled/types/types';
import { jeStejenDen } from '../../Prehled/utils/datumUtils';
import { getDnyMesice } from '../utils/kalendarUtils';

/**
 * Hook pro práci s měsíčními daty kalendáře
 */
export const useMesicniData = (vybranyDatum: Date) => {
  const { stav } = useCviceni();

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

  // Získání dat pro celý měsíc
  const mesicniData = useMemo(() => {
    const dnyMesice = getDnyMesice(vybranyDatum);
    // Filtrujeme pouze skutečné dny (ne null hodnoty pro prázdná místa)
    const skutecneDny = dnyMesice.filter(den => den !== null) as Date[];
    return skutecneDny.map(datum => getDenniData(datum));
  }, [vybranyDatum, stav]);

  return {
    mesicniData
  };
};
