<template>
  <div>
    <div v-if="!error.status" class="flex">
      <div class="hidden md:block border-r border-gray-200">
        <Sidebar :headers="tools.map(tool => tool.name)" class="mt-28 sticky top-28 px-20"/>
      </div>

      <div class="prose my-28 mx-20">
        <h1 class="mb-0">{{ path }}</h1>
        <a :href="githubURL" target="_blank" class="text-blue-500 underline">{{ githubURL }}</a>
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
    </div>
    
    <Error class="flex flex-col items-center justify-center h-screen" v-else :title="`${error.status}`" :message="error.message"/>
  </div>
</template>

<script setup lang="ts">
import type { Tool } from '@/lib/types';
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const owner = ref("");
const path = ref("");
const tools = ref([] as Tool[])
const error = ref({status: 0, message: ''});

const githubURL = route.path.replace(/^\//, "");
[owner.value, path.value] = githubURL.split("/").slice(-2);

onMounted(async () => {
  document.title = `${owner.value}/${path.value}`;
  const toolAPIResponse = await fetch(`/api/github.com/${owner.value}/${path.value}`, { method: 'POST' });
  if (!toolAPIResponse.ok) {
    error.value = { status: toolAPIResponse.status, message: toolAPIResponse.statusText };
    return;
  }

  const toolAPIResponseJSON = await toolAPIResponse.json();
  tools.value = toolAPIResponseJSON as Tool[];
});
</script>
