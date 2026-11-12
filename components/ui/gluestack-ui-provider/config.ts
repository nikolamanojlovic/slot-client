'use client';
import { vars } from 'nativewind';
import { palette } from '@/src/constants/colors';

// Generated from src/constants/colors.ts: edit colors there, not here.
// NativeWind theme variables take space-separated RGB channels.
const toRgb = (hex: string) =>
  [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(' ');

const themeVars = Object.fromEntries(
  Object.entries(palette).map(([name, hex]) => [`--color-${name}`, toRgb(hex)])
);

// The app runs in light mode only (App.tsx), so dark mirrors light
export const config = {
  light: vars(themeVars),
  dark: vars(themeVars),
};
