<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <h1 class="text-4xl font-bold mb-4">GitHub URL</h1>
    <p class="text-lg">URL: {{ githubUrl }}</p>

    <div class="mt-8">
      <h2 class="text-2xl font-bold">tool.gpt</h2>
      <pre class="bg-gray-200 p-4">{{ toolFileData }}</pre>
    </div>

    <div class="mt-8">
      <h2 class="text-2xl font-bold">README.md</h2>
      <pre class="bg-gray-200 p-4">{{ readmeData }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchGithubFile } from '@/lib/file'; // Import the fetchGithubFile function

const route = useRoute();
const router = useRouter();

const path = route.path.replace(/^\//, ''); // Strip the leading slash

const githubUrl = computed(() => {
  const githubRepoRegex = /^(https?:\/\/)?(www\.)?github\.com\/[\w-]+\/[\w-]+$/;

  if (githubRepoRegex.test(path)) {
    return path;
  }
  return null;
});

const toolFileData = ref('');
const readmeData = ref('');

onMounted(async () => {
  routeIfInvalid();
  toolFileData.value = await fetchGithubFile('tool.gpt');
  readmeData.value = await fetchGithubFile('README.md');
});

const routeIfInvalid = () => {
  if (!githubUrl.value) {
    router.push({ path: '/404', query: { isInvalid: 'true' } });
  }
};

</script>

<style scoped>
  .h-screen {
    height: 100vh;
  }
</style>
