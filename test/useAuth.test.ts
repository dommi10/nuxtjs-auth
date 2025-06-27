// @vitest-environment nuxt
import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockConfig = {
  public: {
    auth: {
      token: {
        cookieName: 'auth.token',
        type: 'Bearer',
        signInResponseTokenPointer: '/access_token',
        headerName: 'Authorization',
      },
      refresh: {
        token: {
          cookieName: 'auth.refresh_token',
          signInResponseRefreshTokenPointer: '/refresh_token',
          refreshResponseTokenPointer: '/refresh_token',
          refreshRequestTokenPointer: '/refresh_token',
        },
        endpoint: { path: '/refresh', method: 'post' },
        refreshOnlyToken: true,
      },
      endpoints: {
        signIn: { path: '/login', method: 'post' },
        signOut: { path: '/logout', method: 'post' },
        getSession: { path: '/me', method: 'get' },
      },
      pages: { login: '/auth/login' },
      baseURL: '',
      session: { dataType: {} },
    },
  },
}

describe('useAuth composable', () => {
  beforeEach(() => {
    // vi.resetModules()
    // vi.unmock('../src/runtime/composables/useAuth')
    // // Mock useRuntimeConfig si besoin (optionnel, si tu veux surcharger la config)
    // vi.doMock('#imports', () => ({
    //   useRuntimeConfig: () => mockConfig,
    //   useCookie: vi.fn(() => ({ value: null })),
    //   useState: vi.fn((key, init) => ({ value: init?.() ?? null })),
    //   navigateTo: vi.fn(),
    // }))
    // vi.stubGlobal(
    //   'useCookie',
    //   vi.fn(() => ({ value: null }))
    // )
    // vi.stubGlobal(
    //   'useState',
    //   vi.fn((key, init) => ({ value: init?.() ?? null }))
    // )
    // // Mock $fetch
    // globalThis.$fetch = vi.fn(async (url, opts) => {
    //   if (url.endsWith('/login')) {
    //     return {
    //       access_token: 'mocked_access_token',
    //       refresh_token: 'mocked_refresh_token',
    //     }
    //   }
    //   if (url.endsWith('/me')) {
    //     return { id: 1, name: 'Shanie' }
    //   }
    //   if (url.endsWith('/refresh')) {
    //     return { refresh_token: 'new_refresh_token' }
    //   }
    //   if (url.endsWith('/logout')) {
    //     return {}
    //   }
    //   return {}
    // }) as any
  })

  it('should be a function', async () => {
    const { useAuth } = await import('../src/runtime/composables/useAuth')
    expect(typeof useAuth).toBe('function')
  })

  // it('should sign in and fetch session', async () => {
  //   vi.resetModules()
  //   vi.unmock('../src/runtime/composables/useAuth')
  //   vi.stubGlobal('useRuntimeConfig', () => mockConfig)
  //   vi.stubGlobal(
  //     'useCookie',
  //     vi.fn(() => ({ value: null }))
  //   )
  //   vi.stubGlobal(
  //     'useState',
  //     vi.fn((key, init) => ({ value: init?.() ?? null }))
  //   )
  //   vi.stubGlobal('navigateTo', vi.fn())

  //   // Mock $fetch
  //   globalThis.$fetch = vi.fn(async (url, opts) => {
  //     if (url.endsWith('/login')) {
  //       return {
  //         access_token: 'mocked_access_token',
  //         refresh_token: 'mocked_refresh_token',
  //       }
  //     }
  //     if (url.endsWith('/me')) {
  //       return { id: 1, name: 'Shanie' }
  //     }
  //     if (url.endsWith('/refresh')) {
  //       return { refresh_token: 'new_refresh_token' }
  //     }
  //     if (url.endsWith('/logout')) {
  //       return {}
  //     }
  //     return {}
  //   }) as any

  //   const { useAuth } = await import('../src/runtime/composables/useAuth')
  //   const { signIn, session } = useAuth()
  //   const result = await signIn({ username: 'shanie', password: 'secret' })
  //   expect(result).toEqual({ id: 1, name: 'Shanie' })
  //   expect(session.value).toEqual({ id: 1, name: 'Shanie' })
  // })

  // it('should refresh token', async () => {
  //   vi.resetModules()
  //   vi.doMock('#imports', () => ({
  //     useRuntimeConfig: () => mockConfig,
  //     useCookie: vi.fn(() => ({ value: null })),
  //     useState: vi.fn((key, init) => ({ value: init?.() ?? null })),
  //     navigateTo: vi.fn(),
  //   }))

  //   // vi.stubGlobal(
  //   //   'useCookie',
  //   //   vi.fn(() => ({ value: null }))
  //   // )
  //   // vi.stubGlobal(
  //   //   'useState',
  //   //   vi.fn((key, init) => ({ value: init?.() ?? null }))
  //   // )

  //   // Mock $fetch
  //   globalThis.$fetch = vi.fn(async (url, opts) => {
  //     if (url.endsWith('/login')) {
  //       return {
  //         access_token: 'mocked_access_token',
  //         refresh_token: 'mocked_refresh_token',
  //       }
  //     }
  //     if (url.endsWith('/me')) {
  //       return { id: 1, name: 'Shanie' }
  //     }
  //     if (url.endsWith('/refresh')) {
  //       return { refresh_token: 'new_refresh_token' }
  //     }
  //     if (url.endsWith('/logout')) {
  //       return {}
  //     }
  //     return {}
  //   }) as any

  //   const { useAuth } = await import('../src/runtime/composables/useAuth')
  //   const { refresh } = useAuth()
  //   document.cookie = 'auth.refresh_token=mocked_refresh_token'
  //   const result = await refresh()
  //   expect(result).toBeUndefined()
  // })

  // it('should sign out and clear session', async () => {
  //   vi.resetModules()
  //   vi.doMock('#imports', () => ({
  //     useRuntimeConfig: () => mockConfig,
  //     useCookie: vi.fn(() => ({ value: null })),
  //     useState: vi.fn((key, init) => ({ value: init?.() ?? null })),
  //     navigateTo: vi.fn(),
  //   }))
  //   // vi.stubGlobal(
  //   //   'useCookie',
  //   //   vi.fn(() => ({ value: null }))
  //   // )
  //   // vi.stubGlobal(
  //   //   'useState',
  //   //   vi.fn((key, init) => ({ value: init?.() ?? null }))
  //   // )

  //   // Mock $fetch
  //   globalThis.$fetch = vi.fn(async (url, opts) => {
  //     if (url.endsWith('/login')) {
  //       return {
  //         access_token: 'mocked_access_token',
  //         refresh_token: 'mocked_refresh_token',
  //       }
  //     }
  //     if (url.endsWith('/me')) {
  //       return { id: 1, name: 'Shanie' }
  //     }
  //     if (url.endsWith('/refresh')) {
  //       return { refresh_token: 'new_refresh_token' }
  //     }
  //     if (url.endsWith('/logout')) {
  //       return {}
  //     }
  //     return {}
  //   }) as any
  //   const { useAuth } = await import('../src/runtime/composables/useAuth')
  //   const { signOut, session } = useAuth()
  //   session.value = { id: 1, name: 'Shanie' }
  //   await signOut()
  //   expect(session.value).toBe(null)
  // })
})
