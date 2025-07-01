import { cs } from './cs';
import { en } from './en';

/**
 * Map of all available translations
 */
export const translations = {
  cs,
  en,
} as const;

/**
 * Available languages in the application
 */
export type Language = keyof typeof translations;

/**
 * Translation keys (derived from Czech translations)
 */
export type TranslationKey = keyof typeof cs;

/**
 * Default application language
 */
export const DEFAULT_LANGUAGE: Language = 'cs';

/**
 * Export individual translations
 */
export { cs, en }; 