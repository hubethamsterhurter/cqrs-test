import { Constructor } from "../types/constructor.type";
import { BaseMessage } from "../base/base.message";
import { Without_n } from "../types/without-_n.type";
import { plainToClass } from "class-transformer";
import { Without_t } from "../types/without-_t.type";

export function createMessage<M extends BaseMessage>(
  Ctor: Constructor<M>,
  data: Without_t<Without_n<M>>,
): M {
  return plainToClass(Ctor, data);
}