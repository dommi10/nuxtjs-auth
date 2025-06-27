# Nuxt Auth Module

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

A flexible and fully-typed authentication module for Nuxt 3.  
Supports token-based auth, refresh tokens, session management, route protection, and more.

> **Inspired by [sidebase/nuxt-auth](https://github.com/sidebase/nuxt-auth)**  
> This module aims to provide a minimal, type-safe, and backend-agnostic Nuxt 3 auth solution for token and refresh token flows.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
- [📖 &nbsp;API Reference](./src/runtime/types/module.types.ts)

---

## Features

- 🔒 Token-based authentication (access & refresh tokens)
- 🍪 Secure cookie management (configurable)
- 🔁 Automatic token refresh (with optional refresh-on-focus)
- 🛡 Route protection via middleware (global or per-page)
- 🧑‍💻 Type-safe session object (customizable)
- ⚡️ Simple composable API: `useAuth()`
- 🧩 Easy integration with any backend

---

## Quick Setup

Install the module in your Nuxt application:

```bash
npx nuxi module add @dommidev10/nuxt-auth
# or
npm install @dommidev10/nuxt-auth
```

Add it to your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['@dommidev10/nuxt-auth'],
  auth: {
    baseURL: 'http://localhost:4000/auth',
    endpoints: {
      signIn: { path: '/login', method: 'post' },
      signOut: { path: '/logout', method: 'post' },
      getSession: { path: '/me', method: 'get' },
    },
    token: {
      signInResponseTokenPointer: '/access_token',
      type: 'Bearer',
      cookieName: 'auth.token',
      headerName: 'Authorization',
      maxAgeInSeconds: 86400,
      sameSiteAttribute: 'lax',
    },
    refresh: {
      endpoint: { path: '/refresh', method: 'post' },
      refreshOnlyToken: true,
      token: {
        signInResponseRefreshTokenPointer: '/refresh_token',
        refreshResponseTokenPointer: '/access_token',
        refreshRequestTokenPointer: '/refresh_token',
        cookieName: 'auth.refresh_token',
        maxAgeInSeconds: 604800,
        sameSiteAttribute: 'lax',
      },
    },
    pages: {
      login: '/auth/login',
    },
    session: {
      dataType: {
        id: 'string',
        name: 'string',
      },
    },
    globalMiddleware: true, // Set to false to use per-page middleware
    refreshOnFocusChanged: true, // Only refresh if token is expired
  },
})
```

---

## Usage

### 1. Use the composable in your app

```ts
const { session, signIn, signOut, refresh, getSession, token } = useAuth()
```

- `session`: Reactive user session object (typed)
- `signIn(credentials)`: Log in and set tokens/session
- `signOut()`: Log out and clear tokens/session
- `refresh()`: Refresh the access token using the refresh token
- `getSession()`: Fetch the current session from your API
- `token`: Reactive access token (from cookie)

### 2. Protecting routes

#### Global protection (default)

All routes are protected by default. Unauthenticated users are redirected to your login page.

#### Per-page protection

Set `globalMiddleware: false` in your config, then add the middleware to any page or layout:

```ts
export default defineNuxtPage({
  middleware: ['auth'],
})
```

### 3. Customizing the session type

Define your session fields in `session.dataType` in your config.  
This will generate a TypeScript interface for autocompletion in your app.

```ts
session: {
  dataType: {
    id: 'string',
    name: 'string',
    email: 'string'
  }
}
```

---

## How it works

- **Tokens** are stored in cookies with your chosen options (secure, httpOnly, sameSite, etc).
- **Session** is fetched from your API and kept in a reactive state.
- **Middleware** checks authentication before each route navigation.
- **Refresh-on-focus** (if enabled) only calls the refresh endpoint if the token is expired, to avoid unnecessary backend calls.

---

## Minimal Example

This module is intentionally minimal and backend-agnostic.  
You only need to provide the endpoints and token pointers that match your backend API.

```ts
auth: {
  baseURL: 'http://localhost:4000/auth',
  endpoints: {
    signIn: { path: '/login', method: 'post' },
    signOut: { path: '/logout', method: 'post' },
    getSession: { path: '/me', method: 'get' }
  },
  token: {
    signInResponseTokenPointer: '/access_token',
    cookieName: 'auth.token',
    headerName: 'Authorization',
    maxAgeInSeconds: 86400,
    sameSiteAttribute: 'lax'
  },
  refresh: {
    endpoint: { path: '/refresh', method: 'post' },
    token: {
      signInResponseRefreshTokenPointer: '/refresh_token',
      refreshResponseTokenPointer: '/access_token',
      refreshRequestTokenPointer: '/refresh_token',
      cookieName: 'auth.refresh_token',
      maxAgeInSeconds: 604800,
      sameSiteAttribute: 'lax'
    }
  },
  pages: { login: '/auth/login' },
  session: { dataType: { id: 'string', name: 'string' } }
}
```

---

## FAQ

**Q: Can I use this with any backend?**  
A: Yes! Just configure the endpoints and token pointers to match your API.

**Q: How do I add public pages?**  
A: Set `globalMiddleware: false` and only add the middleware to protected pages.

**Q: How do I add extra fields to the session?**  
A: Add them to `session.dataType` in your config.

**Q: Does refreshOnFocusChanged spam my backend?**  
A: No, it only triggers a refresh if the token is expired.

---

## Contribution

<details>
  <summary>Local development</summary>
  
  ```bash
  # Install dependencies
  npm install
  
  # Generate type stubs
  npm run dev:prepare
  
  # Develop with the playground
  npm run dev
  
  # Build the playground
  npm run dev:build
  
  # Run ESLint
  npm run lint
  
  # Run Vitest
  npm run test
  npm run test:watch
  
  # Release new version
  npm run release
  ```

</details>

---

## License

[MIT](./LICENSE)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/my-module/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/my-module
[npm-downloads-src]: https://img.shields.io/npm/dm/my-module.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/my-module
[license-src]: https://img.shields.io/npm/l/my-module.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/my-module
[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com
