<script setup lang="ts">
interface Tool {
  icon?: string
  name:  string
  link:  string
}

const featured: Tool[] = [
  { name: 'Search', icon: 'i-heroicons-magnifying-glass', link: '/github.com/gptscript-ai/search/brave' },
  { name: 'Vision', icon: 'i-heroicons-camera', link: '/github.com/gptscript-ai/vision' },
  { name: 'Image Generation', icon: 'i-heroicons-paint-brush', link: '/github.com/gptscript-ai/image-generation' },
  { name: 'Browser', icon: 'i-heroicons-tv', link: '/github.com/gptscript-ai/browser' },
  { name: 'System Tools', icon: 'i-heroicons-wrench', link: '/search?q=sys.' },
]
</script>

<template>
  <div class="h-full text-center justify-start md:justify-center items-center p-10 flex flex-col">
    <h2 class="text-4xl md:text-5xl mb-4 mx-2">
      Welcome to the GPTScript Toolbox
    </h2>
    <h3 class="text-lg text-gray-500 mb-4">
      Looking for something?
      <br class="md:hidden">
      There's probably a tool for it.
    </h3>

    <div class="w-screen">
      <Search class="inline-block w-[90%] xl:w-[50vw] mb-1" size="xl" placeholder="Search for a tool or enter a GitHub URL to index one…" />
    </div>

    <UDivider class="md:hidden my-10" :ui="{ label: 'text-gray-500 text-lg font-normal' }" />

    <div class="flex justify-center flex-col md:w-initial md:flex-row">
      <UButton
        v-for="(tool, idx) in featured"
        :key="idx"
        :icon="tool.icon"
        :to="tool.link"
        size="lg"
        variant="ghost"
        class="m-1 flex-grow md:flex-initial"
      >
        {{ tool.name }}
      </UButton>
    </div>
  </div>
</template>
