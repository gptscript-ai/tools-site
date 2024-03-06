<template>
  <nav class="bg-blue-500 p-4">
    <ul class="flex space-x-4">
      <li><nuxt-link to="/" class="text-white hover:text-blue-200">Home</nuxt-link></li>
      <li><a :href="githubLink" class="text-white hover:text-blue-200">GitHub</a></li>
      <li><a :href="docsLink" class="text-white hover:text-blue-200">Docs</a></li>
    </ul>
  </nav>
</template>

<script setup>
import { links } from '@/lib/links.ts';
import { ref } from 'vue';
const githubLink = ref(links.github);
const docsLink = ref(links.docs);
</script>
