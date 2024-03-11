<template>
    <div class="sidebar text-gray-600">
        <div v-for="header in headers" :key="header.id" class="mb-4 overflow-auto">
            <a :href="`#${header.id}`">{{ header.innerHTML || "root" }}</a>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const headers = ref([]);

onMounted(() => {
    fetchHeaders();
});

const fetchHeaders = () => headers.value = Array.from(document.querySelectorAll('h2'));
</script>
