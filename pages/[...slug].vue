<template>
  <div class="flex flex-col items-center justify-center mt-8">
    <h1 class="text-4xl font-bold mb-4">GitHub URL</h1>
    <pre class="text-lg">URL: {{ githubUrl }}</pre>

    <div class="container">
      <div class="mt-8 mx-auto element border border-gray-300 rounded-md p-4">
        <h2 class="text-2xl font-bold">tool.gpt</h2>
        <div class="overflow-auto max-h-96">
          <pre class="bg-gray-200 p-4 mb-4 text-sm whitespace-pre-wrap">{{ toolFileData }}</pre>
        </div>
      </div>

      <div class="mt-8 mx-auto element border border-gray-300 rounded-md p-4">
        <h2 class="text-2xl font-bold">README.md</h2>
        <div class="overflow-auto max-h-96 mx-4">
          <Markdown :markdown="readmeData" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchGithubFile } from '@/lib/github'; // Import the fetchGithubFile function

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

  const [owner, repo] = path.split('/').slice(-2);
  toolFileData.value = await fetchGithubFile(owner, repo, 'tool.gpt');
  readmeData.value = await fetchGithubFile(owner, repo, 'README.md');
});

const routeIfInvalid = () => {
  if (!githubUrl.value) {
    router.push({ path: '/404', query: { isInvalid: 'true' } });
  }
}

</script>~/lib/github