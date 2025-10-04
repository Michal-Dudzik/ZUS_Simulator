import { theme as antdTheme } from 'antd'

const THEME_DEFINITIONS = {
  light: {
    key: 'light',
    label: 'Light',
    mode: 'light',
    colors: {
      primary: '#f2ff00ff',
      background: '#f5f6fb',
      surface: '#ffffff',
      surfaceElevated: '#f9faff',
      text: '#1d2130',
      textSecondary: '#4d5672',
      border: '#d7dbe7',
    },
  },
  dark: {
    key: 'dark',
    label: 'Dark',
    mode: 'dark',
    colors: {
      primary: '#f2ff00ff',
      background: '#050712',
      surface: '#111735',
      surfaceElevated: '#161d42',
      text: '#f5f7ff',
      textSecondary: '#c1c6d8',
      border: '#252b4d',
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
