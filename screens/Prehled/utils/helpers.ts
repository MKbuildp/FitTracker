import { ZaznamVykonu, Cviceni } from '../../../types';
import { StatistikyCviceni, CelkovyProgress } from '../types/types';

/** Zjistí, zda je datum dnes */
export const jeDnes = (datum: Date): boolean => {
  const dnes = new Date();
  return (
    datum.getDate() === dnes.getDate() &&
    datum.getMonth() === dnes.getMonth() &&
    datum.getFullYear() === dnes.getFullYear()
  );
};

/** Formátuje sekundy na MM:SS */
export const formatovatCas = (sekundy: number): string => {
  const minuty = Math.floor(sekundy / 60);
  const zbyvajiciSekundy = sekundy % 60;
  return `${String(minuty).padStart(2, '0')}:${String(zbyvajiciSekundy).padStart(2, '0')}`;
};

/** Formátuje hodnotu podle typu cvičení */
export const formatovatHodnotu = (hodnota: number, typ: 'opakovani' | 'cas'): string => {
  if (typ === 'opakovani') return hodnota.toString();
  return formatovatCas(hodnota);
};

/** Vypočítá statistiky pro konkrétní cvičení */
export const vypocitatStatistiky = (cviceni: Cviceni, zaznamy: ZaznamVykonu[]): StatistikyCviceni => {
  const zaznamyCviceni = zaznamy.filter(z => z.cviceniId === cviceni.id);
  
  if (zaznamyCviceni.length === 0) {
    return {
      pocetZaznamu: 0,
      posledniVykon: null,
      nejlepsiVykon: 0,
      prumernyVykon: 0,
    };
  }

  // Seřadíme podle data - nejnovější první
  const serazeneZaznamy = zaznamyCviceni.sort((a, b) => b.datumCas.getTime() - a.datumCas.getTime());
  const posledniVykon = serazeneZaznamy[0];

  // Nejlepší výkon podle typu cvičení
  const nejlepsiVykon = cviceni.typMereni === 'cas' && cviceni.smerovani === 'kratsi_lepsi'
    ? Math.min(...zaznamyCviceni.map(z => z.hodnota))
    : Math.max(...zaznamyCviceni.map(z => z.hodnota));

  // Průměrný výkon
  const prumernyVykon = Math.round(
    zaznamyCviceni.reduce((sum, z) => sum + z.hodnota, 0) / zaznamyCviceni.length
  );

  return {
    pocetZaznamu: zaznamyCviceni.length,
    posledniVykon,
    nejlepsiVykon,
    prumernyVykon,
  };
};



/** Počítá aktivní dny (dny kdy byl alespoň jeden záznam) */
export const pocetAktivnichDni = (zaznamy: ZaznamVykonu[]): number => {
  const unikatniDny = new Set(
    zaznamy.map(z => new Date(z.datumCas).toDateString())
  );
  return unikatniDny.size;
};

/** Vypočítá celkový počet opakování za dnešní den */
export const dnesniCelkoveOpakovani = (zaznamy: ZaznamVykonu[], cviceni: Cviceni[]): number => {
  const dnesniZaznamy = zaznamy.filter(zaznam => jeDnes(zaznam.datumCas));
  
  return dnesniZaznamy.reduce((celkem, zaznam) => {
    const cviceniData = cviceni.find(c => c.id === zaznam.cviceniId);
    if (cviceniData && cviceniData.typMereni === 'opakovani') {
      return celkem + zaznam.hodnota;
    }
    return celkem;
  }, 0);
};

/** Vypočítá celkový čas za dnešní den v sekundách */
export const dnesniCelkovyCas = (zaznamy: ZaznamVykonu[], cviceni: Cviceni[]): number => {
  const dnesniZaznamy = zaznamy.filter(zaznam => jeDnes(zaznam.datumCas));
  
  return dnesniZaznamy.reduce((celkem, zaznam) => {
    const cviceniData = cviceni.find(c => c.id === zaznam.cviceniId);
    if (cviceniData && cviceniData.typMereni === 'cas') {
      return celkem + zaznam.hodnota;
    }
    return celkem;
  }, 0);
};

