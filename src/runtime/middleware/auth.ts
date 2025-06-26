import { defineNuxtRouteMiddleware, navigateTo, useRuntimeConfig } from '#imports'
import { useAuth } from '../composables/useAuth'

export default defineNuxtRouteMiddleware(() => {
  const config = useRuntimeConfig().public.auth
  const { session } = useAuth()

  if (!session.value) {
    return navigateTo(config.pages.login)
  }
})
