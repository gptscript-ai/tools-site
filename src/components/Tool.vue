<template>
    <div class="tool-container prose">
        <h1 class="mb-0">{{ props.repo }}</h1>
        <a :href="githubUrl" target="_blank" class="text-blue-500 underline">{{ githubUrl }}</a>
        <div v-for="tool in tools" :key="tool.id">
            <h2 :id="'tool-' + tool.name">{{ tool.name }}</h2>
            <p class="">{{ tool.description }}</p>

            <h3 :id="tool+ '-arguments'">Arguments</h3>
            <table>
              <tbody>
                <tr v-for="(properties, arg) in tool.arguments?.properties" :key="arg">
                  <td class="font-semibold">{{ arg }}</td>
                  <td class="">{{ properties.description }}</td>
                </tr>
              </tbody>
            </table>

            <h3 v-if="tool.tools && tool.tools.length" :id="tool.name + 'tools-used'">Tools used</h3>
            <div v-if="tool.tools && tool.tools.length">
                <p v-for="(usedTool) in tool.tools" :key="usedTool">{{ usedTool }}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Tool } from '@/lib/types';

const props = defineProps({
    owner: String,
    repo: String,
});

const tools = ref([] as Tool[])
const githubUrl = ref('');

githubUrl.value = `https://github.com/${props.owner}/${props.repo}`;

try {
  const toolResponse = await useFetch(`https://raw.githubusercontent.com/${props.owner}/${props.repo}/main/tool.gpt`);
  const parserResponse = await fetch(useRuntimeConfig().public.parserUrl as string, {
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

</script>
