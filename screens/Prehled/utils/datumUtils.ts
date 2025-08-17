/**
 * Utility funkce pro práci s daty v kalendáři
 */

/** Získá začátek týdne (pondělí) pro zadané datum */
export const getZacatekTydne = (datum: Date): Date => {
  const novyDatum = new Date(datum);
  const den = novyDatum.getDay();
  const diff = novyDatum.getDate() - den + (den === 0 ? -6 : 1); // upravit pro pondělí jako první den
  novyDatum.setDate(diff);
  return novyDatum;
};

/** Získá pole dat pro týden od pondělí do neděle */
export const getDatyTydne = (datum: Date): Date[] => {
  const zacatekTydne = getZacatekTydne(datum);
  const datyTydne: Date[] = [];
  
  for (let i = 0; i < 7; i++) {  // Zpět na 7 dní pro Po-Ne
    const novyDatum = new Date(zacatekTydne);
    novyDatum.setDate(zacatekTydne.getDate() + i);
    datyTydne.push(novyDatum);
  }
  
  return datyTydne;
};

/** Formátuje datum do krátkého formátu */
export const formatujDatumKratce = (datum: Date): string => {
  return datum.toLocaleDateString('cs-CZ', {
    day: 'numeric',
    month: 'numeric'
  });
};

/** Formátuje den v týdnu */
export const formatujDenTydne = (datum: Date): string => {
  return datum.toLocaleDateString('cs-CZ', { weekday: 'short' }).toUpperCase();
};

/** Kontroluje, zda je datum dnes */
export const jeDnes = (datum: Date): boolean => {
  const dnes = new Date();
  return datum.getDate() === dnes.getDate() &&
         datum.getMonth() === dnes.getMonth() &&
         datum.getFullYear() === dnes.getFullYear();
};

/** Kontroluje, zda jsou dva datumy stejný den */
export const jeStejenDen = (datum1: Date, datum2: Date): boolean => {
  return datum1.getDate() === datum2.getDate() &&
         datum1.getMonth() === datum2.getMonth() &&
         datum1.getFullYear() === datum2.getFullYear();
};

/** Vrací počet aktivních dní v měsíci */
export const getPocetAktivnichDni = (zaznamy: any[], datum: Date): number => {
  const rok = datum.getFullYear();
  const mesic = datum.getMonth();
  
  const jedinecneDny = new Set(
    zaznamy
      .filter(z => {
        const datumZaznamu = new Date(z.datumCas);
        return datumZaznamu.getFullYear() === rok && datumZaznamu.getMonth() === mesic;
      })
      .map(z => new Date(z.datumCas).getDate())
  );
  
  return jedinecneDny.size;
};

/** Vrací počet dní v měsíci */
export const getPocetDniVMesici = (datum: Date): number => {
  return new Date(datum.getFullYear(), datum.getMonth() + 1, 0).getDate();
};

/** Vrací procento splněných denních cílů */
export const getPlneniCiluProcenta = (zaznamy: any[], cviceni: any[], datum: Date): number => {
  const rok = datum.getFullYear();
  const mesic = datum.getMonth();
  
  const denniZaznamy = zaznamy.filter(z => {
    const datumZaznamu = new Date(z.datumCas);
    return datumZaznamu.getFullYear() === rok && datumZaznamu.getMonth() === mesic;
  });

  if (denniZaznamy.length === 0) return 0;

  let splneneCile = 0;
  let celkoveCile = 0;

  const dnyMesice = Array.from(
    { length: getPocetDniVMesici(datum) },
    (_, i) => i + 1
  );

  dnyMesice.forEach(den => {
    const zaznamyDne = denniZaznamy.filter(z => {
      const datumZaznamu = new Date(z.datumCas);
      return datumZaznamu.getDate() === den;
    });

    cviceni.forEach(cv => {
      if (!cv.denniCil) return;

      celkoveCile++;
      const zaznamyCviceni = zaznamyDne.filter(z => z.cviceniId === cv.id);
      
      if (zaznamyCviceni.length === 0) return;

      if (cv.typMereni === 'opakovani') {
        const celkemOpakovani = zaznamyCviceni.reduce((sum, z) => sum + z.hodnota, 0);
        if (celkemOpakovani >= cv.denniCil) splneneCile++;
      } else {
        const hodnoty = zaznamyCviceni.map(z => z.hodnota);
        const nejlepsiCas = cv.smerovani === 'kratsi_lepsi'
          ? Math.min(...hodnoty)
          : Math.max(...hodnoty);
        
        if (cv.smerovani === 'kratsi_lepsi' && nejlepsiCas <= cv.denniCil) {
          splneneCile++;
        } else if (cv.smerovani === 'delsi_lepsi' && nejlepsiCas >= cv.denniCil) {
          splneneCile++;
        }
      }
    });
  });

  return celkoveCile > 0 ? Math.round((splneneCile / celkoveCile) * 100) : 0;
};
