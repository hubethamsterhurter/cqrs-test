/**
 * @description
 * Get the ctor name of an object
 * 
 * @param obj 
 */
export function prototypeOf<P extends {}>(obj: P): P {
  return Object.getPrototypeOf(obj);
}
