import { defineNuxtPlugin, useRuntimeConfig, useCookie } from '#imports'
import { jwtDecode } from 'jwt-decode'
import { useAuth } from '../composables/useAuth'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig().public.auth
  const { refresh, clearSession } = useAuth()
  const token = useCookie<string | null>(config.token.cookieName)

  const isTokenExpired = (jwt?: string | null): boolean => {
    if (!jwt) return true
    try {
      const decoded: any = jwtDecode(jwt.replace(/^Bearer /, ''))
      return decoded.exp * 1000 < Date.now()
    } catch {
      return true
    }
  }

  const onFocus = async () => {
    if (isTokenExpired(token.value)) {
      try {
        await refresh()
      } catch {
        clearSession()
      }
    }
  }

  if (process.client) {
    window.addEventListener('focus', onFocus)
  }
})
