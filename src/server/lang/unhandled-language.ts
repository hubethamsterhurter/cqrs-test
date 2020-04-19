import { ctorName } from "../../shared/helpers/ctor-name.helper";
import { A_LANGUAGE } from "./language";

/**
 * @description
 * Message when the language has not been handled
 *
 * @param instance
 * @param language
 */
export function unhandledLanguage(instance: {}, language: A_LANGUAGE | never) {
  return `Unhandled lang "${ctorName(instance)}.${language}"`;
}