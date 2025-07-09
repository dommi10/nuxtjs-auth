// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'
import pluginPrettier from 'eslint-plugin-prettier'
import pluginVue from 'eslint-plugin-vue'

// Run `npx @eslint/config-inspector` to inspect the resolved config interactively
export default createConfigForNuxt({
  features: {
    // Rules for module authors
    tooling: true,
    // Rules for formatting
    stylistic: true,
  },
  dirs: {
    src: ['./playground'],
  },
})
  .append({
    // Ajoute Prettier comme plugin ESLint
    plugins: {
      vue: pluginVue,
      prettier: pluginPrettier,
    },
    rules: {
      // Active la règle ESLint pour détecter les erreurs de format Prettier
      'prettier/prettier': 'error',
      'vue/max-attributes-per-line': [
        'error',
        {
          singleline: 1,
          multiline: 1,
        },
      ],
      '@stylistic/brace-style': ['error', '1tbs'],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
    },
  })
  .append({
    // Ajoute Prettier comme plugin ESLint
    plugins: {
      prettier: pluginPrettier,
    },
  })
