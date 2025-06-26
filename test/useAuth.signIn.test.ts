// @vitest-environment nuxt
import { setup } from '@nuxt/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { resolve } from 'pathe'

describe('useAuth composable', () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn(async (input: RequestInfo, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input.toString()

      if (url.endsWith('/login')) {
        return new Response(
          JSON.stringify({
            access_token: 'mocked_access_token',
            refresh_token: 'mocked_refresh_token',
          })
        )
      }

      if (url.endsWith('/me')) {
        return new Response(
          JSON.stringify({
            id: 1,
            name: 'Shanie',
          })
        )
      }

      return new Response(null, { status: 404 })
    }) as any

    // Optionnel : mock de useCookie
    vi.mock('#app', async () => {
      const actual = await vi.importActual<any>('#app')
      return {
        ...actual,
        useCookie: vi.fn((name: string) => ({ value: null })),
      }
    })
  })

  it('should sign in and fetch session data', async () => {
    const { useAuth } = await import('#imports')
    const { signIn, session } = useAuth()

    const result = await signIn({ username: 'shanie', password: 'secret' })

    expect(result).toEqual({ id: 1, name: 'Shanie' })
    expect(session.value).toEqual({ id: 1, name: 'Shanie' })
  })
})
