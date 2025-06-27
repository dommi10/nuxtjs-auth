import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    // globals: true,
    environment: 'nuxt',
    setupFiles: ['./test/setup.ts'],
    // deps: {
    //   inline: [/nuxt/],
    // },
    // environmentOptions: {
    //   nuxt: {
    //     domEnvironment: 'happy-dom',
    //   },
    // },
  },
})
