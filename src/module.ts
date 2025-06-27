import {
  defineNuxtModule,
  createResolver,
  addPlugin,
  addImportsDir,
  addRouteMiddleware,
  addTypeTemplate,
} from '@nuxt/kit'
import { defu } from 'defu'
import type { ModuleOptions } from './runtime/types/module.types'

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
      sameSiteAttribute: 'lax',
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

    // Expose the module config to runtimeConfig for both client and server access
    nuxt.options.runtimeConfig.public.auth = defu(
      nuxt.options.runtimeConfig.public.auth as Record<string, any>,
      options
    )

    // Add a types reference for IDE autocompletion in the Nuxt app
    nuxt.hook('prepare:types', opts => {
      opts.references.push({ path: resolver.resolve('runtime', 'types.d.ts') })
    })

    const middlewarePath = resolver.resolve('runtime/middleware/auth.client')
    const pluginPath = resolver.resolve('runtime/plugins/auth')
    const refreshPluginPath = resolver.resolve('runtime/plugins/refresh-on-focus.client')

    // Expose all composables from the module to Nuxt's #imports
    addImportsDir(resolver.resolve('runtime/composables'))

    // Register the auth middleware
    // If globalMiddleware is true (default), it applies to all pages
    // Otherwise, the user can add it manually to pages/layouts via middleware: ['auth']
    addRouteMiddleware({
      name: 'auth',
      path: middlewarePath,
      global: options.globalMiddleware ?? false,
    })

    // Register the main auth plugin
    addPlugin(pluginPath)

    // Register the refresh-on-focus plugin if enabled (optional)
    if (options.refreshOnFocusChanged) {
      addPlugin(refreshPluginPath)
    }

    // Dynamically generate the AuthSession type based on user config
    addTypeTemplate({
      filename: 'types/auth-session.d.ts',
      getContents: () => {
        const fields = Object.entries(options.session.dataType)
          .map(([key, type]) => `  ${key}: ${type}`)
          .join('\n')
        return `export interface AuthSession {\n${fields}\n}`
      },
    })
  },
})
