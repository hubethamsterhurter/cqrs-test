import { Prototype } from "../types/prototype.type";
import { Logger } from "./class-logger.helper";

const _log = new Logger(prototypeMethodKeys);

/**
 * @description
 * Get method keys of the 
 * 
 * @param obj 
 */
export function prototypeMethodKeys(obj: object): (string | symbol)[] {
  const proto: Prototype = Object.getPrototypeOf(obj);
  let names = Object.getOwnPropertyNames(proto);
  // guess that the proto constructor is the class constructor - note that it may not be

  if ((proto.constructor === obj.constructor) && (proto.constructor instanceof Function)) {
    names = names.filter(name => (name !== 'constructor') && (typeof (proto as any)[name] === 'function'));
  }

  else if (proto.constructor instanceof Function) {
    _log.warn('object and prototype "constructor" keys are different');
    names = names.filter(name => (name !== 'constructor') && (typeof (proto as any)[name] === 'function'));
  }

  else {
    // we cannot determine whether the prototype constructor is the actual class constructor or not
    throw new TypeError('Cannot determine class constructor');
  }

  return names;
}