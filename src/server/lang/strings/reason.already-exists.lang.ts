import { BaseLangString } from "../interface.lang-string";
import { LANGUAGES } from "../language";
import { StrRecord } from "../../../shared/types/str-record.type";


type Props = never;
export class AlreadyExistsLang extends BaseLangString<Props> {
  [LANGUAGES.EN](p: StrRecord<Props>) { return 'already exists' }
  [LANGUAGES.GER](p: StrRecord<Props>) { return 'ist bereits vorhanden'; }
}