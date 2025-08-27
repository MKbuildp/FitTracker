import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { Cviceni, ZaznamVykonu } from '../types';
import { ukladaniDat } from '../utils/ukladaniDat';
import { useLanguage } from './LanguageContext';

/** Stav aplikace pro cvičení */
interface CviceniStav {
  cviceni: Cviceni[];
  zaznamy: ZaznamVykonu[];
  nacitaSeData: boolean;
  nastaveniCilu: {
    cilOpakovani: number;      // Cíl pro celkový počet opakování za den
    cilDokoncenaCviceni: number; // Cíl pro počet dokončených cvičení za den
  };
}

/** Akce pro reducer */
type CviceniAkce =
  | { typ: 'NASTAVIT_CVICENI'; cviceni: Cviceni[] }
  | { typ: 'PRIDAT_CVICENI'; cviceni: Cviceni }
  | { typ: 'UPRAVIT_CVICENI'; cviceni: Cviceni }
  | { typ: 'SMAZAT_CVICENI'; cviceniId: string }
  | { typ: 'NASTAVIT_ZAZNAMY'; zaznamy: ZaznamVykonu[] }
  | { typ: 'PRIDAT_ZAZNAM'; zaznam: ZaznamVykonu }
  | { typ: 'SMAZAT_ZAZNAM'; zaznamId: string }
  | { typ: 'NASTAVIT_NACITANI'; nacita: boolean }
  | { typ: 'NASTAV_DENNI_CIL'; payload: { cviceniId: string; cil: number } }
  | { typ: 'UPRAVIT_BARVU_CVICENI'; payload: { cviceniId: string; barva: string } }
  | { typ: 'NACIST_DATA'; cviceni: Cviceni[]; zaznamy: ZaznamVykonu[] }
  | { typ: 'NASTAVIT_CIL_OPAKOVANI'; cil: number }
  | { typ: 'NASTAVIT_CIL_DOKONCENA_CVICENI'; cil: number };

/** Počáteční stav */
const pocatecniStav: CviceniStav = {
  cviceni: [],
  zaznamy: [],
  nacitaSeData: false,
  nastaveniCilu: {
    cilOpakovani: 50,      // Výchozí cíl: 50 opakování za den
    cilDokoncenaCviceni: 3, // Výchozí cíl: 3 cvičení za den
  },
};

/**
 * Vytvoří ukázková cvičení podle zvoleného jazyka
 */
const vytvorUkazkovaCviceni = (language: 'cs' | 'en'): Cviceni[] => {
  const nazev1 = language === 'cs' ? 'Dřepy' : 'Squats';
  const nazev2 = language === 'cs' ? 'Plank' : 'Plank';
  
  const ted = new Date();
  
  return [
    {
      id: '1',
      nazev: nazev1,
      typMereni: 'opakovani',
      smerovani: 'delsi_lepsi',
      vytvorenoKdy: ted,
      denniCil: 20,
      barva: '#3b82f6', // Modrá
      maNastavenCil: true,
    },
    {
      id: '2',
      nazev: nazev2,
      typMereni: 'cas',
      smerovani: 'delsi_lepsi',
      vytvorenoKdy: ted,
      denniCil: 20, // 20 sekund
      barva: '#10b981', // Smaragdová
      maNastavenCil: true,
    }
  ];
};

