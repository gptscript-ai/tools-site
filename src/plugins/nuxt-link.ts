export default defineNuxtPlugin(() => {
  defineNuxtLink({
    externalRelAttribute: 'noopener noreferrer nofollow',
    activeClass:          'active',
    exactActiveClass:     'exact-active',
  })
})
