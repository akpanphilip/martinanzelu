import { extendTheme, theme as base, type ThemeConfig } from '@chakra-ui/react';
import type { Accent } from './data/types';

export const ACCENTS: Accent[] = ['cream', 'purple', 'pink', 'teal', 'cyan', 'orange', 'blue', 'green', 'red'];

const config: ThemeConfig = { initialColorMode: 'dark', useSystemColorMode: false };

/** Custom palettes that Chakra does not ship with. */
const palettes = {
  cream: {
    50: '#FFFDF8', 100: '#FBF6EC', 200: '#F5ECDC', 300: '#EEDFC6', 400: '#E3CDA8',
    500: '#D4B78C', 600: '#B8976A', 700: '#8F7049', 800: '#5E4A31', 900: '#2E251A',
  },
  latte: {
    50: '#FBF7F2', 100: '#F2E6D6', 200: '#E6D0B2', 300: '#D9B98D', 400: '#CAA06C',
    500: '#B88752', 600: '#9A6D3F', 700: '#7A5531', 800: '#5A3E24', 900: '#3B2918',
  },
  burgundy: {
    50: '#FBEEF1', 100: '#F3D4DB', 200: '#E5A9B6', 300: '#D47C90', 400: '#B9506A',
    500: '#912E48', 600: '#76213A', 700: '#5B182C', 800: '#40101F', 900: '#260912',
  },
};

const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

/**
 * The "cream" signature theme is two-toned: cream + latte in light mode, burgundy + cream in dark mode.
 * Overriding brand.* and partner.* as semantic tokens makes every brand-coloured element switch with the mode.
 */
function dualPalette(name: string, light: Record<number, string>, dark: Record<number, string>) {
  return Object.fromEntries(SHADES.map((s) => [`${name}.${s}`, { default: light[s], _dark: dark[s] }]));
}

type PaletteName = Accent | 'latte';

const partner: Record<Accent, PaletteName> = {
  cream: 'latte', purple: 'pink', pink: 'orange', teal: 'cyan', cyan: 'blue', orange: 'pink', blue: 'cyan', green: 'teal', red: 'orange',
};

const palette = (name: PaletteName) =>
  (palettes as Record<string, Record<number, string>>)[name] ?? base.colors[name as Exclude<Accent, 'cream'>];

