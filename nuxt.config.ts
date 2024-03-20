// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: 'src',
  devtools: { enabled: true },
  css: ['@/assets/css/main.css'],
  modules: [
    '@nuxt/ui',
    '@nuxtjs/tailwindcss'
  ],
  runtimeConfig: {
    databaseUrl: '', // NUXT_DATABASE_URL
    parserUrl: '', // NUXT_PARSER_URL
    githubToken: '', // NUXT_GITHUB_TOKEN
  },
})
