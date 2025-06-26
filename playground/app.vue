<template>
  <div>Nuxt module playground!</div>
</template>

<script setup ts>
const { session } = useAuth()

onMounted(() => {
  console.log('Session:', session.value)
  if (session.value) {
    console.log('User is authenticated:', session.value.user)
  } else {
    console.log('No user is authenticated')
  }
})
</script>
