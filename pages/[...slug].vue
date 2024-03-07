<template>
  <div class="flex flex-col mt-24 mx-24">
    <a :href="githubUrl ? `https://${githubUrl}` : ''" target="_blank" class="text-blue-500 underline">{{ githubUrl }}</a>
    <Markdown :markdown="readmeData" />
    <div class="mt-8">
      <h2 class="text-2xl font-bold">tool.gpt</h2>
      <div class="overflow-auto max-h-96">
        <Markdown :markdown="toolData" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { base64Decode } from '@/lib/decode';

const toolData = ref('');
const readmeData = ref('');
const githubUrl = ref('');

onMounted(async () => {
  loadData();
});

onBeforeMount(async () => {
  loadData();
});

async function loadData() {
  const route = useRoute();
  const router = useRouter();

  const path = route.path.replace(/^\//, '');
  const validRepo = /^(https?:\/\/)?(www\.)?github\.com\/[\w-]+\/[\w-]+$/.test(path);

  if (!validRepo) {
    router.push({ path: '/404', query: { isInvalid: 'true' } });
  }
  githubUrl.value = path;

  const [owner, repo] = path.split('/').slice(-2);
  try {
    const [toolResponse, readmeResponse] = await Promise.all([
      useFetch(`/api/github?owner=${owner}&repo=${repo}&path=tool.gpt`),
      useFetch(`/api/github?owner=${owner}&repo=${repo}&path=README.md`),
    ]);

    toolData.value = base64Decode(toolResponse.data.value ?? '');
    readmeData.value = base64Decode(readmeResponse.data.value ?? '');
  } catch (error) {
    throw error;
  }
}
</script>
