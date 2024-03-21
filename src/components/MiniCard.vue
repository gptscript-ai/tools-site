<script setup lang="ts">
interface Props {
  title?:     string
  bodyClass?: string
}

const { title = '', bodyClass = '' } = defineProps<Props>()
</script>

<template>
  <div
    class="rounded-lg ring-1 ring-gray-200 dark:ring-gray-800 shadow bg-white dark:bg-gray-900"
    v-bind="$attrs"
  >
    <slot name="header">
      {{ title }}
    </slot>

    <div v-if="$slots.default" class="rounded-t-none" :class="bodyClass">
      <slot />
    </div>
  </div>
</template>
