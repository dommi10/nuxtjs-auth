import { defineNuxtRouteMiddleware, navigateTo, useRuntimeConfig } from '#imports'
import { useAuth } from '../composables/useAuth'

export default defineNuxtRouteMiddleware((to, from) => {
  const config = useRuntimeConfig().public.auth
  const { session } = useAuth()

  // Ne redirige pas si on est déjà sur la page de login
  if (to.path === config.pages.login) return

  if (!session.value) {
    return navigateTo(config.pages.login)
  }
})
