import { Cviceni, ZaznamVykonu } from '../../../types';


/** Data pro jeden den v kalendáři */
export interface DenniData {
  datum: Date;
  splneneCile: number;
  celkoveCile: number;
  dokoncenaCviceni: number;
  celkovaOpakovani: number;
}

/** Základní metriky pro zobrazení */
export interface KalendarMetriky {
  progressCilu: number;      // procenta splnění všech cílů (0-100)
  dokoncenaCviceni: number; // počet dokončených cvičení za den
  celkovaOpakovani: number; // suma všech opakování za den
}

/** Props pro KalendarHeader komponentu */
export interface KalendarHeaderProps {
  vybranyDatum: Date;
  onDatumZmena: (datum: Date) => void;
}

/** Props pro KalendarMetriky komponentu */
export interface KalendarMetrikyProps {
  denniData: DenniData;
}