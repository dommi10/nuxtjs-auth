// @vitest-environment nuxt
import { setup } from '@nuxt/test-utils'
import { describe, it, expect } from 'vitest'

describe('useAuth.getSession', () => {
  it('should return user session after token refresh', async () => {
    const { useAuth } = await import('#imports')
    const { getSession } = useAuth()

    const session = await getSession()

    expect(session).toEqual({ id: 1, name: 'Shanie' })
  })
})