/** Reducer pro správu stavu */
function cviceniReducer(stav: CviceniStav, akce: CviceniAkce): CviceniStav {
  switch (akce.typ) {
    case 'NASTAVIT_CVICENI':
      return { ...stav, cviceni: akce.cviceni };
    case 'PRIDAT_CVICENI':
      return { ...stav, cviceni: [...stav.cviceni, akce.cviceni] };
    case 'UPRAVIT_CVICENI':
      return {
        ...stav,
        cviceni: stav.cviceni.map(c => 
          c.id === akce.cviceni.id ? akce.cviceni : c
        ),
      };
    case 'SMAZAT_CVICENI':
      return {
        ...stav,
        cviceni: stav.cviceni.filter(c => c.id !== akce.cviceniId),
        zaznamy: stav.zaznamy.filter(z => z.cviceniId !== akce.cviceniId),
      };
    case 'NASTAV_DENNI_CIL':
      return {
        ...stav,
        cviceni: stav.cviceni.map(c =>
          c.id === akce.payload.cviceniId
            ? { ...c, denniCil: akce.payload.cil, maNastavenCil: true }
            : c
        ),
      };
    case 'UPRAVIT_BARVU_CVICENI':
      return {
        ...stav,
        cviceni: stav.cviceni.map(c =>
          c.id === akce.payload.cviceniId
            ? { ...c, barva: akce.payload.barva }
            : c
        ),
      };
    case 'NASTAVIT_ZAZNAMY':
      return { ...stav, zaznamy: akce.zaznamy };
    case 'PRIDAT_ZAZNAM':
      return { ...stav, zaznamy: [...stav.zaznamy, akce.zaznam] };
    case 'SMAZAT_ZAZNAM':
      return {
        ...stav,
        zaznamy: stav.zaznamy.filter(z => z.id !== akce.zaznamId),
      };
    case 'NASTAVIT_NACITANI':
      return { ...stav, nacitaSeData: akce.nacita };
    case 'NACIST_DATA':
      return { ...stav, cviceni: akce.cviceni, zaznamy: akce.zaznamy, nacitaSeData: false };
    case 'NASTAVIT_CIL_OPAKOVANI':
      return {
        ...stav,
        nastaveniCilu: {
          ...stav.nastaveniCilu,
          cilOpakovani: akce.cil,
        },
      };
      
    case 'NASTAVIT_CIL_DOKONCENA_CVICENI':
      return {
        ...stav,
        nastaveniCilu: {
          ...stav.nastaveniCilu,
          cilDokoncenaCviceni: akce.cil,
        },
      };
    default:
      return stav;
  }
}

/** Interface pro kontext */
interface CviceniContextInterface {
  stav: CviceniStav;
  pridatCviceni: (cviceni: Omit<Cviceni, 'id' | 'vytvorenoKdy' | 'maNastavenCil' | 'barva'> & { denniCil?: number; vybranaBarva?: string | null }) => Promise<void>;
  upravitCviceni: (cviceni: Cviceni) => Promise<void>;
  smazatCviceni: (cviceniId: string) => Promise<void>;
  pridatZaznam: (zaznam: Omit<ZaznamVykonu, 'id' | 'datumCas'>) => Promise<void>;
  smazatZaznam: (zaznamId: string) => Promise<void>;
  ziskatZaznamyProCviceni: (cviceniId: string) => ZaznamVykonu[];
  nastavitDenniCil: (cviceniId: string, cil: number) => Promise<void>;
  upravitBarvuCviceni: (cviceniId: string, barva: string) => Promise<void>;
  resetovatData: () => Promise<void>;
  nacistData: () => Promise<void>;
  
  // Nové nastavení cílů
  nastaveniCilu: {
    cilOpakovani: number;      // Cíl pro celkový počet opakování za den
    cilDokoncenaCviceni: number; // Cíl pro počet dokončených cvičení za den
  };
  
  nastavitCilOpakovani: (cil: number) => Promise<void>;
  nastavitCilDokoncenaCviceni: (cil: number) => Promise<void>;
  nastavitCileNajednou: (cilOpakovani: number, cilDokoncenaCviceni: number) => Promise<void>;
}

/** Kontext */
const CviceniContext = createContext<CviceniContextInterface | null>(null);

/** Rozšířená paleta 14 barev pro automatické přiřazení */
const PALETA_BAREV = [
  // První řádek - původní barvy
  '#3b82f6', // Modrá
  '#10b981', // Smaragdová
  '#f97316', // Oranžová
  '#8b5cf6', // Fialová
  '#ec4899', // Růžová
  '#06b6d4', // Azurová
  '#f59e0b', // Jantarová
  // Druhý řádek - nové barvy
  '#ef4444', // Červená
  '#22c55e', // Zelená
  '#6366f1', // Indigo
  '#a855f7', // Purpurová
  '#f43f5e', // Rose
  '#14b8a6', // Teal
  '#f97416', // Orange
];

