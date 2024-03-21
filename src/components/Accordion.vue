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
  modelValue: initialOpen = false,
} = defineProps<Props>()

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean):  void
}>()

const open = ref(initialOpen)

watch(open, (val) => {
  emit('update:modelValue', val)
})
</script>

<template>
  <MiniCard :body-class="open ? 'p-4' : 'p-0'">
    <template #header>
      <UButton
        :variant="variant"
        :size="size"
        :color="color"
        :data-open="open"
        class="w-full text-left block font-semibold m-0 data-[open=true]:rounded-b-none shadow-none"
        @click="open = !open"
      >
        <UIcon name="i-heroicons-chevron-right align-text-top transition-all data-[open=true]:rotate-90" :data-open="open" />
        {{ title }}
      </UButton>
    </template>

    <template v-if="open" #default>
      <div class="rounded-t-none" v-bind="$attrs">
        <slot />
      </div>
    </template>
  </MiniCard>
</template>
