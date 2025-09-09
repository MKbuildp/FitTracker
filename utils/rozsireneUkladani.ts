import * as FileSystem from 'expo-file-system';

/**
 * Rozšířené úložiště pro větší množství dat
 */
export const rozsireneUkladani = {
  /** Uložit data do souboru */
  async ulozitDoSouboru(nazevSouboru: string, data: any): Promise<void> {
    try {
      const cesta = `${FileSystem.documentDirectory}${nazevSouboru}`;
      const jsonData = JSON.stringify(data);
      await FileSystem.writeAsStringAsync(cesta, jsonData);
    } catch (error) {
      console.error('Chyba při ukládání souboru:', error);
      throw error;
    }
  },

  /** Načíst data ze souboru */
  async nacistZeSouboru(nazevSouboru: string): Promise<any> {
    try {
      const cesta = `${FileSystem.documentDirectory}${nazevSouboru}`;
      const existuje = await FileSystem.getInfoAsync(cesta);
      
      if (!existuje.exists) {
        return null;
      }

      const jsonData = await FileSystem.readAsStringAsync(cesta);
      return JSON.parse(jsonData);
    } catch (error) {
      console.error('Chyba při načítání souboru:', error);
      return null;
    }
  },

  /** Smazat soubor */
  async smazatSoubor(nazevSouboru: string): Promise<void> {
    try {
      const cesta = `${FileSystem.documentDirectory}${nazevSouboru}`;
      await FileSystem.deleteAsync(cesta);
    } catch (error) {
      console.error('Chyba při mazání souboru:', error);
      throw error;
    }
  },

  /** Získat informace o úložišti */
  async ziskatInfoOUlozisti(): Promise<{
    dostupneMisto: number;
    pouziteMisto: number;
  }> {
    try {
      const info = await FileSystem.getFreeDiskStorageAsync();
      return {
        dostupneMisto: info,
        pouziteMisto: 0, // Expo neposkytuje tuto informaci
      };
    } catch (error) {
      console.error('Chyba při získávání informací o úložišti:', error);
      return { dostupneMisto: 0, pouziteMisto: 0 };
    }
  }
};


