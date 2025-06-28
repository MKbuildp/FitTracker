import { useLanguage } from '../context/LanguageContext';
import { TranslationKey } from '../translations';

/**
 * Hook pro jednoduché používání překladů v komponentách
 * 
 * @example
 * const { t } = useTranslation();
 * <Text>{t('common.save')}</Text>
 */
export const useTranslation = () => {
  const { t, currentLanguage, setLanguage, isLoading } = useLanguage();

  return {
    /** Funkce pro překlad textu */
    t,
    /** Aktuální jazyk */
    currentLanguage,
    /** Funkce pro změnu jazyka */
    setLanguage,
    /** Indikátor načítání */
    isLoading,
  };
}; 