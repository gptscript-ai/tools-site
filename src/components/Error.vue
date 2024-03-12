<template>
    <div class="flex flex-col items-center justify-center h-screen">
        <h1 class="text-4xl font-bold mb-4">{{ props.title }}</h1>
        <p class="text-lg"> {{ props.message }}</p>
        <router-link to="/" class="mt-4 text-blue-500 hover:underline">Go back to home</router-link>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
  title: String,
  message: String,
});
</script>
