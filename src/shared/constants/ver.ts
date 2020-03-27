export const VER = {
  _0_1: '_0_1',
} as const;
export type VER = typeof VER;
export type A_VER = VER[keyof VER];
