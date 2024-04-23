// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  components: true,
  css:        ['@/assets/css/main.scss'],
  colorMode:  { classSuffix: '' },
  devtools:   { enabled: true },
  devServer:  {
    port:  3000,
    https: {
      cert: 'src/server/tls/localhost.crt',
      key:  'src/server/tls/localhost.key',
    },
  },
  modules: [
    '@nuxt/ui',
    '@nuxtjs/tailwindcss',
  ],
  routeRules:    {
    // Allow cross-origin requests for the API (GPTStudio needs this)
    '/api/**': { cors: true },
  },
  runtimeConfig: {
    public: {
      // Anything in here is exposed to the client, do not put secrets in here
      googleAnalytics: '', // NUXT_PUBLIC_GOOGLE_ANALYTICS
    },

    // Things in this section are private and only available on the server side
    databaseUrl: '', // NUXT_DATABASE_URL
    parserUrl:   '', // NUXT_PARSER_URL
    githubToken: '', // NUXT_GITHUB_TOKEN
  },
  srcDir: 'src',
  vite:   {
    build: {
      manifest:      true,
      ssrManifest:   true,
      sourcemap:     true,
    },

    css: { devSourcemap: true },
  },
})
