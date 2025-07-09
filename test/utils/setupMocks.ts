import { beforeEach, vi } from 'vitest'

beforeEach(() => {
  // Mock global fetch to simulate Nuxt's $fetch behavior
  globalThis.fetch = vi.fn(async (input: RequestInfo) => {
    const url = typeof input === 'string' ? input : input.toString()

    if (url.endsWith('/login')) {
      return new Response(
        JSON.stringify({
          access_token: 'mocked_access_token',
          refresh_token: 'mocked_refresh_token',
        }),
      )
    }

    if (url.endsWith('/refresh')) {
      return new Response(
        JSON.stringify({
          access_token: 'new_access_token',
        }),
      )
    }

    if (url.endsWith('/me')) {
      return new Response(
        JSON.stringify({
          id: 1,
          name: 'Shanie',
        }),
      )
    }

    if (url.endsWith('/logout')) {
      return new Response(null, { status: 200 })
    }

    return new Response(null, { status: 401 })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any

  // Mock useCookie for all auth-related cookies

  vi.mock('#app', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const actual = await vi.importActual<any>('#app')

    return {
      ...actual,
      useCookie: vi.fn((name: string) => {
        const store: { [key: string]: string } = {
          'auth.token': 'expired_access_token',
          'auth.refresh_token': 'mocked_refresh_token',
        }

        return {
          get value() {
            return store[name] ?? null
          },
          set value(val) {
            store[name] = val
          },
        }
      }),
    }
  })
})
