<template>
    <div>
        <div v-if="!error.status && !loading" class="m-10 md:m-24 mt-36 prose">
            <h1 class="text-3xl font-bold mb-8">Search Results</h1>
            <div v-for="(tools, url) in searchResults" :key="url" class="mb-8">
                <a class="text-xl font-semibold mb-4 block" :href="`/${url}`">
                    {{ url }}
                </a>
                <p :v-if="tools.length > 1 && tools[0].description"> {{ tools[0].description }} </p>
                
            </div>
        </div>

        <div v-else-if="loading" class="flex items-center justify-center h-screen">
            <div class="flex flex-col items-center justify-center h-screen">
                <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-6 border-gray-900"></div>
                <p class="mt-10 text-gray-900 text-xl font-semibold">Loading search...</p>
            </div>
        </div>

        <Error
            class="flex flex-col items-center justify-center h-screen"
            v-else
            :title="`${error.status}`"
            :message="error.message"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Tool } from '@/lib/types';

const router = useRouter();
const searchResults = ref({} as Record<string, Tool[]>);
const error = ref({status: 0, message: ''});
const loading = ref(true);

const fetchData = async (q: string) => {
    // if the query is a github valid github url, we want to redirect to that tool's page
    if (/^(https?:\/\/)?(www\.)?github\.com\/[\w-]+\/[\w-]+(\/[\w-]+)*$/.test(q)) {
        q = q.replace(/^https?:\/\//, '');
        router.push(`/${q}`);
        return;
    }

    const results = await fetch(`/api/search?q=${q}`, { method: 'GET' });
    if (!results.ok) {
        error.value = { status: results.status, message: results.statusText };
        loading.value = false;
        return;
    }
    searchResults.value = await results.json() as Record<string, Tool[]>;
    loading.value = false;
};

onMounted(async () => fetchData(useRoute().query.q as string));
onBeforeRouteUpdate((to) => {
    fetchData(to.query.q as string);
});

</script>
