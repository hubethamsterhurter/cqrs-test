import { BaseEvent } from "../base/base.event";
import { Constructor } from "../../shared/types/constructor.type";
import { plainToClass } from "class-transformer";
import { Without_n } from "../../shared/types/without-_n.type";
import { Without_t } from "../../shared/types/without-_t.type";

export function createEvent<E extends BaseEvent>(
  Ctor: Constructor<E>,
  data: Without_t<Without_n<E>>,
): E {
  return plainToClass(Ctor, data);
}
