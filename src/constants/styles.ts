import { colors } from "./colors";

export const cardStyle = {
  backgroundColor: colors.white,
  shadowColor: colors.black,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 6,
  elevation: 4,
} as const;
