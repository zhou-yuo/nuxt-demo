// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  css: ['~/assets/css/base.scss'],
  modules: [
    '@unocss/nuxt', 
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt'
  ],
  app: {
    head: {
      title: 'Nuxt Demo',
      htmlAttrs: {
        lang: 'zh-CN'
      }
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  runtimeConfig: {
    public: {
      apibase: '/'
    }
  }
})