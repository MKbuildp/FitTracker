import { ValidationError } from '../types/types';

/** Validace formuláře pro přidání cvičení */
export const validateForm = (nazev: string, t: any): string | null => {
  if (!nazev.trim()) {
    return t('addExercise.nameRequiredError');
  }
  if (nazev.trim().length < 2) {
    return t('error.nameMinLength');
  }
  return null;
};

/** Výpočet denního cíle v sekundách pro čas */
export const vypocitatDenniCilCas = (minuty: number, sekundy: number): number => {
  return minuty * 60 + sekundy;
};

/** Formátování času pro zobrazení */
export const formatovatCas = (minuty: number, sekundy: number): string => {
  return `${minuty.toString().padStart(2, '0')}:${sekundy.toString().padStart(2, '0')}`;
};

/** Bezpečná změna číselné hodnoty s limity */
export const bezpecnaZmenaHodnoty = (
  aktualniHodnota: number, 
  zmena: number, 
  min: number, 
  max: number
): number => {
  return Math.max(min, Math.min(max, aktualniHodnota + zmena));
};

/** Bezpečná změna sekund s přenosem do minut */
export const zmenitSekundyBezpecne = (
  sekundy: number,
  minuty: number,
  zmena: number,
  setMinuty: (minuty: number) => void
): number => {
  let noveSekundy = sekundy + zmena;
  let noveMinuty = minuty;

  // Pokud sekundy přesáhnou 59, přidej minutu
  if (noveSekundy >= 60) {
    noveMinuty = Math.min(99, minuty + Math.floor(noveSekundy / 60));
    noveSekundy = noveSekundy % 60;
  }
  
  // Pokud sekundy klesnou pod 0, odeber minutu
  if (noveSekundy < 0 && minuty > 0) {
    noveMinuty = Math.max(0, minuty - 1);
    noveSekundy = 59;
  } else if (noveSekundy < 0) {
    noveSekundy = 0;
  }

  setMinuty(noveMinuty);
  return noveSekundy;
};

 