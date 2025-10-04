const getEnvValue = (key, { required = false, fallback = undefined } = {}) => {
  const value = import.meta.env[key]
  if (value !== undefined && value !== null && value !== '') {
    return value
  }

  if (required) {
    console.warn(`Missing required environment variable: ${key}`)
  }

  return fallback
}

export const env = {
  supabaseUrl: getEnvValue('VITE_SUPABASE_URL'),
  supabaseAnonKey: getEnvValue('VITE_SUPABASE_ANON_KEY'),
  apiBaseUrl: getEnvValue('VITE_API_BASE_URL', { fallback: 'http://localhost:3000/api' }),
  appVersion: getEnvValue('VITE_APP_VERSION', { fallback: '1.0.0' }),
  mode: import.meta.env.MODE,
  isDevelopment: import.meta.env.MODE === 'development',
}

export const hasSupabaseConfig = Boolean(env.supabaseUrl && env.supabaseAnonKey)
