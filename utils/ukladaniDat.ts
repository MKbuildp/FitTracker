import AsyncStorage from '@react-native-async-storage/async-storage';
import { Cviceni, ZaznamVykonu } from '../types';

const KLICE = {
  CVICENI: '@cviceni_app_cviceni',
  ZAZNAMY: '@cviceni_app_zaznamy',
};

/** Utility pro ukládání a načítání dat */
export const ukladaniDat = {
  /** Uložení seznamu cvičení */
  async ulozitCviceni(cviceni: Cviceni[]): Promise<void> {
    try {
      const cviceniJson = JSON.stringify(cviceni.map(c => ({
        ...c,
        vytvorenoKdy: c.vytvorenoKdy.toISOString(),
      })));
      await AsyncStorage.setItem(KLICE.CVICENI, cviceniJson);
    } catch (error) {
      console.error('Chyba při ukládání cvičení:', error);
      throw error;
    }
  },

  /** Načtení seznamu cvičení */
  async nacistCviceni(): Promise<Cviceni[]> {
    try {
      const cviceniJson = await AsyncStorage.getItem(KLICE.CVICENI);
      if (!cviceniJson) return [];
      
      const parsovana = JSON.parse(cviceniJson);
      return parsovana.map((c: any) => ({
        ...c,
        vytvorenoKdy: new Date(c.vytvorenoKdy),
      }));
    } catch (error) {
      console.error('Chyba při načítání cvičení:', error);
      return [];
    }
  },

  /** Uložení záznamů výkonů */
  async ulozitZaznamy(zaznamy: ZaznamVykonu[]): Promise<void> {
    try {
      const zaznamyJson = JSON.stringify(zaznamy.map(z => ({
        ...z,
        datumCas: z.datumCas.toISOString(),
      })));
      await AsyncStorage.setItem(KLICE.ZAZNAMY, zaznamyJson);
    } catch (error) {
      console.error('Chyba při ukládání záznamů:', error);
      throw error;
    }
  },

  /** Načtení záznamů výkonů */
  async nacistZaznamy(): Promise<ZaznamVykonu[]> {
    try {
      const zaznamyJson = await AsyncStorage.getItem(KLICE.ZAZNAMY);
      if (!zaznamyJson) return [];
      
      const parsovane = JSON.parse(zaznamyJson);
      return parsovane.map((z: any) => ({
        ...z,
        datumCas: new Date(z.datumCas),
      }));
    } catch (error) {
      console.error('Chyba při načítání záznamů:', error);
      return [];
    }
  },

  /** Vymazání všech dat */
  async vymazatVsechnaData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([KLICE.CVICENI, KLICE.ZAZNAMY]);
    } catch (error) {
      console.error('Chyba při mazání dat:', error);
      throw error;
    }
  },
}; 