import { setup } from '@nuxt/test-utils'
import { resolve } from 'path'

await setup({
  rootDir: resolve(__dirname, '../playground'),
  server: false,
})
