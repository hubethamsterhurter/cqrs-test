import { BaseLangString } from "../interface.lang-string";
import { LANGUAGES } from "../language";
import { StrRecord } from "../../../shared/types/str-record.type";


type Props = never;
export class DoesNotExistLang extends BaseLangString<Props> {
  [LANGUAGES.EN](p: StrRecord<Props>) { return 'does not exist' }
  [LANGUAGES.GER](p: StrRecord<Props>) { return 'ist nicht vorhanden'; }
}