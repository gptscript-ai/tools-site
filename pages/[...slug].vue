<template>
  <div class="flex flex-col mt-16 mx-24">
    <Tool class="w-3/4" :tools="tools" :title="title" :githubUrl="githubUrl"/>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { Tool } from '@/lib/types';

const tools = ref([] as Tool[])
const githubUrl = ref('');
const title = ref('')

onMounted(async () => {
  loadData();
});

onBeforeMount(async () => {
  loadData();
});

const loadData = async () => {
  const route = useRoute();
  const router = useRouter();

  const path = route.path.replace(/^\//, '');
  const validRepo = /^(https?:\/\/)?(www\.)?github\.com\/[\w-]+\/[\w-]+$/.test(path);

  if (!validRepo) {
    router.push({ path: '/404', query: { isInvalid: 'true' } });
  }
  githubUrl.value = path;

  const [owner, repo] = path.split('/').slice(-2);
  title.value = repo;

  try {
    const toolResponse = await useFetch(`https://raw.githubusercontent.com/${owner}/${repo}/main/tool.gpt`);
    const parserResponse = await fetch("http://localhost:8080", {
      method: 'POST',
      body: toolResponse.data.value as string,
      headers: {
        'Content-Type': 'text/plain',
      }
    });
    const parserResponseBody = await parserResponse.text();
    const parsedTools = JSON.parse(parserResponseBody) as Tool[];
    tools.value = parsedTools;
  } catch (error) {
    console.error(error);
  }
}
</script>
