import { env } from './env.js'

// Centralised feature flag configuration.
export const featureFlags = {
  development: {
    showDebugInfo: env.isDevelopment,
  },
  examples: {
    sampleFeature: false,
  },
}

export const isFeatureEnabled = (flagPath) => {
  const keys = flagPath.split('.')
  let current = featureFlags

  for (const key of keys) {
    if (current[key] === undefined) {
      return false
    }
    current = current[key]
  }

  return current === true
}

export const shouldShowDebugInfo = () => isFeatureEnabled('development.showDebugInfo')
export const isSampleFeatureEnabled = () => isFeatureEnabled('examples.sampleFeature')

export default featureFlags
