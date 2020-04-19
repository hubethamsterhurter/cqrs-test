import { BaseLangString } from "../interface.lang-string";
import { LANGUAGES } from "../language";
import { StrRecord } from "../../../shared/types/str-record.type";


type Props = 'model' | 'action' | 'name' | 'reason';
export class CannotActionModelLang extends BaseLangString<Props> {
  [LANGUAGES.EN](p: StrRecord<Props>) { return `cannot ${p.action} ${p.model}, ${p.name} ${p.reason}` }
  [LANGUAGES.GER](p: StrRecord<Props>) { return `kann nicht ${p.action} ${p.model}, ${p.name} ${p.reason}`; }
}