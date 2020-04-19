import { A_LANGUAGE, LANGUAGES } from "./language";
import { $DANGER } from "../../shared/types/danger.type";
import { unhandledLanguage } from "./unhandled-language";

export abstract class BaseLangString<P extends string = any> {
  constructor(readonly parts: Record<P, BaseLangString | string>) {};
  protected abstract [LANGUAGES.EN](parts: {[K in P]: string}): string;
  protected abstract [LANGUAGES.GER](parts: {[K in P]: string}): string;

  /**
   * @description
   * Retrieve the lang
   *
   * @param language
   */
  using(language: A_LANGUAGE) {
    const parts: {[K in P]: string} = {} as unknown as $DANGER<{[K in P]: string}>;
    (Object.entries(this.parts) as [P, BaseLangString | string][]).forEach(([k, l]) =>
      typeof l === 'string' ?
      (parts[k] = l) :
      (parts[k] = l.using(language))
    );
    return this[language]?.(parts) ?? unhandledLanguage(this, language);
  }
}