/** Vypočítá celkový progress všech nastavených cílů */
export const vypocitatCelkovyProgress = (zaznamy: ZaznamVykonu[], cviceni: Cviceni[]): CelkovyProgress => {
  // Filtrujeme pouze cvičení s nastaveným cílem
  const cviceniSCilem = cviceni.filter(c => c.denniCil && c.denniCil > 0);
  
  if (cviceniSCilem.length === 0) {
    return {
      splneneCile: 0,
      celkemCilu: 0,
      celkoveProcenta: 0,
      detaily: {
        opakovani: { splneno: 0, celkemCilu: 0, procenta: 0 },
        cas: { splneno: 0, celkemCilu: 0, procenta: 0 }
      }
    };
  }

  // Získáme dnešní záznamy
  const dnesniZaznamy = zaznamy.filter(zaznam => jeDnes(zaznam.datumCas));
  
  let splneneCile = 0;
  let celkemProcentOpakovani = 0;
  let celkemProcentCas = 0;
  let pocetOpakovaniCilu = 0;
  let pocetCasovychCilu = 0;
  let splneneOpakovani = 0;
  let splneneCasovky = 0;

  cviceniSCilem.forEach(cviceni => {
    // Najdeme dnešní záznamy pro toto cvičení
    const dnesniZaznamyCviceni = dnesniZaznamy.filter(z => z.cviceniId === cviceni.id);
    
    let dnesniVykon = 0;
    if (cviceni.typMereni === 'opakovani') {
      // Pro opakování sčítáme všechny hodnoty
      dnesniVykon = dnesniZaznamyCviceni.reduce((sum, z) => sum + z.hodnota, 0);
    } else {
      // Pro čas bereme nejlepší výkon podle směrování
      if (dnesniZaznamyCviceni.length > 0) {
        if (cviceni.smerovani === 'kratsi_lepsi') {
          dnesniVykon = Math.min(...dnesniZaznamyCviceni.map(z => z.hodnota));
        } else {
          dnesniVykon = Math.max(...dnesniZaznamyCviceni.map(z => z.hodnota));
        }
      }
    }

    // Vypočítáme procenta splnění
    const procenta = cviceni.denniCil ? Math.min((dnesniVykon / cviceni.denniCil) * 100, 100) : 0;
    
    // Počítáme podle typu
    if (cviceni.typMereni === 'opakovani') {
      pocetOpakovaniCilu++;
      celkemProcentOpakovani += procenta;
      if (procenta >= 100) splneneOpakovani++;
    } else {
      pocetCasovychCilu++;
      celkemProcentCas += procenta;
      if (procenta >= 100) splneneCasovky++;
    }

    // Celkově splněné cíle
    if (procenta >= 100) splneneCile++;
  });

  // Průměrné procenta podle typu
  const prumerneProcentaOpakovani = pocetOpakovaniCilu > 0 ? celkemProcentOpakovani / pocetOpakovaniCilu : 0;
  const prumerneProcentaCas = pocetCasovychCilu > 0 ? celkemProcentCas / pocetCasovychCilu : 0;
  
  // Celkové procenta (vážený průměr)
  const celkoveProcenta = cviceniSCilem.length > 0 
    ? (celkemProcentOpakovani + celkemProcentCas) / cviceniSCilem.length 
    : 0;

  return {
    splneneCile,
    celkemCilu: cviceniSCilem.length,
    celkoveProcenta,
    detaily: {
      opakovani: {
        splneno: splneneOpakovani,
        celkemCilu: pocetOpakovaniCilu,
        procenta: prumerneProcentaOpakovani
      },
      cas: {
        splneno: splneneCasovky,
        celkemCilu: pocetCasovychCilu,
        procenta: prumerneProcentaCas
      }
    }
  };
}; 