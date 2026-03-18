export default defineNuxtRouteMiddleware(async () => {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    return navigateTo('/admin/login')
  }
})
