import { defineNuxtPlugin, useRuntimeConfig, useCookie } from '#imports'
import { useAuth } from '../composables/useAuth'
import { jwtDecode } from 'jwt-decode'

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig().public.auth
  const token = useCookie<string | null>(config.token.cookieName)
  const { refresh, getSession, clearSession } = useAuth()

  const isTokenExpired = (jwt?: string | null): boolean => {
    if (!jwt) return true
    try {
      const decoded: any = jwtDecode(jwt.replace(/^Bearer /, ''))
      return decoded.exp * 1000 < Date.now()
    } catch {
      return true
    }
  }

  if (!token.value || isTokenExpired(token.value)) {
    try {
      await refresh()
    } catch {
      clearSession()
      return
    }
  }

  try {
    await getSession()
  } catch {
    clearSession()
  }
})
