export interface Constructor<P = {}> extends Function {
  new(...args: any[]): P;
  prototype: P;
}
