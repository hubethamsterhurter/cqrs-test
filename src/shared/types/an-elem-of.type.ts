export type AnElemOf<T> =
  T extends readonly (infer U)[]
    ? U
    : T extends Readonly<infer U>[]
      ? U
      : never