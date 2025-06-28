import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations, SupportedLanguage, TranslationKey, DEFAULT_LANGUAGE } from '../translations';

/**
 * Interface pro Language Context
 */
interface LanguageContextType {
  currentLanguage: SupportedLanguage;
  isLoading: boolean;
  isFirstTime: boolean;
  showWelcome: boolean;
  setLanguage: (language: SupportedLanguage) => Promise<void>;
  markWelcomeShown: () => Promise<void>;
  t: (key: TranslationKey) => string;
  availableLanguages: SupportedLanguage[];
}

/**
 * Klíče pro uložení v AsyncStorage
 */
const LANGUAGE_STORAGE_KEY = '@cviceni_app_language';
const WELCOME_SHOWN_KEY = '@cviceni_app_welcome_shown';

/**
 * Context pro správu jazyka
 */
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/**
 * Props pro LanguageProvider
 */
interface LanguageProviderProps {
  children: ReactNode;
}

/**
 * Provider pro správu jazyka aplikace
 */
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(DEFAULT_LANGUAGE);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  /**
   * Načtení uloženého jazyka z AsyncStorage při startu
   */
  useEffect(() => {
    loadSavedLanguage();
  }, []);

  /**
   * Načte uložený jazyk z AsyncStorage
   */
  const loadSavedLanguage = async () => {
    try {
      const [savedLanguage, welcomeShown] = await Promise.all([
        AsyncStorage.getItem(LANGUAGE_STORAGE_KEY),
        AsyncStorage.getItem(WELCOME_SHOWN_KEY)
      ]);
      
      if (savedLanguage && isValidLanguage(savedLanguage)) {
        setCurrentLanguage(savedLanguage as SupportedLanguage);
        setIsFirstTime(false);
        // Zobrazit welcome screen pokud ještě nebyl zobrazen
        setShowWelcome(!welcomeShown);
      } else {
        // Pokud není jazyk nastaven, je to první spuštění
        setIsFirstTime(true);
        setShowWelcome(false); // Welcome se zobrazí až po výběru jazyka
      }
    } catch (error) {
      console.warn('Nepodařilo se načíst uložený jazyk:', error);
      setIsFirstTime(true);
      setShowWelcome(false);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Kontrola, zda je jazyk podporovaný
   */
  const isValidLanguage = (language: string): boolean => {
    return Object.keys(translations).includes(language);
  };

  /**
   * Nastaví nový jazyk a uloží ho do AsyncStorage
   */
  const setLanguage = async (language: SupportedLanguage) => {
    try {
      setCurrentLanguage(language);
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      setIsFirstTime(false); // Po nastavení jazyka už není první spuštění
      // Zobrazit welcome screen po prvním nastavení jazyka
      if (isFirstTime) {
        setShowWelcome(true);
      }
    } catch (error) {
      console.error('Nepodařilo se uložit jazyk:', error);
      // Vrátit zpět předchozí jazyk při chybě
      const previousLanguage = currentLanguage;
      setCurrentLanguage(previousLanguage);
      throw new Error('Nepodařilo se změnit jazyk');
    }
  };

  /**
   * Označí welcome screen jako zobrazený
   */
  const markWelcomeShown = async () => {
    try {
      await AsyncStorage.setItem(WELCOME_SHOWN_KEY, 'true');
      setShowWelcome(false);
    } catch (error) {
      console.error('Nepodařilo se uložit stav welcome screen:', error);
    }
  };

  /**
   * Funkce pro překlad textu
   */
  const t = (key: TranslationKey): string => {
    const translation = (translations as any)[currentLanguage][key];
    
    // Pokud překlad neexistuje, zkus najít v defaultním jazyce
    if (!translation && currentLanguage !== DEFAULT_LANGUAGE) {
      const fallbackTranslation = (translations as any)[DEFAULT_LANGUAGE][key];
      if (fallbackTranslation) {
        return fallbackTranslation;
      }
    }
    
    // Pokud ani fallback neexistuje, vrať klíč
    return translation || key;
  };

  /**
   * Seznam dostupných jazyků
   */
  const availableLanguages: SupportedLanguage[] = Object.keys(translations) as SupportedLanguage[];

  /**
   * Context hodnota
   */
  const contextValue: LanguageContextType = {
    currentLanguage,
    isLoading,
    isFirstTime,
    showWelcome,
    setLanguage,
    markWelcomeShown,
    t,
    availableLanguages,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

/**
 * Hook pro používání Language Context
 */
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage musí být použit uvnitř LanguageProvider');
  }
  return context;
}; 