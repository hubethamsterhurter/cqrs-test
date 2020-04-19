export const LANGUAGES = {
  EN: 'en',
  GER: 'ger',
} as const;
export type LANGUAGES = typeof LANGUAGES;
export type A_LANGUAGE = LANGUAGES[keyof LANGUAGES];
