import { useAuth } from '../composables/useAuth'
import { defineNuxtRouteMiddleware, navigateTo, useRuntimeConfig } from '#imports'

export default defineNuxtRouteMiddleware((to, _) => {
  const config = useRuntimeConfig().public.auth
  const { session } = useAuth()

  // Ne redirige pas si on est déjà sur la page de login
  if (to.path === config.pages.login) return

  if (!session.value) {
    return navigateTo(config.pages.login)
  }
})
