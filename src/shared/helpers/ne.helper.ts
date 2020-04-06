/**
 * @description
 * Not equal to
 *
 * @param val
 */
export function ne(val: any) {
  return function doNe(otherVal: any)  {
    return val !== otherVal;
  }
}