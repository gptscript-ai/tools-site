<script lang="ts" setup>
interface Props {
  message?: string
}

const { message } = defineProps<Props>()
</script>

<template>
  <div class="flex flex-col items-center justify-center h-full">
    <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-6" />
    <p class="mt-10 text-xl font-semibold">
      {{ message || 'Loading…' }}
    </p>
  </div>
</template>
