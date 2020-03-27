import { v4 } from 'uuid';
import { Factory } from "../types/factory.type";
import { Service } from 'typedi';

let __created__ = false;
@Service({ global: true })
export class IdFactory implements Factory<string> {
  constructor() {
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;
  }

  create() {
    return v4();
  }
}