export function buildTheme(accent: Accent) {
  const light = accent === 'cream';

  return extendTheme({
    config,
    fonts: {
      heading: `'Space Grotesk', system-ui, sans-serif`,
      body: `'Inter', system-ui, sans-serif`,
    },
    colors: {
      ...palettes,
      brand: palette(accent),
      partner: palette(partner[accent]),
    },
    semanticTokens: {
      colors: {
        ...(light ? { ...dualPalette('brand', palettes.cream, palettes.burgundy), ...dualPalette('partner', palettes.latte, palettes.cream) } : {}),
        // Surfaces: warm milk by day, deep wine-black by night for the signature theme; cool neutrals otherwise.
        bg: light ? { default: '#FBF8F2', _dark: '#13090C' } : { default: '#f6f5fb', _dark: '#07070d' },
        'bg.subtle': light ? { default: '#F3EDE2', _dark: '#1B0D12' } : { default: '#ecebf5', _dark: '#0d0d16' },
        surface: { default: 'white', _dark: 'rgba(255,255,255,0.035)' },
        'surface.hover': { default: light ? '#F7F1E6' : 'gray.50', _dark: 'rgba(255,255,255,0.06)' },
        border: { default: 'blackAlpha.100', _dark: 'whiteAlpha.100' },
        'border.strong': { default: 'blackAlpha.200', _dark: 'whiteAlpha.200' },
        fg: { default: light ? '#1F1A14' : 'gray.900', _dark: light ? '#F8EEEA' : 'gray.50' },
        muted: { default: light ? '#6B6153' : 'gray.600', _dark: light ? '#BBA5A8' : 'gray.400' },
        accent: { default: light ? 'cream.700' : 'brand.500', _dark: light ? 'burgundy.300' : 'brand.300' },
        glass: light
          ? { default: 'rgba(251,248,242,0.75)', _dark: 'rgba(19,9,12,0.68)' }
          : { default: 'rgba(246,245,251,0.72)', _dark: 'rgba(7,7,13,0.65)' },
        // Gradient text (headings): must contrast with the page background.
        'ink.a': light ? { default: 'cream.700', _dark: 'burgundy.300' } : { default: 'brand.500', _dark: 'brand.300' },
        'ink.b': light ? { default: 'latte.600', _dark: 'cream.300' } : { default: 'partner.500', _dark: 'partner.300' },
        // Filled surfaces (buttons, icon tiles, bars) and the text that sits on them.
        'fill.a': light ? { default: 'cream.900', _dark: 'burgundy.500' } : { default: 'brand.500', _dark: 'brand.500' },
        'fill.b': light ? { default: 'latte.800', _dark: 'burgundy.700' } : { default: 'partner.500', _dark: 'partner.500' },
        onFill: light ? { default: 'cream.100', _dark: 'cream.100' } : { default: 'white', _dark: 'white' },
        // Highlighted cards that always carry light text.
        'hl.a': light ? { default: 'cream.800', _dark: 'burgundy.600' } : { default: 'brand.600', _dark: 'brand.600' },
        'hl.b': light ? { default: 'latte.900', _dark: 'burgundy.900' } : { default: 'partner.700', _dark: 'partner.700' },
      },
    },
    styles: {
      global: {
        html: { scrollBehavior: 'smooth' },
        body: { bg: 'bg', color: 'fg', overflowX: 'hidden', WebkitFontSmoothing: 'antialiased' },
        '::selection': { bg: 'fill.a', color: 'onFill' },
        '::-webkit-scrollbar': { width: '10px' },
        '::-webkit-scrollbar-track': { bg: 'bg' },
        '::-webkit-scrollbar-thumb': { bg: 'brand.500', borderRadius: 'full', border: '3px solid', borderColor: 'bg' },
      },
    },
    components: {
      Button: {
        baseStyle: { borderRadius: 'full', fontWeight: 600 },
        defaultProps: { colorScheme: 'brand' },
        variants: light
          ? {
              solid: (props: { colorScheme: string }) =>
                props.colorScheme === 'brand'
                  ? {
                      bg: 'fill.a',
                      color: 'onFill',
                      _hover: { bg: 'fill.b', _disabled: { bg: 'fill.a' } },
                      _active: { bg: 'fill.b' },
                    }
                  : {},
              outline: (props: { colorScheme: string }) =>
                props.colorScheme === 'brand' ? { color: 'accent', borderColor: 'border.strong', _hover: { bg: 'surface.hover' } } : {},
              ghost: (props: { colorScheme: string }) =>
                props.colorScheme === 'brand' ? { color: 'accent', _hover: { bg: 'surface.hover' } } : {},
              link: (props: { colorScheme: string }) => (props.colorScheme === 'brand' ? { color: 'accent' } : {}),
            }
          : undefined,
      },
      Heading: { baseStyle: { letterSpacing: '-0.03em', fontWeight: 600 } },
      Tag: { defaultProps: { colorScheme: 'brand' } },
      Badge: { defaultProps: { colorScheme: 'brand' } },
      Switch: { defaultProps: { colorScheme: 'brand' } },
      Tabs: { defaultProps: { colorScheme: 'brand' } },
      Progress: { defaultProps: { colorScheme: 'brand' } },
      Input: { defaultProps: { focusBorderColor: 'brand.500' } },
      Textarea: { defaultProps: { focusBorderColor: 'brand.500' } },
      Select: { defaultProps: { focusBorderColor: 'brand.500' } },
    },
  });
}
