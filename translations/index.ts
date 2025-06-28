import { cs } from './cs';
import { en } from './en';

/**
 * Mapa všeh dostupných překladů
 */
export const translations = {
  cs,
  en,
} as const;

/**
 * Dostupné jazyky v aplikaci
 */
export type SupportedLanguage = keyof typeof translations;

/**
 * Klíče pro překlady (odvozené z českých překladů)
 */
export type TranslationKey = keyof typeof cs;

/**
 * Defaultní jazyk aplikace
 */
export const DEFAULT_LANGUAGE: SupportedLanguage = 'cs';

/**
 * Export jednotlivých překladů
 */
export { cs, en }; 