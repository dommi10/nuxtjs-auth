import { resolve } from 'node:path'
import { setup } from '@nuxt/test-utils'

await setup({
  rootDir: resolve(__dirname, '../playground'),
  server: false,
})
