import { Constructor } from "../types/constructor.type";
import { prototypeOf } from "./prototype-of.helper";

/**
 * @description
 * Get the ctor name of an object
 * 
 * @param obj 
 */
export function CtorOf<P extends {}>(obj: P): Constructor<P> {
  const result = prototypeOf(obj).constructor as Constructor<P>;
  return result;
}
