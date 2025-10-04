import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { supabase, isSupabaseConfigured, SUPABASE_AUTH_STORAGE_KEY } from '../services/supabaseClient.js'

const CONFIG_ERROR_MESSAGE = 'Authentication is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable auth.'

const readPersistedSession = () => {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const raw = window.localStorage.getItem(SUPABASE_AUTH_STORAGE_KEY)
    if (!raw) {
      return null
    }

    const parsed = JSON.parse(raw)
    return parsed?.currentSession ?? parsed?.session ?? null
  } catch (error) {
    console.warn('Failed to read stored Supabase session', error)
    return null
  }
}

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null)
  const [initializing, setInitializing] = useState(true)
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState(null)
  const [isAuthModalOpen, setAuthModalOpen] = useState(false)
  const pendingRedirectRef = useRef(null)

  useEffect(() => {
    let isMounted = true

    const initialize = async () => {
      if (!isSupabaseConfigured) {
        setAuthError(CONFIG_ERROR_MESSAGE)
        setSession(null)
        setInitializing(false)
        return
      }

      const { data, error } = await supabase.auth.getSession()
      if (!isMounted) {
        return
      }

      if (error) {
        setAuthError(error.message)
      } else {
        const storedSession = data.session ?? readPersistedSession()
        setSession(storedSession)
      }
      setInitializing(false)
    }

    initialize()

    if (!isSupabaseConfigured) {
      return () => {
        isMounted = false
      }
    }

    const { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (!isMounted) {
        return
      }

      let nextSession = newSession
      if (!nextSession && event !== 'SIGNED_OUT') {
        nextSession = readPersistedSession()
      }

      setSession(nextSession)

      if (event === 'INITIAL_SESSION') {
        setInitializing(false)
        return
      }

      if (event === 'SIGNED_IN') {
        setAuthModalOpen(false)
        setAuthError(null)
        setAuthLoading(false)
      }

      if (event === 'SIGNED_OUT') {
        pendingRedirectRef.current = null
      }
    })

    return () => {
      isMounted = false
      listener?.subscription?.unsubscribe()
    }
  }, [])

  const ensureConfigured = useCallback(() => {
    if (!isSupabaseConfigured) {
      const error = new Error(CONFIG_ERROR_MESSAGE)
      setAuthError(error.message)
      return { error }
    }
    return { error: null }
  }, [])

  const signInWithPassword = useCallback(async ({ email, password }) => {
    const { error: configError } = ensureConfigured()
    if (configError) {
      return { data: null, error: configError }
    }

    try {
      setAuthLoading(true)
      setAuthError(null)
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setAuthError(error.message)
        return { data, error }
      }

      return { data, error: null }
    } catch (error) {
      setAuthError(error.message)
      return { data: null, error }
    } finally {
      setAuthLoading(false)
    }
  }, [ensureConfigured])

  const signUpWithPassword = useCallback(async ({ email, password, nickname }) => {
    const { error: configError } = ensureConfigured()
    if (configError) {
      return { data: null, error: configError }
    }

    try {
      setAuthLoading(true)
      setAuthError(null)

      let metadata
      if (nickname) {
        metadata = {}
        metadata.nickname = nickname
        metadata.name = nickname
      }

      const payload = {
        email,
        password,
      }

      if (metadata) {
        payload.options = { data: metadata }
      }

      const { data, error } = await supabase.auth.signUp(payload)

      if (error) {
        setAuthError(error.message)
        return { data, error }
      }

      return { data, error: null }
    } catch (error) {
      setAuthError(error.message)
      return { data: null, error }
    } finally {
      setAuthLoading(false)
    }
  }, [ensureConfigured])

  const sendPasswordReset = useCallback(async ({ email }) => {
    const { error: configError } = ensureConfigured()
    if (configError) {
      return { data: null, error: configError }
    }

    try {
      setAuthLoading(true)
      setAuthError(null)
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) {
        setAuthError(error.message)
        return { data, error }
      }
      return { data, error: null }
    } catch (error) {
      setAuthError(error.message)
      return { data: null, error }
    } finally {
      setAuthLoading(false)
    }
  }, [ensureConfigured])

  const completePasswordReset = useCallback(async ({ newPassword }) => {
    const { error: configError } = ensureConfigured()
    if (configError) {
      return { data: null, error: configError }
    }

    if (!newPassword) {
      const error = new Error('Please provide a new password.')
      setAuthError(error.message)
      return { data: null, error }
    }

    try {
      setAuthLoading(true)
      setAuthError(null)

      const { data, error } = await supabase.auth.updateUser({ password: newPassword })

      if (error) {
        setAuthError(error.message)
        return { data: null, error }
      }

      if (data?.user) {
        setSession(previousSession => {
          if (!previousSession) {
            return previousSession
          }

          return {
            ...previousSession,
            user: data.user,
          }
        })
      }

      return { data, error: null }
    } catch (error) {
      setAuthError(error.message)
      return { data: null, error }
    } finally {
      setAuthLoading(false)
    }
  }, [ensureConfigured])

  const signOut = useCallback(async () => {
    const { error: configError } = ensureConfigured()
    if (configError) {
      return { error: configError }
    }

    try {
      setAuthLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) {
        setAuthError(error.message)
        return { error }
      }
      setSession(null)
      return { error: null }
    } catch (error) {
      setAuthError(error.message)
      return { error }
    } finally {
      setAuthLoading(false)
    }
  }, [ensureConfigured])

  const changePassword = useCallback(async ({ currentPassword, newPassword }) => {
    const { error: configError } = ensureConfigured()
    if (configError) {
      return { data: null, error: configError }
    }

    if (!session?.user?.email) {
      const error = new Error('You must be logged in to change your password.')
      setAuthError(error.message)
      return { data: null, error }
    }

    if (!currentPassword || !newPassword) {
      const error = new Error('Please provide your current and new password.')
      setAuthError(error.message)
      return { data: null, error }
    }

    try {
      setAuthLoading(true)
      setAuthError(null)

      const { data: signInData, error: reauthError } = await supabase.auth.signInWithPassword({
        email: session.user.email,
        password: currentPassword,
      })

      if (reauthError) {
        setAuthError(reauthError.message)
        return { data: null, error: reauthError }
      }

      if (signInData?.session) {
        setSession(signInData.session)
      }

      const { data, error } = await supabase.auth.updateUser({ password: newPassword })

      if (error) {
        setAuthError(error.message)
        return { data: null, error }
      }

      if (data?.user) {
        setSession((previousSession) => {
          if (!previousSession) {
            return previousSession
          }
          return {
            ...previousSession,
            user: data.user,
          }
        })
      }

      return { data, error: null }
    } catch (error) {
      setAuthError(error.message)
      return { data: null, error }
    } finally {
      setAuthLoading(false)
    }
  }, [ensureConfigured, session])

  const openAuthModal = useCallback(({ redirectTo } = {}) => {
    if (redirectTo) {
      pendingRedirectRef.current = redirectTo
    }
    setAuthModalOpen(true)
  }, [])

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false)
  }, [])

  const consumePendingRedirect = useCallback(() => {
    const redirectTo = pendingRedirectRef.current
    pendingRedirectRef.current = null
    return redirectTo
  }, [])

  const resetError = useCallback(() => setAuthError(null), [])

  const value = useMemo(() => ({
    session,
    user: session?.user ?? null,
    initializing,
    authLoading,
    loading: initializing || authLoading,
    error: authError,
    signInWithPassword,
    signUpWithPassword,
    sendPasswordReset,
    completePasswordReset,
    signOut,
    changePassword,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
    resetError,
    pendingRedirect: pendingRedirectRef.current,
    isSupabaseConfigured,
    consumePendingRedirect,
  }), [
    session,
    initializing,
    authLoading,
    authError,
    signInWithPassword,
    signUpWithPassword,
    sendPasswordReset,
    completePasswordReset,
    signOut,
    changePassword,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
    resetError,
    consumePendingRedirect,
  ])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
