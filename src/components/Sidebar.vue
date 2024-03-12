<template>
    <div class="sidebar text-gray-600">
        <div v-for="header in props.headers" :key="'sidebar-'+header" class="mb-10 overflow-auto">
            <a :href="`#tool-${header}`">{{ header || "root" }}</a>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    headers: {
        type: Array,
        required: true
    }
});
</script>
