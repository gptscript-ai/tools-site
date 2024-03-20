<template>
    <div> 
        <div v-if="!error.status && !loading">
            <div class="prose dark:prose-invert my-28 mx-auto px-5 md:px-20 w-full md:w-3/4 lg:w-1/2 max-w-full">
                <header class="mb-10">
                    <div>
                        <h1 class="mb-0 inline">{{ header }}</h1>
                        <UTooltip v-if="!isSysTool" text="Re-index tool" :popper="{ placement: 'right' }">
                            <UButton variant="ghost" color="black" class="ml-2 inline" size="2xs" icon="i-heroicons-arrow-path" @click="fetchData(true)" />
                        </UTooltip>
                    </div>
                    <a v-if="!isSysTool" :href="`https://${reference}`" target="_blank" class="text-green-400 underline block">{{ reference }}</a>
                    
                </header>

                <div :key="tool.name" class="mb-10">
                    <p>{{ tool.description }}</p>

                    <div>
                        <h3 :id="tool.name + '-usage'" class="mt-4 text-lg font-semibold">Usage</h3>
                        <Code :text="`tools: ${path}`" />
                    </div>

                    <details v-if="tool.arguments?.properties">
                        <summary class="cursor-pointer mt-4 text-lg font-semibold">Arguments</summary>
                        <table class="mt-2">
                            <tbody>
                                <tr v-for="(properties, arg) in tool.arguments?.properties" :key="arg">
                                    <td class="font-semibold">{{ arg }}</td>
                                    <td>{{ properties.description }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </details>
                </div>

                <h2 v-if="examples && examples.length">Examples</h2>
                <div v-for="example in examples" :key="example.name" class="mb-10">
                    <h2 :id="'tool-' + example.name" class="text-xl font-semibold">{{ example.name }}</h2>
                    <a :href="example.url" target="_blank" class="text-green-400 underline">{{ example.url }}</a>
                    <Code :text="example.content" />
                </div>

                <details v-if="internalTools && internalTools.length">
                    <summary class="cursor-pointer text-2xl font-semibold">Internal Tools</summary>
                    
                    <div v-for="internalTool in internalTools" :key="internalTool.name" class="mb-10 border-b border-gray-200">
                        <h2 :id="'tool-' + internalTool.name" class="text-xl font-semibold">{{ internalTool.name }}</h2>
                        <p>{{ internalTool.description }}</p>
                        <div>
                            <h3 :id="internalTool.name + '-usage'" class="mt-4 text-lg font-semibold">Usage</h3>
                            <Code class="mt-2" :text="`tools: ${internalTool.name} from ${reference}`" />
                        </div>
                        <details class="mb-10" v-if="internalTool.arguments?.properties">
                            <summary :id="internalTool+ '-arguments'" class="cursor-pointer mt-4 text-lg font-semibold">Arguments</summary>
                            <table class="mt-2">
                                <tbody>
                                    <tr v-for="(properties, arg) in internalTool.arguments?.properties" :key="arg">
                                        <td class="font-semibold">{{ arg }}</td>
                                        <td>{{ properties.description }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </details>
                    </div>
                </details>
            </div>
        </div>
      
        <div v-else-if="loading" class="flex items-center justify-center h-screen">
            <div class="flex flex-col items-center justify-center h-screen">
                <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-6"></div>
                <p class="mt-10 text-xl font-semibold">Loading content...</p>
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
const toast = useToast()

const header = ref("");
const tool = ref({} as Tool);
const internalTools = ref([] as Tool[]);
const examples = ref([] as ToolExample[]);
const error = ref({status: 0, message: ''});
const reference = ref("");
const loading = ref(true);
const isSysTool = ref(false);
const path = ref("");

onMounted(() => fetchData(false));

const fetchData = async (force: boolean) => {
    loading.value = true;
    reference.value = route.path.replace(/^\//, "");

    // if this tool does not start with sys., then it needs to be converted to a github URL
    isSysTool.value = reference.value.startsWith("sys.");
    header.value = reference.value

    let owner = ""
    let repo = ""
    path.value = reference.value;
    if (!isSysTool.value) {
        // header is the value after the last slash
        header.value = reference.value.split("/").pop() as string;

        // only split the first 3 slashes
        [owner, repo] = reference.value.split("/").slice(1, 3);
        const subpath = reference.value.split("/").slice(3).join("/");

        // owner is before the first slash, repo is before the second slash and anything after that is the subpath
        reference.value = subpath ? `github.com/${owner}/${repo}/blob/main/${subpath}` : `${reference.value}`;
        path.value = `github.com/${owner}/${repo}${subpath ? '/'+subpath : ''}`;
    }

    const toolAPIResponse = await fetch("/api/" + path.value + `${force ? "?force=true" : ""}`, { method: 'POST' });
    if (!toolAPIResponse.ok) {
        document.title = `${toolAPIResponse.status}`;
        error.value = { status: toolAPIResponse.status, message: toolAPIResponse.statusText };
        loading.value = false;
        return;
    }

    document.title = !isSysTool ? `${owner}/${repo}`: reference.value;

    const e = await toolAPIResponse.json() as { tools: Tool[], examples: ToolExample[] };
    tool.value = e.tools[0];
    internalTools.value = e.tools.slice(1);
    examples.value = e.examples;
    loading.value = false;

    if (force) {
        if (toolAPIResponse.status === 201) {
            toast.add({
                title: 'Tool re-indexed',
                description: 'Tool content has been re-indexed! You can re-index again in an hour.',
                icon: 'i-heroicons-check-circle',
                timeout: 5000,
            })
        } else if (toolAPIResponse.status === 200) {
            const lastIndexedAt = new Date(String(toolAPIResponse.headers.get('Last-Indexed-At')));
            const friendlyTime = lastIndexedAt.toLocaleString();
            toast.add({
                title: 'Content refreshed',
                description: 'Tools can only be re-indexed every hour and the last index occurred at ' + friendlyTime,
                icon: 'i-heroicons-arrow-path',
                timeout: 7000,
            })
        }
    }
}

</script>