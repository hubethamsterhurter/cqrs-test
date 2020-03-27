export const USER_COLOUR = {
  BLUE: 'blue',
  GREEN: 'green',
  RED: 'red',
  ORANGE: 'orange',
  PURPLE: 'purple',
  PINK: 'pink',
  BLACK: 'black',
} as const;
export type USER_COLOUR = typeof USER_COLOUR;
export type A_USER_COLOUR = USER_COLOUR[keyof USER_COLOUR];
export const USER_COLOURS = Object.values(USER_COLOUR);