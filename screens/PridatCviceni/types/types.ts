import { TypMereni, Smerovani } from '../../../types';

/** Stav formuláře pro přidání cvičení */
export interface FormularStav {
  nazev: string;
  typMereni: TypMereni;
  smerovani: Smerovani;
  ukladaSe: boolean;
  maCil: boolean;
  pocetOpakovani: number;
  minuty: number;
  sekundy: number;
}

/** Props pro komponenty formuláře */
export interface FormularProps {
  nazev: string;
  onNazevChange: (nazev: string) => void;
}

export interface TypMereniProps {
  typMereni: TypMereni;
}

export interface SmerovaniProps {
  typMereni: TypMereni;
  smerovani: Smerovani;
  onSmerovaniChange: (smerovani: Smerovani) => void;
}

export interface DenniCilProps {
  typMereni: TypMereni;
  maCil: boolean;
  onMaCilChange: (maCil: boolean) => void;
  pocetOpakovani: number;
  onPocetOpakovaniChange: (pocet: number) => void;
  minuty: number;
  onMinutyChange: (minuty: number) => void;
  sekundy: number;
  onSekundyChange: (sekundy: number) => void;
}

export interface TlacitkaProps {
  ukladaSe: boolean;
  onReset: () => void;
  onUlozit: () => void;
}

/** Return typ pro usePridatCviceni hook */
export interface PridatCviceniHook {
  // Stav
  nazev: string;
  typMereni: TypMereni;
  smerovani: Smerovani;
  ukladaSe: boolean;
  maCil: boolean;
  pocetOpakovani: number;
  minuty: number;
  sekundy: number;
  vybranaBarva: string | null;
  
  // Akce
  setNazev: (nazev: string) => void;
  setSmerovani: (smerovani: Smerovani) => void;
  setMaCil: (maCil: boolean) => void;
  zmenitOpakovani: (zmena: number) => void;
  zmenitMinuty: (zmena: number) => void;
  zmenitSekundy: (zmena: number) => void;
  setVybranaBarva: (barva: string | null) => void;
  resetForm: () => void;
  ulozitCviceni: () => Promise<void>;
}

/** Validační chyby */
export interface ValidationError {
  field: string;
  message: string;
} 