import { extendTheme, theme as base, type ThemeConfig } from '@chakra-ui/react';
import type { Accent } from './data/types';

export const ACCENTS: Accent[] = ['purple', 'pink', 'teal', 'cyan', 'orange', 'blue', 'green', 'red'];

const config: ThemeConfig = { initialColorMode: 'dark', useSystemColorMode: false };

const partner: Record<Accent, Accent> = {
  purple: 'pink', pink: 'orange', teal: 'cyan', cyan: 'blue', orange: 'pink', blue: 'cyan', green: 'teal', red: 'orange',
};

export function buildTheme(accent: Accent) {
  return extendTheme({
    config,
    fonts: {
      heading: `'Space Grotesk', system-ui, sans-serif`,
      body: `'Inter', system-ui, sans-serif`,
    },
    colors: {
      brand: base.colors[accent],
      partner: base.colors[partner[accent]],
    },
    semanticTokens: {
      colors: {
        bg: { default: '#f6f5fb', _dark: '#07070d' },
        'bg.subtle': { default: '#ecebf5', _dark: '#0d0d16' },
        surface: { default: 'white', _dark: 'rgba(255,255,255,0.035)' },
        'surface.hover': { default: 'gray.50', _dark: 'rgba(255,255,255,0.06)' },
        border: { default: 'blackAlpha.100', _dark: 'whiteAlpha.100' },
        'border.strong': { default: 'blackAlpha.200', _dark: 'whiteAlpha.200' },
        fg: { default: 'gray.900', _dark: 'gray.50' },
        muted: { default: 'gray.600', _dark: 'gray.400' },
        accent: { default: 'brand.500', _dark: 'brand.300' },
        glass: { default: 'rgba(246,245,251,0.72)', _dark: 'rgba(7,7,13,0.65)' },
      },
    },
    styles: {
      global: {
        html: { scrollBehavior: 'smooth' },
        body: { bg: 'bg', color: 'fg', overflowX: 'hidden', WebkitFontSmoothing: 'antialiased' },
        '::selection': { bg: 'brand.400', color: 'white' },
        '::-webkit-scrollbar': { width: '10px' },
        '::-webkit-scrollbar-track': { bg: 'bg' },
        '::-webkit-scrollbar-thumb': { bg: 'brand.500', borderRadius: 'full', border: '3px solid', borderColor: 'bg' },
      },
    },
    components: {
      Button: {
        baseStyle: { borderRadius: 'full', fontWeight: 600 },
        defaultProps: { colorScheme: 'brand' },
      },
      Heading: { baseStyle: { letterSpacing: '-0.03em', fontWeight: 600 } },
      Tag: { defaultProps: { colorScheme: 'brand' } },
      Switch: { defaultProps: { colorScheme: 'brand' } },
      Tabs: { defaultProps: { colorScheme: 'brand' } },
      Progress: { defaultProps: { colorScheme: 'brand' } },
      Input: { defaultProps: { focusBorderColor: 'brand.400' } },
      Textarea: { defaultProps: { focusBorderColor: 'brand.400' } },
      Select: { defaultProps: { focusBorderColor: 'brand.400' } },
    },
  });
}
