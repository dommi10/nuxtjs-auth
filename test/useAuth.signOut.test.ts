// @vitest-environment nuxt
import { setup } from '@nuxt/test-utils'
import { describe, it, expect } from 'vitest'
import { resolve } from 'pathe'

describe('useAuth.signOut', () => {
  it('should clear session and tokens', async () => {
    const { useAuth } = await import('#imports')
    const { signOut, session } = useAuth()

    await signOut()

    expect(session.value).toBe(null)
  })
})
