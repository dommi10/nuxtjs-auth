export default defineNuxtConfig({
  modules: ['../src/module'],
  devtools: { enabled: true },
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
      maxAgeInSeconds: 60,
      sameSiteAttribute: 'lax',
      secureCookieAttribute: false,
      httpOnlyCookieAttribute: false,
    },
    refresh: {
      endpoint: { path: '/refresh', method: 'post' },
      refreshOnlyToken: true,
      token: {
        signInResponseRefreshTokenPointer: '/refresh_token',
        refreshResponseTokenPointer: '/access_token',
        refreshRequestTokenPointer: '/refresh_token',
        cookieName: 'auth.refresh_token',
        maxAgeInSeconds: 60 * 60 * 24 * 30, // 30 days
        sameSiteAttribute: 'lax',
        secureCookieAttribute: false,
        httpOnlyCookieAttribute: false,
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
    refreshOnFocusChanged: true,
  },
})
