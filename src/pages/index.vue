<template>
    <div class="flex flex-col justify-center items-center min-h-screen">
        <div class="w-full justify-center items-center mt-60 md:mt-24">
            <div class="text-center mb-10 mx-10">
                <h2 class="text-4xl md:text-5xl mb-4 ">Welcome to tools.gptscript.ai</h2>
                <h3 class="text-lg text-gray-500">Looking for something? There's probably a tool for it...</h3>
            </div>
            <div class="w-full md:w-3/4 lg:w-1/2 mb-10 mx-auto px-10">
                <Search :placeholder="placeHolder" />
            </div>
        </div>
        <hr class="mt-4 mb-14 w-3/5 md:hidden">
        <div class="w-4/5 mb-14 md:w-full md:w-inherit flex flex-wrap justify-center flex-col md:flex-row">
            <router-link to="/github.com/gptscript-ai/search/brave" class="rounded bg-gray-200 p-4 m-2 text-2xl hover:bg-green-300">Search</router-link>
            <router-link to="/github.com/gptscript-ai/vision" class="rounded bg-gray-200 p-4 m-2 text-2xl hover:bg-green-300">Vision</router-link>
            <router-link to="/github.com/gptscript-ai/image-generation" class="rounded bg-gray-200 p-4 m-2 text-2xl hover:bg-green-300">Image Generation</router-link>
            <router-link to="/github.com/gptscript-ai/browser" class="rounded bg-gray-200 p-4 m-2 text-2xl hover:bg-green-300">Browser</router-link>
            <router-link to="/search?q=sys." class="rounded bg-gray-200 p-4 m-2 text-2xl hover:bg-green-500">System Tools</router-link>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isInvalid = ref(false);
const errorMessage = ref('');
const placeHolder = ref('Search for a tool to get started...');

onMounted(() => {
  if (route.query.isInvalid === 'true') {
    isInvalid.value = true;
    errorMessage.value = 'Not a valid repo';
  }
  document.title = 'tools.gptscript.ai';
});
</script>