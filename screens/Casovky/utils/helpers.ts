import { Cviceni } from '../../../types';

/** Filtruje cvičení na pouze časová */
export const filtrovatCasovky = (cviceni: Cviceni[]): Cviceni[] => {
  return cviceni.filter(c => c.typMereni === 'cas');
};

/** Kontroluje, zda jsou data načítána */
export const jeNacitaSeData = (nacitaSeData: boolean): boolean => {
  return nacitaSeData;
};

/** Kontroluje, zda je seznam prázdný */
export const jeSeznamPrazdny = (casovky: Cviceni[]): boolean => {
  return casovky.length === 0;
}; 