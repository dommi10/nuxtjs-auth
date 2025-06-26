// @vitest-environment nuxt
import { setup } from '@nuxt/test-utils'
import { describe, it, expect } from 'vitest'
import { resolve } from 'pathe'

// await setup({
//   rootDir: resolve(__dirname, '../playground'),
//   server: false,
// })

describe('useAuth.refresh', () => {
  it('should refresh token successfully', async () => {
    const { useAuth } = await import('#imports')
    const { refresh } = useAuth()

    const res = await refresh()
    expect(res).toBe(true)
  })
})
