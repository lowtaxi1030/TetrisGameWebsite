import * as colors from "./colors.js";

export const pieceStyle = {
  red: {
    color: colors.red,
    borderColor: colors.purple,
  },
  orange: {
    color: colors.orange,
    borderColor: colors.green,
  },
  yellow: {
    color: colors.yellow,
    borderColor: colors.gray,
  },
  lightGreen: {
    color: colors.lightGreen,
    borderColor: colors.black,
  },
  default: {
    color: colors.white,
    borderColor: colors.gold,
  },
  empty: {
    color: [20, 0, 50],
    borderColor: colors.white,
  },
  blue: { color: [41, 121, 255], borderColor: [144, 202, 249] },
  purple: { color: colors.violet, borderColor: colors.lavender },
  teal: { color: colors.teal, borderColor: colors.lightTeal },
  coral: { color: colors.coral, borderColor: colors.lightCoral },
  indigo: { color: colors.indigo, borderColor: colors.lightIndigo },
  pink: { color: [173, 20, 87], borderColor: colors.lightRose },
  cyan: { color: [0, 172, 193], borderColor: [128, 222, 234] },
  gold: { color: [255, 160, 0], borderColor: [255, 224, 130] },
};
