import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ReactNode } from 'react';
import { Cviceni, ZaznamVykonu, RootStackParamList } from '../../../types';

/** Typ pro navigaci v PrehledScreen */
export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;



/** Props pro CelkoveStatistiky komponentu */
export interface CelkoveStatistikyProps {
  zaznamy: ZaznamVykonu[];
  cviceni: Cviceni[];
}

/** Props pro PrehledCviceni komponentu */
export interface PrehledCviceniProps {
  zaznamy: ZaznamVykonu[];
  cviceni: Cviceni[];
  navigation: NavigationProp;
  statistiky?: ReactNode;
}

/** Props pro CviceniKarta komponentu */
export interface CviceniKartaProps {
  cviceni: Cviceni;
  zaznamy: ZaznamVykonu[];
  navigation: NavigationProp;
}

/** Props pro PrazdnyStav komponentu */
export interface PrazdnyStavProps {
  navigation: NavigationProp;
}

/** Statistiky pro jedno cvičení */
export interface StatistikyCviceni {
  pocetZaznamu: number;
  posledniVykon: ZaznamVykonu | null;
  nejlepsiVykon: number;
  prumernyVykon: number;
}

/** Props pro CelkovyProgressBar komponentu */
export interface CelkovyProgressBarProps {
  zaznamy: ZaznamVykonu[];
  cviceni: Cviceni[];
}

/** Detaily progressu podle typu cvičení */
export interface ProgressDetaily {
  opakovani: {
    splneno: number;
    celkemCilu: number;
    procenta: number;
  };
  cas: {
    splneno: number;
    celkemCilu: number;
    procenta: number;
  };
}

/** Výsledek výpočtu celkového progressu */
export interface CelkovyProgress {
  splneneCile: number;
  celkemCilu: number;
  celkoveProcenta: number;
  detaily: ProgressDetaily;
} 