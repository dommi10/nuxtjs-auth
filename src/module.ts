import {
  defineNuxtModule,
  createResolver,
  addPlugin,
  addImportsDir,
  addRouteMiddleware,
  addTypeTemplate,
} from '@nuxt/kit'
import { defu } from 'defu'
import type { methodType } from './runtime/utils/method'

export interface ModuleOptions {
  baseURL: string
  endpoints: {
    signIn: { path: string; method: methodType }
    signOut: { path: string; method: methodType }
    getSession: { path: string; method: methodType }
  }
  token: {
    signInResponseTokenPointer: string
    type?: string
    cookieName: string
    headerName: string
    maxAgeInSeconds: number
    sameSiteAttribute?: string
    secureCookieAttribute?: boolean
    httpOnlyCookieAttribute?: boolean
  }
  refresh?: {
    endpoint: { path: string; method: methodType }
    refreshOnlyToken?: boolean
    token: {
      signInResponseRefreshTokenPointer: string
      refreshResponseTokenPointer: string
      refreshRequestTokenPointer: string
      cookieName: string
      maxAgeInSeconds: number
      sameSiteAttribute?: string
      secureCookieAttribute?: boolean
      httpOnlyCookieAttribute?: boolean
    }
  }
  pages: {
    login: string
  }
  session: {
    dataType: Record<string, string>
  }
  refreshOnFocusChanged?: boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@dommidev10/nuxt-auth',
    configKey: 'auth',
  },

  defaults: {
    baseURL: '',
    endpoints: {
      signIn: { path: '/login', method: 'post' },
      signOut: { path: '/logout', method: 'post' },
      getSession: { path: '/me', method: 'get' },
    },
    token: {
      signInResponseTokenPointer: '/access_token',
      type: 'Bearer',
      cookieName: 'auth.token',
      headerName: 'Authorization',
      maxAgeInSeconds: 60 * 60 * 24,
    },
    refresh: {
      endpoint: { path: '/refresh', method: 'post' },
      refreshOnlyToken: true,
      token: {
        signInResponseRefreshTokenPointer: '/refresh_token',
        refreshResponseTokenPointer: '/refresh_token',
        refreshRequestTokenPointer: '/refresh_token',
        cookieName: 'auth.refresh_token',
        maxAgeInSeconds: 60 * 60 * 24 * 7,
        sameSiteAttribute: 'lax',
        secureCookieAttribute: true,
        httpOnlyCookieAttribute: true,
      },
    },
    pages: {
      login: '/auth/login',
    },
    session: {
      dataType: {},
    },
  },

  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // expose config to runtime
    nuxt.options.runtimeConfig.public.auth = defu(
      nuxt.options.runtimeConfig.public.auth as Record<string, any>,
      options
    )

    const runtimeDir = resolver.resolve('runtime') // 👈 on récupère le chemin vers runtime/

    // types
    nuxt.hook('prepare:types', opts => {
      opts.references.push({ path: resolver.resolve('runtime', 'types.d.ts') })
    })

    const middlewarePath = resolver.resolve('runtime/middleware/auth')
    const pluginPath = resolver.resolve('runtime/plugins/auth')
    const refreshPluginPath = resolver.resolve('runtime/plugins/refresh-on-focus.client')

    // Injecte tous les composables dans #imports
    addImportsDir(resolver.resolve(runtimeDir, 'composables'))

    addRouteMiddleware({
      name: 'auth',
      path: middlewarePath,
      global: true,
    })
    addPlugin(pluginPath)
    if (options.refreshOnFocusChanged) {
      addPlugin(refreshPluginPath)
    }

    // generate session type
    addTypeTemplate({
      filename: 'types/auth-session.d.ts',
      getContents: () => {
        const fields = Object.entries(options.session.dataType)
          .map(([key, type]) => `  ${key}: ${type}`)
          .join('\n')
        return `export interface AuthSession {\n${fields}\n}`
      },
    })

    // Sauvegarde pour les types
    nuxt.options.alias['@dommidev10/nuxt-auth'] = runtimeDir
    // 👇 transpile le runtime
    nuxt.options.build.transpile.push(resolver.resolve('runtime'))
  },
})