/** Provider komponenta */
export const CviceniProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stav, dispatch] = useReducer(cviceniReducer, pocatecniStav);
  const { currentLanguage } = useLanguage();

  // Načítání dat při spuštění
  const nacistData = useCallback(async () => {
    dispatch({ typ: 'NASTAVIT_NACITANI', nacita: true });
    try {
      const [cviceni, zaznamy, nastaveniCilu] = await Promise.all([
        ukladaniDat.nacistCviceni(),
        ukladaniDat.nacistZaznamy(),
        ukladaniDat.nacistNastaveniCilu()
      ]);
      
      // Pokud není žádné cvičení, vytvořit ukázková podle jazyka
      if (cviceni.length === 0) {
        const ukazkovaCviceni = vytvorUkazkovaCviceni(currentLanguage);
        await ukladaniDat.ulozitCviceni(ukazkovaCviceni);
        dispatch({ typ: 'NACIST_DATA', cviceni: ukazkovaCviceni, zaznamy });
      } else {
        dispatch({ typ: 'NACIST_DATA', cviceni, zaznamy });
      }
      
      // Nastavit načtené cíle
      dispatch({ typ: 'NASTAVIT_CIL_OPAKOVANI', cil: nastaveniCilu.cilOpakovani });
      dispatch({ typ: 'NASTAVIT_CIL_DOKONCENA_CVICENI', cil: nastaveniCilu.cilDokoncenaCviceni });
    } catch (error) {
      console.error('Chyba při načítání dat:', error);
      // Fallback na ukázková cvičení při chybě
      const ukazkovaCviceni = vytvorUkazkovaCviceni(currentLanguage);
      dispatch({ typ: 'NACIST_DATA', cviceni: ukazkovaCviceni, zaznamy: [] });
    }
  }, [currentLanguage]);

  useEffect(() => {
    // Načti data pouze pokud jazyk již byl nastaven (není první spuštění)
    if (currentLanguage) {
      nacistData();
    }
  }, [nacistData, currentLanguage]);

  /** Přidání nového cvičení */
  const pridatCviceni = async (noveCviceni: Omit<Cviceni, 'id' | 'vytvorenoKdy' | 'maNastavenCil' | 'barva'> & { denniCil?: number; vybranaBarva?: string | null }) => {
    // Použití vybrané barvy nebo automatické přiřazení barvy z palety
    const novaBarva = noveCviceni.vybranaBarva || PALETA_BAREV[stav.cviceni.length % PALETA_BAREV.length];
    
    const denniCil = noveCviceni.denniCil || 0;
    const maNastavenCil = denniCil > 0;
    
    const cviceni: Cviceni = {
      nazev: noveCviceni.nazev,
      typMereni: noveCviceni.typMereni,
      smerovani: noveCviceni.smerovani,
      id: Date.now().toString(),
      vytvorenoKdy: new Date(),
      maNastavenCil,
      denniCil,
      barva: novaBarva,
    };

    dispatch({ typ: 'PRIDAT_CVICENI', cviceni });
    await ukladaniDat.ulozitCviceni([...stav.cviceni, cviceni]);
  };

  /** Úprava existujícího cvičení */
  const upravitCviceni = async (cviceni: Cviceni) => {
    dispatch({ typ: 'UPRAVIT_CVICENI', cviceni });
    const novyCviceniSeznam = stav.cviceni.map(c => 
      c.id === cviceni.id ? cviceni : c
    );
    await ukladaniDat.ulozitCviceni(novyCviceniSeznam);
  };

  /** Smazání cvičení */
  const smazatCviceni = async (cviceniId: string) => {
    dispatch({ typ: 'SMAZAT_CVICENI', cviceniId });
    const novyCviceniSeznam = stav.cviceni.filter(c => c.id !== cviceniId);
    const noveZaznamy = stav.zaznamy.filter(z => z.cviceniId !== cviceniId);
    
    await ukladaniDat.ulozitCviceni(novyCviceniSeznam);
    await ukladaniDat.ulozitZaznamy(noveZaznamy);
  };

  /** Přidání nového záznamu */
  const pridatZaznam = async (novyZaznam: Omit<ZaznamVykonu, 'id' | 'datumCas'>) => {
    const zaznam: ZaznamVykonu = {
      ...novyZaznam,
      id: Date.now().toString(),
      datumCas: new Date(),
    };

    dispatch({ typ: 'PRIDAT_ZAZNAM', zaznam });
    await ukladaniDat.ulozitZaznamy([...stav.zaznamy, zaznam]);
  };

  /** Smazání záznamu */
  const smazatZaznam = async (zaznamId: string) => {
    dispatch({ typ: 'SMAZAT_ZAZNAM', zaznamId });
    const noveZaznamy = stav.zaznamy.filter(z => z.id !== zaznamId);
    await ukladaniDat.ulozitZaznamy(noveZaznamy);
  };

  /** Nastavení denního cíle pro cvičení */
  const nastavitDenniCil = async (cviceniId: string, cil: number) => {
    dispatch({ typ: 'NASTAV_DENNI_CIL', payload: { cviceniId, cil } });
    const novyCviceniSeznam = stav.cviceni.map(c =>
      c.id === cviceniId ? { ...c, denniCil: cil, maNastavenCil: true } : c
    );
    await ukladaniDat.ulozitCviceni(novyCviceniSeznam);
  };

  /** Změna barvy existujícího cvičení */
  const upravitBarvuCviceni = async (cviceniId: string, barva: string) => {
    dispatch({ typ: 'UPRAVIT_BARVU_CVICENI', payload: { cviceniId, barva } });
    const novyCviceniSeznam = stav.cviceni.map(c =>
      c.id === cviceniId ? { ...c, barva } : c
    );
    await ukladaniDat.ulozitCviceni(novyCviceniSeznam);
  };

  /** Získání záznamů pro konkrétní cvičení */
  const ziskatZaznamyProCviceni = (cviceniId: string): ZaznamVykonu[] => {
    return stav.zaznamy
      .filter(z => z.cviceniId === cviceniId)
      .sort((a, b) => b.datumCas.getTime() - a.datumCas.getTime());
  };

  /** Resetování všech dat a vytvoření ukázkových cvičení */
  const resetovatData = async () => {
    try {
      // Vymaž všechna data z úložiště
      await ukladaniDat.vymazatVsechnaData();
      
      // Nastav ukázková cvičení
      const ukazkovaCviceni = vytvorUkazkovaCviceni(currentLanguage);
      await ukladaniDat.ulozitCviceni(ukazkovaCviceni);
      
      // Aktualizuj stav
      dispatch({ typ: 'NACIST_DATA', cviceni: ukazkovaCviceni, zaznamy: [] });
    } catch (error) {
      console.error('Chyba při resetování dat:', error);
      throw error;
    }
  };

  const hodnota: CviceniContextInterface = {
    stav,
    pridatCviceni,
    upravitCviceni,
    smazatCviceni,
    pridatZaznam,
    smazatZaznam,
    ziskatZaznamyProCviceni,
    nastavitDenniCil,
    upravitBarvuCviceni,
    resetovatData,
    nacistData,
    
    // Nové nastavení cílů
    nastaveniCilu: stav.nastaveniCilu,
    
    nastavitCilOpakovani: async (cil) => {
      // Nejprve uložit do AsyncStorage s aktuálními hodnotami
      await ukladaniDat.ulozitNastaveniCilu({
        cilOpakovani: cil,
        cilDokoncenaCviceni: stav.nastaveniCilu.cilDokoncenaCviceni
      });
      // Pak aktualizovat stav
      dispatch({ typ: 'NASTAVIT_CIL_OPAKOVANI', cil });
    },
    nastavitCilDokoncenaCviceni: async (cil) => {
      // Nejprve uložit do AsyncStorage s aktuálními hodnotami
      await ukladaniDat.ulozitNastaveniCilu({
        cilOpakovani: stav.nastaveniCilu.cilOpakovani,
        cilDokoncenaCviceni: cil
      });
      // Pak aktualizovat stav
      dispatch({ typ: 'NASTAVIT_CIL_DOKONCENA_CVICENI', cil });
    },
    nastavitCileNajednou: async (cilOpakovani, cilDokoncenaCviceni) => {
      // Uložit obě hodnoty současně do AsyncStorage
      await ukladaniDat.ulozitNastaveniCilu({
        cilOpakovani,
        cilDokoncenaCviceni
      });
      // Pak aktualizovat stav - obě hodnoty najednou
      dispatch({ typ: 'NASTAVIT_CIL_OPAKOVANI', cil: cilOpakovani });
      dispatch({ typ: 'NASTAVIT_CIL_DOKONCENA_CVICENI', cil: cilDokoncenaCviceni });
    },
  };

  return <CviceniContext.Provider value={hodnota}>{children}</CviceniContext.Provider>;
};

/** Hook pro použití kontextu */
export const useCviceni = (): CviceniContextInterface => {
  const kontext = useContext(CviceniContext);
  if (!kontext) {
    throw new Error('useCviceni musí být použito uvnitř CviceniProvider');
  }
  return kontext;
}; 