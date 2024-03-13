<template>
  <div>
      <div v-if="!error.status" class="flex">
          <div class="prose my-28 mx-auto px-20 md:max-w-screen-md lg:max-w-screen-lg">
              <header class="mb-10">
                  <h1 class="mb-0">{{ path }}</h1>
                  <a :href="`https://${githubURL}`" target="_blank" class="text-blue-500 underline">{{ githubURL }}</a>
              </header>

              <h2>Overview</h2>
              <div v-for="tool in entry.tools" :key="tool.id" class="mb-10">
                  <p class="text-gray-600">{{ tool.description }}</p>

                  <div>
                      <h3 :id="tool.name + '-usage'" class="mt-4 text-lg font-semibold">Usage</h3>
                      <pre class="mt-2">tools: {{ githubURL }}</pre>  
                  </div>

                  <div v-if="tool.arguments?.properties">
                      <h3 :id="tool+ '-arguments'" class="mt-4 text-lg font-semibold">Arguments</h3>
                      <table class="mt-2">
                          <tbody>
                              <tr v-for="(properties, arg) in tool.arguments?.properties" :key="arg">
                                  <td class="font-semibold">{{ arg }}</td>
                                  <td>{{ properties.description }}</td>
                              </tr>
                          </tbody>
                      </table>
                  </div>

                  <h3 v-if="tool.tools && tool.tools.length" :id="tool.name + 'tools-used'" class="mt-4 text-lg font-semibold">Tools used</h3>
                  <div v-if="tool.tools && tool.tools.length" class="mt-2">
                      <p v-for="(usedTool) in tool.tools" :key="usedTool" class="text-gray-600">{{ usedTool }}</p>
                  </div>
              </div>

              <h2 v-if="entry.examples && entry.examples.length">Examples</h2>
              <div v-for="example in entry.examples" :key="example.name" class="mb-10">
                  <h2 :id="'tool-' + example.name" class="text-xl font-semibold">{{ example.name }}</h2>
                  <a :href="example.url" target="_blank" class="text-blue-500 underline">{{ example.url }}</a>
                  <pre>{{ example.content }}</pre>
              </div>

          </div>
      </div>
      
      <Error class="flex flex-col items-center justify-center h-screen" v-else :title="`${error.status}`" :message="error.message"/>
  </div>
</template>

<script setup lang="ts">
import type { Tool, ToolExample } from '@/lib/types';
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const owner = ref("");
const path = ref("");
const entry = ref({} as { tools: Tool[], examples: ToolExample[] })
const error = ref({status: 0, message: ''});
const githubURL = ref("");

onMounted(async () => {
    githubURL.value = route.path.replace(/^\//, "");
    [owner.value, path.value] = githubURL.value.split("/").slice(-2);

    document.title = `${owner.value}/${path.value}`;
    const toolAPIResponse = await fetch(`/api/${githubURL.value}`, { method: 'POST' });
    if (!toolAPIResponse.ok) {
        error.value = { status: toolAPIResponse.status, message: toolAPIResponse.statusText };
        return;
    }

    const toolAPIResponseJSON = await toolAPIResponse.json();
    entry.value = toolAPIResponseJSON as { tools: Tool[], examples: ToolExample[] };
});
</script>