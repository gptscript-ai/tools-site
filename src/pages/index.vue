<template>
    <div class="flex flex-col justify-center items-center min-h-screen">
        <h1 class="text-6xl font-semibold mb-10">Welcome to tools.gptscript.ai</h1>
        <div class="w-1/2 mb-10">
            <Search :placeholder="placeHolder" />
        </div>
        <div class="flex flex-wrap justify-center">
            <router-link to="/github.com/gptscript-ai/search/brave" class="tile rounded bg-gray-200 p-4 m-2 text-2xlg">Brave</router-link>
            <router-link to="/github.com/gptscript-ai/vision" class="tile rounded bg-gray-200 p-4 m-2 text-2xlg">Vision</router-link>
            <router-link to="/github.com/gptscript-ai/image-generation" class="tile rounded bg-gray-200 p-4 m-2 text-2xlg">Image Generation</router-link>
        </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isInvalid = ref(false);
const errorMessage = ref('');
const placeHolder = ref('Enter a tool\'s github URL to get started...');

onMounted(() => {
  if (route.query.isInvalid === 'true') {
    isInvalid.value = true;
    errorMessage.value = 'Not a valid repo';
  }
  document.title = 'tools.gptscript.ai';
});
</script>