import { defineNuxtConfig } from 'nuxt/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tsconfigPaths()
    ]
  },
  ssr: false,
  nitro: {
    preset: 'static'
  },
  app: {
    baseURL: '/games-list/'
  },
  runtimeConfig: {
    public: {
      apiBase: '/api'
    }
  }
})