import { BaseLangString } from "../interface.lang-string";
import { LANGUAGES } from "../language";
import { StrRecord } from "../../../shared/types/str-record.type";


type Props = never;
export class UpdateLang extends BaseLangString<Props> {
  [LANGUAGES.EN](p: StrRecord<Props>) { return 'update' }
  [LANGUAGES.GER](p: StrRecord<Props>) { return 'aktualisieren'; }
}
