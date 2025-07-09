import { jwtDecode } from 'jwt-decode'
import { useAuth } from '../composables/useAuth'
import type { ModuleOptions } from '../types/module.types'
import { defineNuxtPlugin, useRuntimeConfig, useCookie } from '#imports'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig().public.auth as ModuleOptions
  const { refresh, clearSession, getSession } = useAuth()
  const token = useCookie<string | null>(config.token.cookieName)

  const isTokenExpired = (jwt?: string | null): boolean => {
    if (!jwt) return true
    try {
      const decoded: { exp: number } = jwtDecode(jwt.replace(/^Bearer /, ''))
      return decoded.exp * 1000 < Date.now()
    } catch {
      return true
    }
  }

  const onFocus = async () => {
    if (isTokenExpired(token.value)) {
      try {
        await refresh()
        await getSession()
      } catch {
        clearSession()
      }
    }
  }

  window.addEventListener('focus', onFocus)
})
