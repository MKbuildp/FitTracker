import { Cviceni, ZaznamVykonu } from '../../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types';

/** Navigační typ pro Casovky */
export type CasovkyNavigationProp = NativeStackNavigationProp<RootStackParamList>;

/** Props pro CasovkaPolozka komponentu */
export interface CasovkaPolozkaProps {
  cviceni: Cviceni;
  zaznamy: ZaznamVykonu[];
  navigation: CasovkyNavigationProp;
}

/** Props pro komponenty stavů */
export interface StavKomponentaProps {
  // Zatím žádné specifické props
} 