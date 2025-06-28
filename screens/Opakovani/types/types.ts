import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Cviceni, ZaznamVykonu, RootStackParamList } from '../../../types';

/** Typ pro navigaci v OpakovaniScreen */
export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

/** Props pro KruhovyUkazatelPokroku komponentu */
export interface KruhovyUkazatelPokrokuProps {
  cviceni: Cviceni;
  zaznamy: ZaznamVykonu[];
}

/** Props pro InfoRadek komponentu */
export interface InfoRadekProps {
  cviceni: Cviceni;
  zaznamy: ZaznamVykonu[];
}

/** Props pro CviceniPolozka komponentu */
export interface CviceniPolozkaProps {
  cviceni: Cviceni;
  navigation: NavigationProp;
  zaznamy: ZaznamVykonu[];
}

/** Props pro PrazdnyStav komponentu */
export interface PrazdnyStavProps {
  // Žádné props potřeba - tlačítko je nyní v hlavičce
}

/** Props pro NacitaniStav komponentu */  
export interface NacitaniStavProps {
  // Žádné props potřeba
} 