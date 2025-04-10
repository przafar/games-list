import { createPinia } from 'pinia'

export default defineNuxtPlugin((nuxtApp: any) => {
  nuxtApp.vueApp.use(createPinia())
})