import { theme as antdTheme } from 'antd'

const THEME_DEFINITIONS = {
  light: {
    key: 'light',
    label: 'Light',
    mode: 'light',
    colors: {
      primary: '#11783b',        // R: 0; G: 153; B: 63 - ZUS Green (always primary)
      secondary: '#FFB34F',      // R: 255; G: 179; B: 79 - Orange
      accent: '#3F84D2',         // R: 63; G: 132; B: 210 - Blue
      background: '#f5f6fb',     // Very light background for subtle depth
      surface: '#ffffff',        // White surface
      surfaceElevated: '#ffffff', // White elevated
      text: '#000000',           // R: 0; G: 0; B: 0 - Black text
      textSecondary: '#4d5672',  // Gray secondary text
      border: '#d7dbe7',         // Light gray borders
      error: '#F05E5E',          // R: 240; G: 94; B: 94 - Red
      black: '#000000',          // R: 0; G: 0; B: 0 - Black
    },
  },
  dark: {
    key: 'dark',
    label: 'Dark',
    mode: 'dark',
    colors: {
      primary: '#00993F',        // R: 0; G: 153; B: 63 - ZUS Green (always primary)
      secondary: '#FFB34F',      // R: 255; G: 179; B: 79 - Orange
      accent: '#3F84D2',         // R: 63; G: 132; B: 210 - Blue
      background: '#1a1a1a',     // Dark grey background
      surface: '#2d2d2d',        // Dark grey surface
      surfaceElevated: '#3a3a3a', // Elevated dark grey
      text: '#ffffff',           // White text
      textSecondary: '#b3b3b3',  // Light grey secondary text
      border: '#404040',         // Dark grey borders
      error: '#F05E5E',          // R: 240; G: 94; B: 94 - Red
      black: '#000000',          // R: 0; G: 0; B: 0 - Black
    },
  },
}

export const THEME_KEYS = Object.keys(THEME_DEFINITIONS)
export const THEME_OPTIONS = THEME_KEYS.map((key) => {
  const { label } = THEME_DEFINITIONS[key]
  return { value: key, label }
})

export const DEFAULT_THEME_KEY = 'light'

const defaultTheme = THEME_DEFINITIONS[DEFAULT_THEME_KEY]

export const DEFAULT_PRIMARY_COLOR = defaultTheme.colors.primary

const { defaultAlgorithm, darkAlgorithm, getDesignToken } = antdTheme

const selectAlgorithm = (mode) => (mode === 'dark' ? darkAlgorithm : defaultAlgorithm)

const ensureDefinition = (themeKey) => THEME_DEFINITIONS[themeKey] ?? defaultTheme

export const getThemeDefinition = (themeKey = DEFAULT_THEME_KEY) => {
  const definition = ensureDefinition(themeKey)
  return {
    ...definition,
    colors: { ...definition.colors },
  }
}

export const buildTheme = ({ themeKey = DEFAULT_THEME_KEY, primary } = {}) => {
  const definition = getThemeDefinition(themeKey)
  const colors = {
    ...definition.colors,
    ...(primary ? { primary } : {}),
  }

  const algorithm = selectAlgorithm(definition.mode)
  const token = {
    wireframe: false,
    colorPrimary: colors.primary,
    colorInfo: colors.primary,
    colorLink: colors.primary,
    colorBgLayout: colors.background,
    colorBgContainer: colors.surface,
    colorBgElevated: colors.surfaceElevated ?? colors.surface,
    colorText: colors.text,
    colorTextSecondary: colors.textSecondary,
    colorBorderSecondary: colors.border,
    colorError: colors.error,
    colorSuccess: colors.secondary,
    colorWarning: colors.accent,
  }

  const baseConfig = {
    token,
    algorithm,
  }

  const tokens = getDesignToken(baseConfig)

  return {
    config: {
      ...baseConfig,
      components: {
        Menu: {
          itemSelectedBg: tokens.colorPrimaryBg,
          itemSelectedColor: tokens.colorTextLightSolid,
        },
      },
    },
    tokens,
    definition: { ...definition, colors },
  }
}
