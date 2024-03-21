import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'
import typography from '@tailwindcss/typography'

export default <Partial<Config>> {
  content: [
    './src/components/**/*.{js,vue,ts}',
    './src/layouts/**/*.vue',
    './src/pages/**/*.vue',
    './src/plugins/**/*.{js,ts}',
    './src/app.vue',
    './src/error.vue',
  ],

  darkMode: 'class',

  plugins: [
    typography,
  ],

  theme: {
    fontFamily: { sans: ['Poppins', ...defaultTheme.fontFamily.sans] },

    extend: {
      colors: {
        transparent: 'transparent',
        current:     'currentColor',
        acornblue:   '#4f7ef3',
        acornpurple: '#380067',
        acornteal:   '#2ddcec',
        acornred:    '#ff4044',
        acornorange: '#ff7240',
        acornyellow: '#fdcc11',
        acorngreen:  '#06eaa7',
      },

      fontFamily: { poppins: ['Poppins', 'sans-serif'] },
    },
  },
}
