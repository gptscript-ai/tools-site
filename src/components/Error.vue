<script setup lang="ts">
interface Props {
  title:   string
  message: string
}
const { title, message } = defineProps<Props>()
</script>

<template>
  <div class="flex flex-col items-center justify-center h-full">
    <h1 class="text-4xl font-bold mb-4">
      {{ title }}
    </h1>
    <p class="text-lg">
      {{ message }}
    </p>
    <UButton variant="link" to="/" class="mt-4">
      Go back to home
    </UButton>
  </div>
</template>
