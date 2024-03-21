<script setup lang="ts">
interface Props {
  size?:       string
  color?:      string
  variant?:    string
  title:       string
  modelValue?: boolean
}

const {
  variant = 'ghost',
  color = '',
  size = 'lg',
  title,
  modelValue = false,
} = defineProps<Props>()
</script>

<template>
  <MiniCard :body-class="modelValue ? 'p-4' : 'p-0'">
    <template #header>
      <UButton
        :variant="variant"
        :size="size"
        :color="color"
        :data-open="modelValue"
        class="w-full text-left block font-semibold m-0 data-[open=true]:rounded-b-none shadow-none"
        @click="modelValue = !modelValue"
      >
        <UIcon name="i-heroicons-chevron-right align-text-top transition-all data-[open=true]:rotate-90" :data-open="modelValue" />
        {{ title }}
      </UButton>
    </template>

    <template v-if="modelValue" #default>
      <div class="rounded-t-none" v-bind="$attrs">
        <slot />
      </div>
    </template>
  </MiniCard>
</template>
