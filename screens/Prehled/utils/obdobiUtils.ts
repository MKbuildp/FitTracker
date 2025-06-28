import { ZaznamVykonu, Cviceni } from '../../../types';
import { ObdobniStav } from '../../../context/ObdobniContext';

/** Filtruje záznamy podle vybraného měsíce */
export const filtrovatZaznamyPodleObdobi = (
  zaznamy: ZaznamVykonu[],
  obdobi: ObdobniStav
): ZaznamVykonu[] => {
  const datumObdobi = obdobi.datum;
  
  return zaznamy.filter(zaznam => {
    const datumZaznamu = new Date(zaznam.datumCas);
    
    return datumZaznamu.getFullYear() === datumObdobi.getFullYear() &&
           datumZaznamu.getMonth() === datumObdobi.getMonth();
  });
};

/** Počítá počet aktivních dnů v období */
export const pocetAktivnichDni = (
  zaznamy: ZaznamVykonu[],
  obdobi: ObdobniStav
): number => {
  const filtrovaneZaznamy = filtrovatZaznamyPodleObdobi(zaznamy, obdobi);
  
  const jedinecneDny = new Set(
    filtrovaneZaznamy.map(zaznam => {
      const datum = new Date(zaznam.datumCas);
      return `${datum.getFullYear()}-${datum.getMonth()}-${datum.getDate()}`;
    })
  );
  
  return jedinecneDny.size;
};

/** Vrací aktivní dny ve formátu X/Y (aktivní/celkem) */
export const aktivniDnyFormat = (
  zaznamy: ZaznamVykonu[],
  obdobi: ObdobniStav
): string => {
  const aktivniDny = pocetAktivnichDni(zaznamy, obdobi);
  
  // Počet dní v měsíci
  const rok = obdobi.datum.getFullYear();
  const mesic = obdobi.datum.getMonth();
  const celkemDni = new Date(rok, mesic + 1, 0).getDate();
  
  return `${aktivniDny}/${celkemDni}`;
};

/** Výpočet denního průměru záznamů */
export const dennyPrumer = (
  zaznamy: ZaznamVykonu[],
  obdobi: ObdobniStav
): number => {
  const filtrovaneZaznamy = filtrovatZaznamyPodleObdobi(zaznamy, obdobi);
  const aktivnichDni = pocetAktivnichDni(zaznamy, obdobi);
  
  if (aktivnichDni === 0) return 0;
  
  return Math.round((filtrovaneZaznamy.length / aktivnichDni) * 10) / 10;
};

/** Porovnání s předchozím měsícem */
export const porovnaniSPredchozimObdobim = (
  zaznamy: ZaznamVykonu[],
  aktualni: ObdobniStav
): { rozdil: number; procenta: number; trend: 'up' | 'down' | 'stable' } => {
  // Vytvoř předchozí měsíc
  const predchoziDatum = new Date(aktualni.datum);
  predchoziDatum.setMonth(predchoziDatum.getMonth() - 1);
  
  const predchoziObdobi: ObdobniStav = {
    datum: predchoziDatum,
  };
  
  const aktualniZaznamy = filtrovatZaznamyPodleObdobi(zaznamy, aktualni);
  const predchoziZaznamy = filtrovatZaznamyPodleObdobi(zaznamy, predchoziObdobi);
  
  const aktualniPocet = aktualniZaznamy.length;
  const predchoziPocet = predchoziZaznamy.length;
  
  const rozdil = aktualniPocet - predchoziPocet;
  
  let procenta = 0;
  if (predchoziPocet > 0) {
    procenta = Math.round((rozdil / predchoziPocet) * 100);
  } else if (aktualniPocet > 0) {
    procenta = 100; // Nárůst z nuly
  }
  
  let trend: 'up' | 'down' | 'stable' = 'stable';
  if (rozdil > 0) trend = 'up';
  else if (rozdil < 0) trend = 'down';
  
  return { rozdil, procenta, trend };
};

/** Najde nejaktivnější den v měsíci */
export const nejaktivnejsiPerioda = (
  zaznamy: ZaznamVykonu[],
  obdobi: ObdobniStav
): { nazev: string; pocet: number } => {
  const filtrovaneZaznamy = filtrovatZaznamyPodleObdobi(zaznamy, obdobi);
  
  if (filtrovaneZaznamy.length === 0) {
    return { nazev: '-', pocet: 0 };
  }
  
  // Najdi nejaktivnější den v týdnu
  const dnyTydne = ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'];
  const poctyDni: Record<string, number> = {};
  
  filtrovaneZaznamy.forEach(zaznam => {
    const datum = new Date(zaznam.datumCas);
    const denTydne = dnyTydne[datum.getDay()];
    poctyDni[denTydne] = (poctyDni[denTydne] || 0) + 1;
  });
  
  const nejaktivnejsi = Object.entries(poctyDni).reduce((max, [den, pocet]) => 
    pocet > max.pocet ? { nazev: den, pocet } : max,
    { nazev: '-', pocet: 0 }
  );
  
  return nejaktivnejsi;
};

