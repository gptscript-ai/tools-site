<script setup lang="ts">
interface Props {
  text:   string
  label?: string
}

const { text, label = '' } = defineProps<Props>()
const copied = ref<'' | 'copying' | 'copied' | 'error'>('')

const displayIcon = computed(() => {
  switch (copied.value) {
    case 'copied': return 'i-heroicons-check-circle-20-solid'
    case 'copying': return 'i-heroicons-arrow-path'
    case 'error': return 'i-heroicons-excamation-circle'
    default: return 'i-heroicons-clipboard'
  }
})

const displayLabel = computed(() => {
  switch (copied.value) {
    case 'copied': return 'Copied!'
    case 'copying': return 'Copying…'
    case 'error': return 'Error!'
    default: return label || 'Copy'
  }
})

async function copyText() {
  try {
    const maybeSlow = setTimeout(() => {
      copied.value = 'copying'
    }, 50)

    await navigator.clipboard.writeText(text)

    clearTimeout(maybeSlow)
    copied.value = 'copied'
  } catch (error) {
    copied.value = 'error'
    console.error('Failed to copy text:', error)
  } finally {
    setTimeout(() => {
      copied.value = ''
    }, 2000)
  }
}
</script>

<template>
  <UButton
    :loading="copied === 'copying'"
    :icon="displayIcon"
    type="soft"
    v-bind="$attrs"
    @click="copyText"
  >
    {{ displayLabel }}
  </UButton>
</template>
