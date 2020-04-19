import { BaseLangString } from "../interface.lang-string";
import { LANGUAGES } from "../language";
import { StrRecord } from "../../../shared/types/str-record.type";


type Props = 'type' | 'name';
export class FourZeroFourLang extends BaseLangString<Props> {
  [LANGUAGES.EN](p: StrRecord<Props>) { return `unable to find ${p.type}, ${p.name}` }
  [LANGUAGES.GER](p: StrRecord<Props>) { return 'todo'; }
}
