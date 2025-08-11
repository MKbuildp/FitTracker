import { useLanguage } from '../context/LanguageContext';
import { TranslationKey } from '../translations';

/**
 * Hook pro jednoduché používání překladů v komponentách
 * 
 * @example
 * const { t, safeT } = useTranslation();
 * <Text>{t('common.save')}</Text>
 * <Text>{safeT('detail.history', 'Historie')}</Text>
 */
export const useTranslation = () => {
  const { t, currentLanguage, setLanguage, isLoading } = useLanguage();

  /**
   * Bezpečná funkce pro překlad s fallback textem
   * @param key - Klíč překladu
   * @param fallback - Fallback text, pokud se překlad nenačte
   * @returns Přeložený text nebo fallback
   */
  const safeT = (key: TranslationKey, fallback: string): string => {
    const translation = t(key);
    // Pokud se vrátí klíč místo překladu, použij fallback
    return translation === key ? fallback : translation;
  };

  return {
    /** Funkce pro překlad textu */
    t,
    /** Bezpečná funkce pro překlad s fallback textem */
    safeT,
    /** Aktuální jazyk */
    currentLanguage,
    /** Funkce pro změnu jazyka */
    setLanguage,
    /** Indikátor načítání */
    isLoading,
  };
}; 