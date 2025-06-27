import type { methodType } from '../utils/method'

/**
 * Nuxt Auth Module Options
 *
 * This interface defines all configuration options for the Nuxt Auth module.
 * Each option is documented with its purpose, usage, and practical examples.
 *
 * @see https://github.com/dommi10/nuxtjs-auth#readme for full documentation.
 *
 * @example
 * // nuxt.config.ts
 * export default defineNuxtConfig({
 *   modules: ['@dommidev10/nuxt-auth'],
 *   auth: {
 *     baseURL: 'http://localhost:4000/auth',
 *     endpoints: { ... },
 *     token: { ... },
 *     // etc.
 *   }
 * })
 */
export interface ModuleOptions {
  /**
   * The base URL for all authentication API requests.
   * @example
   * // If your API is hosted at http://localhost:4000/auth
   * baseURL: 'http://localhost:4000/auth'
   */
  baseURL: string

  /**
   * If true, applies the auth middleware globally to all pages.
   * If false, you must add it manually in your pages/layouts.
   * @default true
   * @example
   * // To protect only some pages:
   * export default defineNuxtPage({ middleware: ['auth'] })
   * @why
   * Use `globalMiddleware: false` if you want public and private pages in your app.
   */
  globalMiddleware?: boolean

  /**
   * API endpoints for authentication actions.
   * @example
   * endpoints: {
   *   signIn: { path: '/login', method: 'post' },
   *   signOut: { path: '/logout', method: 'post' },
   *   getSession: { path: '/me', method: 'get' }
   * }
   * @why
   * Allows you to adapt to any backend API structure.
   */
  endpoints: {
    /** Endpoint for user sign in (login) */
    signIn: { path: string; method: methodType }
    /** Endpoint for user sign out (logout) */
    signOut: { path: string; method: methodType }
    /** Endpoint for fetching the current session */
    getSession: { path: string; method: methodType }
  }

  /**
   * Access token configuration.
   * @example
   * token: {
   *   signInResponseTokenPointer: '/access_token',
   *   type: 'Bearer',
   *   cookieName: 'auth.token',
   *   headerName: 'Authorization',
   *   maxAgeInSeconds: 86400,
   *   sameSiteAttribute: 'lax'
   * }
   * @why
   * Lets you control how tokens are stored, sent, and secured.
   */
  token: {
    /** JSON pointer to access token in sign-in response */
    signInResponseTokenPointer: string
    /** Token type (e.g., Bearer) */
    type?: string
    /** Cookie name for the access token */
    cookieName: string
    /** HTTP header name for sending the token */
    headerName: string
    /** Cookie expiration in seconds */
    maxAgeInSeconds: number
    /** SameSite attribute for the cookie */
    sameSiteAttribute: boolean | 'lax' | 'strict' | 'none' | undefined
    /** Secure attribute for the cookie */
    secureCookieAttribute?: boolean
    /** HttpOnly attribute for the cookie */
    httpOnlyCookieAttribute?: boolean
  }

  /**
   * Refresh token configuration (optional).
   * @example
   * refresh: {
   *   endpoint: { path: '/refresh', method: 'post' },
   *   refreshOnlyToken: true,
   *   token: {
   *     signInResponseRefreshTokenPointer: '/refresh_token',
   *     refreshResponseTokenPointer: '/access_token',
   *     refreshRequestTokenPointer: '/refresh_token',
   *     cookieName: 'auth.refresh_token',
   *     maxAgeInSeconds: 604800,
   *     sameSiteAttribute: 'lax'
   *   }
   * }
   * @why
   * Use this if your backend issues refresh tokens for longer sessions.
   */
  refresh?: {
    /** Endpoint for refreshing the access token */
    endpoint: { path: string; method: methodType }
    /** If true, only the token is sent in the refresh request */
    refreshOnlyToken?: boolean
    /** Refresh token details */
    token: {
      /** JSON pointer to refresh token in sign-in response */
      signInResponseRefreshTokenPointer: string
      /** JSON pointer to access token in refresh response */
      refreshResponseTokenPointer: string
      /** JSON pointer to refresh token in refresh request */
      refreshRequestTokenPointer: string
      /** Cookie name for the refresh token */
      cookieName: string
      /** Cookie expiration in seconds */
      maxAgeInSeconds: number
      /** SameSite attribute for the cookie */
      sameSiteAttribute: boolean | 'lax' | 'strict' | 'none' | undefined
      /** Secure attribute for the cookie */
      secureCookieAttribute?: boolean
      /** HttpOnly attribute for the cookie */
      httpOnlyCookieAttribute?: boolean
    }
  }

  /**
   * Paths for special pages (e.g. login).
   * @example
   * pages: {
   *   login: '/auth/login'
   * }
   * @why
   * Lets the module know where to redirect unauthenticated users.
   */
  pages: {
    /** Path to the login page (e.g. '/auth/login') */
    login: string
  }

  /**
   * Session data type definition for IDE autocompletion.
   * @example
   * session: {
   *   dataType: {
   *     id: 'string',
   *     name: 'string'
   *   }
   * }
   * @why
   * Helps TypeScript and your IDE know the shape of your user session object.
   */
  session: {
    /** Key-value pairs describing the session fields and their types */
    dataType: Record<string, string>
  }

  /**
   * If true, automatically refresh the session/token when the window regains focus.
   * Note: The refresh will only be triggered if the token is expired, to avoid multiple and unnecessary backend calls.
   * @default false
   * @example
   * refreshOnFocusChanged: true
   * @why
   * Improves UX for SPAs by keeping sessions alive when users return to the tab, but avoids spamming your backend.
   */
  refreshOnFocusChanged?: boolean
}
