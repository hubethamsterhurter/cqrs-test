export class Tapper {
  one = (fn: () => any) => {
    return function(...args: any[]) {
      fn();
      return args;
    }
  }
}