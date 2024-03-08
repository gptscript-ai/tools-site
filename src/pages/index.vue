<template>
  <div class="flex flex-col justify-center items-center min-h-screen">
    <h1 class="text-5xl font-bold mb-4">Explore GPTScript tools</h1>
    <div class="flex flex-wrap justify-center">
      <router-link to="/github.com/gptscript-ai/search" class="tile rounded bg-gray-200 p-4 m-2 text-2xlg">Search</router-link>
      <router-link to="/github.com/gptscript-ai/vision" class="tile rounded bg-gray-200 p-4 m-2 text-2xlg">Vision</router-link>
      <router-link to="/github.com/gptscript-ai/image-generation" class="tile rounded bg-gray-200 p-4 m-2 text-2xlg">Image Generation</router-link>
      <router-link to="/github.com/gptscript-ai/rag" class="tile rounded bg-gray-200 p-4 m-2 text-2xlg">RAG</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isInvalid = ref(false);
const errorMessage = ref('');
const placeHolder = ref('Search for a GPTScript Tool...');

onMounted(() => {
  if (route.query.isInvalid === 'true') {
    isInvalid.value = true;
    errorMessage.value = 'Not a valid repo';
  }
});
</script>