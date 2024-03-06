<template>
  <nav class="bg-blue-500 p-4 flex justify-between">
    <ul class="flex space-x-4">
      <li><nuxt-link to="/" class="text-white hover:text-blue-200">Home</nuxt-link></li>
      <li><a :href="githubLink" class="text-white hover:text-blue-200">GitHub</a></li>
      <li><a :href="docsLink" class="text-white hover:text-blue-200">Docs</a></li>
    </ul>
    <div class="flex items-center w-96">
      <Search :placeholder="placeHolder" />
    </div>
  </nav>
</template>

<script setup>
import { links } from '@/lib/links.ts';
import { ref } from 'vue';

const placeHolder = ref('Search for a GPTScript Tool...');

const githubLink = ref(links.github);
const docsLink = ref(links.docs);
</script>
