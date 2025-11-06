import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { NastaveniNotifikaci } from '../utils/notifikace/types';
import { ukladaniDat } from '../utils/ukladaniDat';
import { naplanovatPripominky, ziskatOpravneni, zrusitVsechnyPripominky } from '../utils/notifikace/scheduler';
import { useLanguage } from './LanguageContext';

interface NotificationContextInterface {
  nastaveni: NastaveniNotifikaci;
  nacitaSe: boolean;
  opravneni: boolean | null; // null = ještě nezjištěno, true/false = výsledek
  nastavitNastaveni: (nastaveni: NastaveniNotifikaci) => Promise<void>;
  ziskatOpravneni: () => Promise<boolean>;
  nacistNastaveni: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextInterface | null>(null);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [nastaveni, setNastaveni] = useState<NastaveniNotifikaci>({
    povolene: false,
    casPripominky: ['08:00', '18:00'],
  });
  const [nacitaSe, setNacitaSe] = useState(true);
  const [opravneni, setOpravneni] = useState<boolean | null>(null);
  const { currentLanguage } = useLanguage();

  /** Načte nastavení z úložiště */
  const nacistNastaveni = useCallback(async () => {
    setNacitaSe(true);
    try {
      const nacteneNastaveni = await ukladaniDat.nacistNastaveniNotifikaci();
      setNastaveni(nacteneNastaveni);
      
      // Pokud jsou notifikace povolené, naplánujeme je
      if (nacteneNastaveni.povolene && currentLanguage) {
        await naplanovatPripominky(nacteneNastaveni, currentLanguage);
      }
    } catch (error) {
      console.error('Chyba při načítání nastavení notifikací:', error);
    } finally {
      setNacitaSe(false);
    }
  }, [currentLanguage]);

  /** Uloží nové nastavení */
  const nastavitNastaveni = useCallback(async (noveNastaveni: NastaveniNotifikaci) => {
    try {
      await ukladaniDat.ulozitNastaveniNotifikaci(noveNastaveni);
      setNastaveni(noveNastaveni);
      
      // Naplánujeme notifikace podle nového nastavení
      if (noveNastaveni.povolene && currentLanguage) {
        await naplanovatPripominky(noveNastaveni, currentLanguage);
      } else {
        // Pokud jsou vypnuté, zrušíme všechny naplánované
        await zrusitVsechnyPripominky();
      }
    } catch (error) {
      console.error('Chyba při ukládání nastavení notifikací:', error);
      throw error;
    }
  }, [currentLanguage]);

  /** Získá oprávnění k notifikacím */
  const ziskatOpravneniHandler = useCallback(async (): Promise<boolean> => {
    const maOpravneni = await ziskatOpravneni();
    setOpravneni(maOpravneni);
    return maOpravneni;
  }, []);

  // Načteme nastavení při startu
  useEffect(() => {
    nacistNastaveni();
  }, [nacistNastaveni]);

  // Zkontrolujeme oprávnění při startu
  useEffect(() => {
    ziskatOpravneniHandler();
  }, [ziskatOpravneniHandler]);

  // Aktualizujeme notifikace při změně jazyka
  useEffect(() => {
    if (currentLanguage && nastaveni.povolene) {
      naplanovatPripominky(nastaveni, currentLanguage);
    }
  }, [currentLanguage, nastaveni.povolene]);

  const hodnota: NotificationContextInterface = {
    nastaveni,
    nacitaSe,
    opravneni,
    nastavitNastaveni,
    ziskatOpravneni: ziskatOpravneniHandler,
    nacistNastaveni,
  };

  return (
    <NotificationContext.Provider value={hodnota}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextInterface => {
  const kontext = useContext(NotificationContext);
  if (!kontext) {
    throw new Error('useNotifications musí být použito uvnitř NotificationProvider');
  }
  return kontext;
};

