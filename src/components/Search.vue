<script setup lang="ts">
const searchTerm = ref('')
const route = useRoute()

// Clear the search when the route changes
watch(() => [route.path, route.query], () => {
  searchTerm.value = ''
})

function submitSearch() {
  // if searchTerm is a valid github URL, navigate to its tool page
  if (/^(https?:\/\/)?(www\.)?github\.com\/[\w-]+\/[\w-]+(\/[\w-]+)*$/.test(searchTerm.value)) {
    useRouter().push(`/${searchTerm.value.replace(/^https?:\/\//, '')}`)
  } else {
    navigateTo({ name: 'search', query: { q: searchTerm.value } })
  }
}
</script>

<template>
  <div class="w-full mx-auto">
    <form action="/search" @submit.prevent="submitSearch">
      <UInput
        v-model="searchTerm"
        name="q"
        type="search"
        color="white"

        icon="i-heroicons-magnifying-glass"
        v-bind="$attrs"
      >
        <template v-for="(_, name) in $slots" #[name]="slotData">
          <slot :name="name" v-bind="slotData" />
        </template>
      </UInput>
      <noscript><input type="submit">Search</input></noscript>
    </form>
  </div>
</template>
