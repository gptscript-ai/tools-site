<template>
    <div>
        <div v-if="!error.status" class="m-10 md:m-24 mt-36 prose">
            <h1 class="text-3xl font-bold mb-8">Search Results</h1>
            <div v-for="(tools, url) in searchResults" :key="url" class="mb-8">
                <a class="text-xl font-semibold mb-4 block" :href="`/${url}`">
                    {{ url }}
                </a>
                <p :v-if="tools.length > 1 && tools[0].description"> {{ tools[0].description }} </p>
                
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
import { useRoute } from 'vue-router';
import type { Tool } from '@/lib/types';

const searchResults = ref({} as Record<string, Tool[]>);
const error = ref({status: 0, message: ''});

const fetchData = async (q: string) => {
    const results = await fetch(`/api/search?q=${q}`, { method: 'GET' });
    if (!results.ok) {
        error.value = { status: results.status, message: results.statusText };
        return;
    }
    searchResults.value = await results.json() as Record<string, Tool[]>;
};

onMounted(async () => fetchData(useRoute().query.q as string));
onBeforeRouteUpdate((to) => {
    fetchData(to.query.q as string);
});

</script>
