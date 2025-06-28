/** Typ měření pro cvičení - buď opakování nebo čas */
export type TypMereni = 'opakovani' | 'cas';

/** Směrování pro lepší výkon - kratší čas je lepší nebo delší čas je lepší */
export type Smerovani = 'kratsi_lepsi' | 'delsi_lepsi';

/** Základní interface pro cvičení */
export interface Cviceni {
  id: string;
  nazev: string;
  typMereni: TypMereni;
  smerovani?: Smerovani; // pouze pro typ 'cas'
  vytvorenoKdy: Date;
  maNastavenCil: boolean; // Nové: Indikuje, zda má cvičení aktivní denní cíl
  denniCil: number; // Nové: Hodnota denního cíle (opakování nebo sekundy)
  barva: string; // Nové: Barevný kód pro vizuální odlišení
}

/** Záznam o výkonu cvičení */
export interface ZaznamVykonu {
  id: string;
  cviceniId: string;
  hodnota: number; // počet opakování nebo čas v sekundách
  datumCas: Date;
}

/** Statistiky pro konkrétní cvičení */
export interface StatistikyCviceni {
  cviceniId: string;
  pocetZaznamu: number;
  nejlepsiVykon: number;
  prumernyVykon: number;
  posledniVykon?: number;
  trend: 'vzestupny' | 'klesajici' | 'stabilni';
}

/** Typy pro parametry v React Navigation */

// Spodní Tab Navigátor
export type TabParamList = {
  Opakovani: undefined;
  Casovky: undefined;
  Prehled: undefined;
};

// Hlavní Stack Navigátor - definuje obrazovky mimo taby
export type RootStackParamList = {
  HlavniTaby: undefined; // Odkazuje na celý Tab Navigator
  PridatCviceni: { vychoziTyp: 'opakovani' | 'cas' };
  DetailCviceni: { cviceniId: string };
}; 