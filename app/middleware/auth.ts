import { onAuthStateChanged } from 'firebase/auth'

export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) return

  const { $firebase } = useNuxtApp()
  const currentUser = await new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged($firebase.auth, (user) => {
      unsubscribe()
      resolve(user)
    })
  })

  if (!currentUser) {
    return navigateTo('/admin/login')
  }
})
