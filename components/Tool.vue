<template>
    <div class="tool-container prose">
        <h1 class="mb-0">{{ props.title }}</h1>
        <a :href="githubUrl ? `https://${githubUrl}` : ''" target="_blank" class="text-blue-500 underline">{{ githubUrl }}</a>
        <div v-for="tool in props.tools" :key="tool.id">
            <h2>{{ tool.name }}</h2>
            <p class="">{{ tool.description }}</p>

            <h3>Arguments</h3>
            <div v-for="(properties, arg) in tool.arguments?.properties" :key="arg">
                <h4 class="mb-0">{{ arg }}</h4>
                <p class="text-gray-500"v-if="properties.type">{{ properties.type }}</p>
                <p v-if="properties.description">{{ properties.description }}</p>   
            </div>

            <h3 v-if="tool.tools && tool.tools.length">Tools used</h3>
            <div v-if="tool.tools && tool.tools.length">
                <p v-for="(usedTool) in tool.tools" :key="usedTool">{{ usedTool }}</p>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import type { Tool } from '@/lib/types';
const props = defineProps({
    title: {
        type: String,
        required: true
    },
    githubUrl: {
        type: String,
        required: true
    },
    tools: {
        type: Array as () => Tool[],
        required: true
    },    
});
</script>
