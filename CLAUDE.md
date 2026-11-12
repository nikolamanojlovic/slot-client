# slot-client

## Colors

All colors live in one file: `src/constants/colors.ts`.

- `palette`: the full theme scales (`"primary-500"`, `"typography-500"`, …), keyed like the
  gluestack/Tailwind names. `components/ui/gluestack-ui-provider/config.ts` generates the
  gluestack theme from it, so never edit colors in `config.ts`.
- `colors`: semantic tokens (`primary`, `text`, `textMuted`, `border`, `surface`, `error`, …).
  **App code uses only these.**

### One way to apply a color

Always pass a `colors.*` token through `style` or a `color` prop:

```tsx
<Text style={{ color: colors.textMuted }}>…</Text>
<View style={{ backgroundColor: colors.surface, borderColor: colors.border }} />
<Icon as={Send} color={colors.white} />
<Spinner color={colors.primary} />
```

Do not:

- write hex/rgb or named color literals (`"#888"`, `"black"`) anywhere except
  `src/constants/colors.ts`;
- use Tailwind color classes (`text-*`, `bg-*`, `border-*` with a color, e.g. `text-typography-500`,
  `bg-white`). `className` is for layout, spacing, size and font weight only (`border` for width
  is fine; its color goes in `style`).

Why this style: icons, spinners, `placeholderTextColor` and shadows only accept a color value,
so `colors.*` is the only approach that works everywhere, on web and native alike.

### Adding or changing a color

- Changing the brand/theme: edit `palette`. Both gluestack components and `colors.*` follow.
- Need a new meaning (e.g. "badge background"): add a semantic token to `colors` pointing at a
  `palette` entry, rather than reusing a token with a different meaning.
- `cardStyle` (`src/constants/styles.ts`) is the shared card surface and shadow.

### Web gotcha

On web, gluestack `Box` renders a plain `<div>` and gluestack `Text` a plain `<span>`, so their
`style` goes to the browser as raw CSS:

- React Native-only props (`paddingHorizontal`, `shadow*`, …) are dropped. Use a react-native
  `View` when a style relies on them (see the chat bubbles in `src/screens/ThreadScreen.tsx`).
- Unitless numbers stay unitless: `lineHeight: 12` becomes `line-height: 12`, i.e. 12× the font
  size, not 12px. Don't set `lineHeight` on gluestack `Text`; use a size/leading class instead.
