// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    // todo: the github call has to be moved to the server side
    public: {
      githubToken: '', // NUXT_PUBLIC_GITHUB_TOKEN
    },
  },
})
