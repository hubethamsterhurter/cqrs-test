import { BaseLangString } from "../interface.lang-string";
import { LANGUAGES } from "../language";
import { StrRecord } from "../../../shared/types/str-record.type";


type Props = 'model';
export class ModelDeletedLang extends BaseLangString<Props> {
  [LANGUAGES.EN](p: StrRecord<Props>) { return `${p.model} is deleted` }
  [LANGUAGES.GER](p: StrRecord<Props>) { return `${p.model} ist gelöscht`; }
}