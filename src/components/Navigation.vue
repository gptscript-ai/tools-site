<script setup>
import { links } from '@/lib/links.ts'

const route = useRoute()
const mobileSearch = ref(false)
</script>

<template>
  <nav class="navbar bg-gray-800">
    <ul class="flex justfiy-between items-center p-4 h-full">
      <li class="text-nowrap">
        <nuxt-link to="/">
          <img src="@/assets/img/logo.svg" alt="Logo" class="h-10 mr-2 inline">
          <img src="@/assets/img/logotype.svg" alt="Logo" class="invert hidden md:inline" style="height: 30px">
        </nuxt-link>
      </li>

      <li class="flex-grow" />

      <template v-if="route.name !== 'index'">
        <template v-if="mobileSearch">
          <li class="flex-grow">
            <Search placeholder="Search for a tool…" class="w-full" />
          </li>
          <li>
            <UButton icon="i-heroicons-x-mark" size="xs" class="relative left-2 z-100" @click="mobileSearch = false" />
          </li>
        </template>
        <template v-else>
          <li class="hidden md:flex md:w-64 lg:w-96 mr-2">
            <Search placeholder="Search for a tool…" />
          </li>
          <li class="md:hidden">
            <UButton variant="link" icon="i-heroicons-magnifying-glass" @click="mobileSearch = true" />
          </li>
        </template>
      </template>

      <template v-if="!mobileSearch">
        <li class="text-nowrap">
          <UButton variant="link" to="/search?q=.">
            All Tools
          </UButton>
        </li>
        <li class="text-nowrap">
          <UButton variant="link" :to="links.github" target="_blank" rel="nofollow noopener noreferrer">
            GitHub
            <UIcon name="i-heroicons-arrow-top-right-on-square" class="hidden md:inline-block align-text-top" />
          </UButton>
        </li>
        <li class="text-nowrap">
          <UButton variant="link" :to="links.docs" target="_blank" rel="nofollow noopener noreferrer">
            Docs
            <UIcon name="i-heroicons-arrow-top-right-on-square" class="hidden md:inline-block align-text-top" />
          </UButton>
        </li>
        <li>
          <DisplayMode />
        </li>
      </template>
    </ul>
  </nav>
</template>
