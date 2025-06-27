import { useCookie, useRuntimeConfig, useState, navigateTo } from '#imports'
import deepGet from '../utils/deepGet'
import type { AuthSession } from '#build/types/auth-session'
import type { methodType } from '../utils/method'
import type { ModuleOptions } from '../types/module.types'

/**
 * Provides authentication utilities for Nuxt apps.
 * Handles token management, session state, login, logout, and token refresh.
 * All cookie and session options are driven by the Nuxt module configuration.
 * @returns {object} Auth composable API
 *
 * @example
 * // Basic usage in a component
 * const { session, signIn, signOut, refresh, getSession, token } = useAuth()
 */
export const useAuth = () => {
  console.log('[nuxt-auth] useAuth loaded')

  /** @type {ModuleOptions} Auth configuration from runtimeConfig */
  const config = useRuntimeConfig().public.auth as ModuleOptions

  /**
   * Main access token cookie.
   * - Name, expiration, and attributes are set from Nuxt config.
   * @type {Ref<string | null>}
   *
   * @example
   * const { token } = useAuth()
   * console.log(token.value)
   */
  const token = useCookie<string | null>(config.token.cookieName, {
    maxAge: config.token.maxAgeInSeconds, // Cookie expiration (in seconds) from config
    sameSite: config.token.sameSiteAttribute, // SameSite policy from config
    secure: config.token.secureCookieAttribute, // Secure flag from config
    httpOnly: config.token.httpOnlyCookieAttribute, // HttpOnly flag from config
  })

  /**
   * Refresh token cookie.
   * - Name, expiration, and attributes are set from Nuxt config.
   * @type {Ref<string | null>}
   */
  const refreshToken = useCookie<string | null>(config.refresh?.token.cookieName ?? '', {
    maxAge: config.refresh?.token.maxAgeInSeconds, // Cookie expiration (in seconds) from config
    sameSite: config.refresh?.token.sameSiteAttribute, // SameSite policy from config
    secure: config.refresh?.token.secureCookieAttribute, // Secure flag from config
    httpOnly: config.refresh?.token.httpOnlyCookieAttribute, // HttpOnly flag from config
  })

  /**
   * Reactive session state for the authenticated user.
   * @type {Ref<AuthSession | null>}
   *
   * @example
   * const { session } = useAuth()
   * watch(session, (val) => { ... })
   */
  const session = useState<AuthSession | null>('auth:session', () => null)

  console.log('[AUTH] loaded with url ', config.baseURL)

  /**
   * Signs in the user with given credentials.
   * Sets the access and refresh tokens, and loads the session.
   *
   * @param {Record<string, any>} credentials - User credentials for login
   * @returns {Promise<AuthSession | null>}
   *
   * @example
   * const { signIn } = useAuth()
   * await signIn({ username: 'john', password: 'secret' })
   */
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

  /**
   * Fetches the current user session from the API.
   * If the access token is expired, tries to refresh and retry.
   *
   * @returns {Promise<AuthSession | null>}
   *
   * @example
   * const { getSession } = useAuth()
   * const session = await getSession()
   */
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

  /**
   * Refreshes the access token using the refresh token.
   * Updates the access token cookie.
   *
   * @returns {Promise<void>}
   *
   * @example
   * const { refresh } = useAuth()
   * await refresh()
   */
  const refresh = async () => {
    if (!config.refresh?.endpoint) {
      console.warn('[Auth] refresh endpoint is missing in config.')
      return null
    }

    if (!refreshToken.value) throw new Error('No refresh token')
    const payload = config.refresh?.refreshOnlyToken
      ? {
          [config.refresh.token.refreshRequestTokenPointer.replaceAll('/', '')]: refreshToken.value,
        }
      : {}

    const headers = token.value
      ? {
          [config.token.headerName]: token.value!,
        }
      : {}

    const res = await $fetch(config.baseURL + config.refresh!.endpoint.path, {
      method: config.refresh!.endpoint.method as methodType,
      body: payload,
      headers,
    })

    const newAccessToken = deepGet(
      res as Record<string, any>,
      config.refresh!.token.refreshResponseTokenPointer
    )
    if (!newAccessToken) throw new Error('No refreshed access token')

    token.value = config.token.type ? `${config.token.type} ${newAccessToken}` : newAccessToken
  }

  /**
   * Signs out the user, clears session and tokens, and redirects to login page.
   *
   * @returns {Promise<void>}
   *
   * @example
   * const { signOut } = useAuth()
   * await signOut()
   */
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

  /**
   * Clears all authentication state: tokens and session.
   *
   * @example
   * const { clearSession } = useAuth()
   * clearSession()
   */
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
    token,
  }
}
