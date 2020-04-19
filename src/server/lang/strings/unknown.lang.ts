import { BaseLangString } from "../interface.lang-string";
import { LANGUAGES } from "../language";
import { StrRecord } from "../../../shared/types/str-record.type";


type Props = 'unknown';
export class UnknownLang extends BaseLangString<Props> {
  [LANGUAGES.EN](p: StrRecord<Props>) { return p.unknown; }
  [LANGUAGES.GER](p: StrRecord<Props>) { return p.unknown; }
}
