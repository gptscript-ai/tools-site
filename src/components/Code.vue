<script setup lang="ts">
interface Props {
  text:         string
  bodyClasses?: string
}

const { text, bodyClasses = '' } = defineProps<Props>()
</script>

<template>
  <div class="prose dark:prose-invert max-w-full" v-bind="$attrs">
    <div class="relative  code-container">
      <pre class="dark:bg-gray-900 m-0" :class="bodyClasses">{{ text }}</pre>
    </div>
  </div>
</template>
