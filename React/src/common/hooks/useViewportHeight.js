import { useEffect } from 'react'

export const useViewportHeight = () => {
  useEffect(() => {
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--actual-vh', `${vh}px`)

      document.documentElement.style.setProperty('--actual-viewport-height', `${window.innerHeight}px`)
    }

    setViewportHeight()

    window.addEventListener('resize', setViewportHeight)
    window.addEventListener('orientationchange', setViewportHeight)

    return () => {
      window.removeEventListener('resize', setViewportHeight)
      window.removeEventListener('orientationchange', setViewportHeight)
    }
  }, [])
} 