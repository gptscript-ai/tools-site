<template>
    <div> 
        <div v-if="!error.status && !loading" class="flex">
            <div class="prose my-28 mx-auto px-20 w-full">
                <header class="mb-10">
                    <h1 class="mb-0">{{ repo }}</h1>
                    <a :href="`https://${githubURL}`" target="_blank" class="text-blue-500 underline">{{ githubURL }}</a>
                </header>

                <h2>Overview</h2>
                <div :key="tool.name" class="mb-10">
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
                </div>

                <h2 v-if="examples && examples.length">Examples</h2>
                <div v-for="example in examples" :key="example.name" class="mb-10">
                    <h2 :id="'tool-' + example.name" class="text-xl font-semibold">{{ example.name }}</h2>
                    <a :href="example.url" target="_blank" class="text-blue-500 underline">{{ example.url }}</a>
                    <pre>{{ example.content }}</pre>
                </div>

                <details v-if="internalTools && internalTools.length">
                    <summary class="text-2xl font-semibold">
                        Internal Tools
                    </summary>
                    
                    <div v-for="internalTool in internalTools" :key="internalTool.name" class="mb-10 border-b border-gray-200">
                        <h2 :id="'tool-' + internalTool.name" class="text-xl font-semibold">{{ internalTool.name }}</h2>
                        <p class="text-gray-600">{{ internalTool.description }}</p>
                        <div>
                            <h3 :id="internalTool.name + '-usage'" class="mt-4 text-lg font-semibold">Usage</h3>
                            <pre class="mt-2">tools: {{ internalTool.name }} from {{ githubURL }}</pre>
                        </div>
                        <div v-if="internalTool.arguments?.properties">
                            <h3 :id="internalTool+ '-arguments'" class="mt-4 text-lg font-semibold">Arguments</h3>
                            <table class="mt-2">
                                <tbody>
                                    <tr v-for="(properties, arg) in internalTool.arguments?.properties" :key="arg">
                                        <td class="font-semibold">{{ arg }}</td>
                                        <td>{{ properties.description }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </details>
            </div>
        </div>
      
        <div v-else-if="loading" class="flex items-center justify-center h-screen">
            <div class="flex flex-col items-center justify-center h-screen">
                <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-6 border-gray-900"></div>
                <p class="mt-10 text-gray-900 text-xl font-semibold">Loading content...</p>
            </div>
        </div>
      
        <Error class="flex flex-col items-center justify-center h-screen" v-else :title="`${error.status}`" :message="error.message"/>
    </div>
</template>

<script setup lang="ts">
import type { Tool, ToolExample } from '@/lib/types';
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const owner = ref("");
const repo = ref("");
const tool = ref({} as Tool);
const internalTools = ref([] as Tool[]);
const examples = ref([] as ToolExample[]);
const error = ref({status: 0, message: ''});
const githubURL = ref("");
const loading = ref(true);

onMounted(async () => {
    githubURL.value = route.path.replace(/^\//, "");

    // if this tool does not start with sys., then it needs to be converted to a github URL
    const isSysTool = githubURL.value.startsWith("sys.");
    let path = githubURL.value
    if (!isSysTool) {
        githubURL.value = githubURL.value.replace("sys.", "github.com/gptscript-ai/");

        // only split the first 3 slashes
        [owner.value, repo.value] = githubURL.value.split("/").slice(1, 3);
        const subpath = githubURL.value.split("/").slice(3).join("/");

        // owner is before the first slash, repo is before the second slash and anything after that is the subpath
        githubURL.value = subpath ? `github.com/${owner.value}/${repo.value}/blob/main/${subpath}` : `${githubURL.value}`;
        path = `github.com/${owner.value}/${repo.value}${subpath ? '/'+subpath : ''}`;
    }

    console.log("before")
    const toolAPIResponse = await fetch("/api/" + path, { method: 'POST' });
    if (!toolAPIResponse.ok) {
        document.title = `${toolAPIResponse.status}`;
        error.value = { status: toolAPIResponse.status, message: toolAPIResponse.statusText };
        loading.value = false;
        return;
    }

    console.log("foo")

    document.title = !isSysTool ? `${owner.value}/${repo.value}`: githubURL.value;

    const e = await toolAPIResponse.json() as { tools: Tool[], examples: ToolExample[] };
    
    tool.value = e.tools[0];
    internalTools.value = e.tools.slice(1);
    examples.value = e.examples;
    loading.value = false;
});
</script>