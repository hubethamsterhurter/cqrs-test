import { BaseLangString } from "../interface.lang-string";
import { LANGUAGES } from "../language";
import { StrRecord } from "../../../shared/types/str-record.type";


type Props = never;
export class IsDeletedLang extends BaseLangString<Props> {
  [LANGUAGES.EN](p: StrRecord<Props>) { return 'is deleted' }
  [LANGUAGES.GER](p: StrRecord<Props>) { return 'ist gelöscht'; }
}