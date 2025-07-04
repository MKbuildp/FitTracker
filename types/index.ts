/** Exercise measurement type - either repetitions or time */
export type TypMereni = 'opakovani' | 'cas';

/** Direction for better performance - shorter time is better or longer time is better */
export type SmerovaniVykonu = 'kratsi_lepsi' | 'delsi_lepsi';

/** Basic interface for exercise */
export interface Cviceni {
  id: string;
  nazev: string;
  typMereni: TypMereni;
  smerovani: SmerovaniVykonu;
  vytvorenoKdy: Date;
  maNastavenCil: boolean; // New: Indicates if exercise has active daily goal
  denniCil: number; // New: Daily goal value (repetitions or seconds)
  barva: string; // New: Color code for visual distinction
}

/** Exercise performance record */
export interface ZaznamVykonu {
  id: string;
  cviceniId: string;
  datumCas: Date;
  hodnota: number; // number of repetitions or time in seconds
}

/** Statistics for specific exercise */
export interface StatistikyCviceni {
  celkemZaznamu: number;
  nejlepsiVykon: number | null;
  posledniVykon: number | null;
  prumernyVykon: number | null;
  trentydenZaznamu: number;
  celkemCasu: number; // v sekundach
  celkemOpakovani: number;
}

// Navigation types
export type TabNavigatorParamList = {
  Prehled: undefined;
  Opakovani: undefined;
  Casovky: undefined;
};

// Bottom Tab Navigator
export type BottomTabParamList = {
  Prehled: undefined;
  Opakovani: undefined;
  Casovky: undefined;
};

// Main Stack Navigator - defines screens outside tabs
export type RootStackParamList = {
  HlavniTaby: undefined; // References the entire Tab Navigator
  PridatCviceni: { vychoziTyp: TypMereni };
  DetailCviceni: { cviceniId: string };
  LanguageSelection: undefined;
}; 