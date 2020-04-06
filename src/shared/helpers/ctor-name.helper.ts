import { CtorOf } from "./ctor-of";

/**
 * @description
 * Get the ctor name of an object
 * 
 * @param obj 
 */
export function ctorName(obj: object) { return CtorOf(obj).name; }
