<script lang="ts" setup>
const { session, signIn, signOut, refresh, getSession, token } = useAuth()

const credentials = ref({ phone: '243971955445', password: 'adminadmin', otp: '1868' })
const loginError = ref('')
const loading = ref(false)

async function handleLogin() {
  loading.value = true
  loginError.value = ''
  try {
    await signIn(credentials.value)
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error('Login error:', e.message)
    } else {
      const error = e as { message?: string }
      loginError.value = error?.message || 'Login failed'
    }
  }
  loading.value = false
}

async function handleLogout() {
  await signOut()
}

async function handleRefresh() {
  await refresh()
}

async function handleSession() {
  await getSession()
}
</script>

<template>
  <div>
    <h2>Nuxt module playground!</h2>
    <div>
      <label>
        Username:
        <input v-model="credentials.phone" />
      </label>
      <label>
        Password:
        <input v-model="credentials.password" type="password" />
      </label>
      <button :disabled="loading" @click="handleLogin()">Login</button>
      <button @click="handleLogout">Logout</button>
      <button @click="handleRefresh">Refresh Token</button>
      <button @click="handleSession">Refresh Session</button>
      <div v-if="loginError" style="color: red">
        {{ loginError }}
      </div>
    </div>
    <div>
      <h3>Session</h3>
      <pre>{{ session }}</pre>
      <h3>token</h3>
      <pre>{{ token }}</pre>
    </div>
  </div>
</template>
