export default defineNuxtRouteMiddleware((to, form) => {
  const authStore = useAuthStore()

  if(to.name !== 'login' && !authStore.isLogin) {
    return navigateTo('/login');
  }
})