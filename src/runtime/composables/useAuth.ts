import { useCookie, useRuntimeConfig, useState, navigateTo } from '#imports'
import deepGet from '../utils/deepGet'
import type { AuthSession } from '#build/types/auth-session'
import type { methodType } from '../utils/method'

export const useAuth = () => {
  const config = useRuntimeConfig().public.auth
  const token = useCookie<string | null>(config.token.cookieName)
  const refreshToken = useCookie<string | null>(config.refresh?.token.cookieName)
  const session = useState<AuthSession | null>('auth:session', () => null)

  console.log('[AUTH] loaded with url ', config.baseURL)

  const signIn = async (credentials: Record<string, any>) => {
    if (!config.endpoints.signIn) {
      console.warn('[Auth] signIn endpoint is missing in config.')
      return null
    }

    const res = await $fetch(config.baseURL + config.endpoints.signIn.path, {
      method: config.endpoints.signIn.method as methodType,
      body: credentials,
    })

    const accessToken = deepGet(res as Record<string, any>, config.token.signInResponseTokenPointer)
    if (!accessToken) throw new Error('No access token found in response')

    token.value = config.token.type ? `${config.token.type} ${accessToken}` : accessToken

    if (config.refresh?.token?.signInResponseRefreshTokenPointer) {
      const refreshVal = deepGet(
        res as Record<string, any>,
        config.refresh?.token.signInResponseRefreshTokenPointer
      )
      refreshToken.value = refreshVal
    }

    return await getSession()
  }

  const getSession = async () => {
    try {
      if (!config.endpoints.getSession) {
        console.warn('[Auth] getSession endpoint is missing in config.')
        return null
      }

      const res = await $fetch(config.baseURL + config.endpoints.getSession.path, {
        method: config.endpoints.getSession.method as methodType,
        headers: {
          [config.token.headerName]: token.value!,
        },
      })
      session.value = res as AuthSession
      return res
    } catch (err: any) {
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        try {
          await refresh()
          return await getSession()
        } catch {
          clearSession()
          navigateTo(config.pages.login)
        }
      }
      throw err
    }
  }

  const refresh = async () => {
    if (!config.refresh.endpoint) {
      console.warn('[Auth] refresh endpoint is missing in config.')
      return null
    }

    if (!refreshToken.value) throw new Error('No refresh token')
    const payload = config.refresh?.refreshOnlyToken
      ? { [config.refresh.token.refreshRequestTokenPointer]: refreshToken.value }
      : {}

    const res = await $fetch(config.baseURL + config.refresh!.endpoint.path, {
      method: config.refresh!.endpoint.method as methodType,
      body: payload,
    })

    const newAccessToken = deepGet(
      res as Record<string, any>,
      config.refresh!.token.refreshResponseTokenPointer
    )
    if (!newAccessToken) throw new Error('No refreshed access token')

    token.value = config.token.type ? `${config.token.type} ${newAccessToken}` : newAccessToken
  }

  const signOut = async () => {
    try {
      if (!config.endpoints.signOut) {
        console.warn('[Auth] singout endpoint is missing in config.')
        return null
      }

      await $fetch(config.baseURL + config.endpoints.signOut.path, {
        method: config.endpoints.signOut.method as methodType,
        headers: {
          [config.token.headerName]: token.value!,
        },
      })
    } catch {}
    clearSession()
    navigateTo(config.pages.login)
  }

  const clearSession = () => {
    token.value = null
    refreshToken.value = null
    session.value = null
  }

  return {
    signIn,
    signOut,
    refresh,
    getSession,
    clearSession,
    session,
  }
}
