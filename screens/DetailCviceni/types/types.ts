import { Cviceni, ZaznamVykonu } from '../../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../types';

/** Typy specifické pro DetailCviceni obrazovku */

export type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'DetailCviceni'>;
export type RoutePropType = RouteProp<RootStackParamList, 'DetailCviceni'>;

export interface PridatOpakovaniProps {
  cviceni: Cviceni;
  onUlozit: (hodnota: number) => void;
  style?: any;
  zaznamy: ZaznamVykonu[];
  onSmazatZaznam: (zaznamId: string) => void;
}

export interface PridatCasProps {
  onUlozit: (hodnota: number) => void;
  style?: any;
  cviceni?: Cviceni;
  zaznamy: ZaznamVykonu[];
  onSmazatZaznam: (zaznamId: string) => void;
}

export interface TydenKontejnerProps {
  zaznamy: ZaznamVykonu[];
  cviceni: Cviceni;
  style?: any;
  statistiky: DetailStatistiky;
  formatovatHodnotu: (hodnota: number) => string;
  vsechnaCviceni: Cviceni[];
}

export interface ZaznamPolozkaProps {
  zaznam: ZaznamVykonu;
  cviceni: Cviceni;
}

export interface DetailStatistiky {
  pocetZaznamu: number;
  nejlepsiVykon: number;
  prumernyVykon: number;
  celkemHodnota: number;
  dnesniVykon: number;
}

export interface StatistikyKomponentaProps {
  cviceni: Cviceni;
  statistiky: DetailStatistiky;
  formatovatHodnotu: (hodnota: number) => string;
  zaznamy: ZaznamVykonu[];
}

export interface UseDetailCviceniState {
  jeModalViditelny: boolean;
  zaznamy: ZaznamVykonu[];
  statistiky: DetailStatistiky;
}

export interface UseDetailCviceniReturn {
  jeModalViditelny: boolean;
  setJeModalViditelny: (viditelny: boolean) => void;
  cviceni: Cviceni | undefined;
  zaznamy: ZaznamVykonu[];
  statistiky: DetailStatistiky;
  ulozitZaznam: (hodnota: number) => Promise<void>;
  potvrditSmazaniCviceni: () => void;
  zmenitBarvuCviceni: (barva: string) => Promise<void>;
  formatovatHodnotu: (hodnota: number) => string;
  smazatZaznamSPotvrzenim: (zaznamId: string) => void;
  vsechnaCviceni: Cviceni[];
} 