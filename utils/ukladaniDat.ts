import AsyncStorage from '@react-native-async-storage/async-storage';
import { Cviceni, ZaznamVykonu } from '../types';

const KLICE = {
  CVICENI: 'cviceni',
  ZAZNAMY: 'zaznamy'
};

/** Utility for data storage and loading */
export const ukladaniDat = {
  /** Save exercise list */
  async ulozitCviceni(cviceni: Cviceni[]): Promise<void> {
    try {
      const cviceniJson = JSON.stringify(cviceni.map(c => ({
        ...c,
        vytvorenoKdy: c.vytvorenoKdy.toISOString(),
      })));
      await AsyncStorage.setItem(KLICE.CVICENI, cviceniJson);
    } catch (error) {
      console.error('Error saving exercises:', error);
    }
  },

  /** Load exercise list */
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
      console.error('Error loading exercises:', error);
      return [];
    }
  },

  /** Save performance records */
  async ulozitZaznamy(zaznamy: ZaznamVykonu[]): Promise<void> {
    try {
      const zaznamyJson = JSON.stringify(zaznamy.map(z => ({
        ...z,
        datumCas: z.datumCas.toISOString(),
      })));
      await AsyncStorage.setItem(KLICE.ZAZNAMY, zaznamyJson);
    } catch (error) {
      console.error('Error saving records:', error);
    }
  },

  /** Load performance records */
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
      console.error('Error loading records:', error);
      return [];
    }
  },

  /** Delete all data */
  async vymazatVsechnaData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([KLICE.CVICENI, KLICE.ZAZNAMY]);
    } catch (error) {
      console.error('Error deleting data:', error);
      throw error;
    }
  },
}; 