/** Počítá splněné denní cíle v období */
export const splneneCile = (
  zaznamy: ZaznamVykonu[],
  cviceni: Cviceni[],
  obdobi: ObdobniStav
): { splneno: number; celkem: number } => {
  const cviceniSCilem = cviceni.filter(c => c.maNastavenCil && c.denniCil > 0);
  
  if (cviceniSCilem.length === 0) {
    return { splneno: 0, celkem: 0 };
  }
  
  let splneno = 0;
  let celkem = 0;
  
  cviceniSCilem.forEach(cvic => {
    const zaznamyCviceni = filtrovatZaznamyPodleObdobi(
      zaznamy.filter(z => z.cviceniId === cvic.id),
      obdobi
    );
    
    // Seskup záznamy podle dnů
    const dnySeZaznamy: Record<string, ZaznamVykonu[]> = {};
    zaznamyCviceni.forEach(zaznam => {
      const datum = new Date(zaznam.datumCas);
      const denKlic = `${datum.getFullYear()}-${datum.getMonth()}-${datum.getDate()}`;
      if (!dnySeZaznamy[denKlic]) {
        dnySeZaznamy[denKlic] = [];
      }
      dnySeZaznamy[denKlic].push(zaznam);
    });
    
    // Zkontroluj každý den
    Object.values(dnySeZaznamy).forEach(denZaznamy => {
      celkem++;
      
      if (cvic.typMereni === 'opakovani') {
        const celkemOpakovani = denZaznamy.reduce((sum, z) => sum + z.hodnota, 0);
        if (celkemOpakovani >= cvic.denniCil) {
          splneno++;
        }
      } else {
        // Pro časová cvičení
        const hodnoty = denZaznamy.map(z => z.hodnota);
        const nejlepsiCas = cvic.smerovani === 'kratsi_lepsi' 
          ? Math.min(...hodnoty)
          : Math.max(...hodnoty);
          
        if (cvic.smerovani === 'kratsi_lepsi' && nejlepsiCas <= cvic.denniCil) {
          splneno++;
        } else if (cvic.smerovani === 'delsi_lepsi' && nejlepsiCas >= cvic.denniCil) {
          splneno++;
        }
      }
    });
  });
  
  return { splneno, celkem };
};

/** Vypočítá procentuální plnění cílů po aktuální den v měsíci */
export const plneniCiluProcenta = (
  zaznamy: ZaznamVykonu[],
  cviceni: Cviceni[],
  obdobi: ObdobniStav
): number => {
  const dnes = new Date();
  const obdobiDatum = obdobi.datum;
  
  // Pokud je období v budoucnosti, vrať 0
  if (obdobiDatum.getFullYear() > dnes.getFullYear() || 
      (obdobiDatum.getFullYear() === dnes.getFullYear() && obdobiDatum.getMonth() > dnes.getMonth())) {
    return 0;
  }
  
  const cviceniSCilem = cviceni.filter(c => c.maNastavenCil && c.denniCil > 0);
  
  if (cviceniSCilem.length === 0) {
    return 0;
  }
  
  // Najdi první den s jakýmkoliv záznamem v tomto období
  const filtrovaneZaznamy = filtrovatZaznamyPodleObdobi(zaznamy, obdobi);
  if (filtrovaneZaznamy.length === 0) {
    return 0; // Žádné záznamy v tomto období
  }
  
  const prvniDenSZaznamem = Math.min(
    ...filtrovaneZaznamy.map(zaznam => new Date(zaznam.datumCas).getDate())
  );
  
  // Určit do jakého dne počítat
  let posledniDen: number;
  if (obdobiDatum.getFullYear() === dnes.getFullYear() && obdobiDatum.getMonth() === dnes.getMonth()) {
    // Aktuální měsíc - počítej po dnešní den
    posledniDen = dnes.getDate();
  } else {
    // Předchozí měsíc - počítej po poslední den měsíce
    posledniDen = new Date(obdobiDatum.getFullYear(), obdobiDatum.getMonth() + 1, 0).getDate();
  }
  
  let splneno = 0;
  let celkem = 0;
  
  // Pro každé cvičení s cílem
  cviceniSCilem.forEach(cvic => {
    const zaznamyCviceni = filtrovatZaznamyPodleObdobi(
      zaznamy.filter(z => z.cviceniId === cvic.id),
      obdobi
    );
    
    // Pro každý den od prvního dne se záznamem do posledního dne
    for (let den = prvniDenSZaznamem; den <= posledniDen; den++) {
      celkem++;
      
      // Najdi záznamy pro tento konkrétní den
      const denZaznamy = zaznamyCviceni.filter(zaznam => {
        const datumZaznamu = new Date(zaznam.datumCas);
        return datumZaznamu.getDate() === den;
      });
      
      if (denZaznamy.length === 0) {
        // Žádné záznamy pro tento den = nesplněno
        continue;
      }
      
      // Zkontroluj splnění cíle
      if (cvic.typMereni === 'opakovani') {
        const celkemOpakovani = denZaznamy.reduce((sum, z) => sum + z.hodnota, 0);
        if (celkemOpakovani >= cvic.denniCil) {
          splneno++;
        }
      } else {
        // Pro časová cvičení
        const hodnoty = denZaznamy.map(z => z.hodnota);
        const nejlepsiCas = cvic.smerovani === 'kratsi_lepsi' 
          ? Math.min(...hodnoty)
          : Math.max(...hodnoty);
          
        if (cvic.smerovani === 'kratsi_lepsi' && nejlepsiCas <= cvic.denniCil) {
          splneno++;
        } else if (cvic.smerovani === 'delsi_lepsi' && nejlepsiCas >= cvic.denniCil) {
          splneno++;
        }
      }
    }
  });
  
  if (celkem === 0) return 0;
  
  return Math.round((splneno / celkem) * 100);
}; 