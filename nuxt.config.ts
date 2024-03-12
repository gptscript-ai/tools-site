// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: 'src',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    databaseUrl: '', // NUXT_DATABASE_URL
    parserUrl: '', // NUXT_PARSER_URL
    public: {
      parserUrl: '' // NUXT_PUBLIC_PARSER_URL
    }
  },
})
