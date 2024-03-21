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
  runtimeConfig: {
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
