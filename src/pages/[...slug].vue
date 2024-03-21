<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { splitLimit } from '@/utils/string'
import type { Tool, ToolExample } from '@/lib/types'

interface Result {
  tools:    Tool[]
  examples: ToolExample[]
}

interface Error {
  status:  number
  message: string
}

const route = useRoute()
const toast = useToast()

const tool = ref<Tool>()
const internalTools = ref<Tool[]>()
const examples = ref<ToolExample[]>([])
const error = ref<Error>()
const loading = ref(true)

const slug = route.params.slug as string[]
const header = slug[slug.length - 1]
const path = slug.join('/')
const usage = `tools: ${ path }`
const isSysTool = computed(() => slug.length === 1 && slug[0].startsWith('sys.'))

let reference = path

if (isSysTool.value) {
  reference = slug[0]
} else {
  const [origin, owner, repo, subpath] = splitLimit(path, '/', 4)

  if (subpath) {
    reference = `${ origin }/${ owner }/${ repo }/blob/main/${ subpath }`
  }
}

useHead({ title: (isSysTool.value ? reference : slug.slice(0, 2).join('/')) })

onMounted(() => {
  fetchData()
})

async function fetchData(force = false) {
  loading.value = true
  error.value = undefined

  try {
    const toolAPIResponse = await fetch(`/api/${ path }${ force ? '?force=true' : '' }`, { method: 'POST' })

    if (!toolAPIResponse.ok) {
      useHead({ title: `${ toolAPIResponse.status }` })
      error.value = { status: toolAPIResponse.status, message: toolAPIResponse.statusText }

      return
    }

    const e = await toolAPIResponse.json() as Result

    tool.value = e.tools[0]
    internalTools.value = e.tools.slice(1)
    examples.value = e.examples

    if (force) {
      if (toolAPIResponse.status === 201) {
        toast.add({
          title:       'Tool re-indexed',
          description: 'Tool content has been re-indexed! You can re-index again in an hour.',
          icon:        'i-heroicons-check-circle',
          timeout:     5000,
        })
      } else if (toolAPIResponse.status === 200) {
        const lastIndexedAt = new Date(String(toolAPIResponse.headers.get('Last-Indexed-At')))
        const friendlyTime = lastIndexedAt.toLocaleString()

        toast.add({
          title:       'Content refreshed',
          description: `Tools can only be re-indexed every hour and the last index occurred at ${  friendlyTime }`,
          icon:        'i-heroicons-arrow-path',
          timeout:     7000,
        })
      }
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <Loading v-if="loading" />
  <Error v-else-if="error?.status || !tool" :title="`${error?.status || 0}`" :message="error?.message || 'Unknown'" />

  <div v-else>
    <div class="mx-auto">
      <h1 class="text-2xl font-semibold mb-0 mr-2 inline">
        {{ header }}
      </h1>

      <UTooltip v-if="!isSysTool" text="Re-index tool" :popper="{ placement: 'right', arrow: true }">
        <UButton
          variant="ghost"
          size="2xs"
          icon="i-heroicons-arrow-path"
          @click="fetchData(true)"
        />
      </UTooltip>

      <div>
        <UButton v-if="!isSysTool" variant="link" :to="`https://${reference}`" target="_blank" class="relative right-2.5">
          {{ reference }}
        </UButton>
      </div>

      <p>{{ tool.description }}</p>

      <div class="flex mt-4">
        <h2 :id="`${tool.name}-usage`" class="text-xl font-semibold p-0 m-0 text-clip flex-grow">
          Usage
        </h2>
        <CopyToClipboard :text="usage" />
      </div>

      <MiniCard class="my-5">
        <Code :text="usage" />
      </MiniCard>

      <Arguments :tool="tool" class="mb-5" />

      <h2 v-if="examples && examples.length" class="text-xl font-semibold m-0 mb-2">
        Examples
      </h2>

      <MiniCard v-for="example in examples" :key="example.name" class="mb-10">
        <template #header>
          <div class="flex p-2 pl-4">
            <h2 :id="`tool-${example.name}`" class="max-w-full text-lg m-0 flex-grow">
              {{ example.name }}
            </h2>
            <UButton :to="example.url" target="_blank" variant="link" icon="i-heroicons-code-bracket" class="no-underline">
              Source
            </UButton>
            <CopyToClipboard variant="link" :text="example.content" />
          </div>
        </template>

        <Code class="m-0 rounded-t-none" body-classes="rounded-t-none" :text="example.content" />
      </MiniCard>

      <Accordion v-if="internalTools && internalTools.length" title="Internal Tools">
        <MiniCard v-for="internalTool in internalTools" :key="internalTool.name" class="p-2 mb-4 last:mb-0">
          <template #header>
            <div class="p-2">
              <h2 :id="`tool-${internalTool.name}`" class="text-xl font-semibold m-0">
                {{ internalTool.name }}
              </h2>
              <p class="text-small text-gray-500 m-0">
                {{ internalTool.description }}
              </p>
            </div>
          </template>

          <div class="p-2">
            <div class="flex mb-2">
              <h3 :id="`${internalTool.name}-usage`" class="text-lg font-semibold m-0 text-clip flex-grow">
                Usage
              </h3>
              <CopyToClipboard variant="link" :text="`tools: ${internalTool.name} from ${reference}`" />
            </div>

            <MiniCard class="mb-4">
              <Code :text="`tools: ${internalTool.name} from ${reference}`" />
            </MiniCard>

            <Arguments :tool="internalTool" />
          </div>
        </MiniCard>
      </Accordion>
    </div>
  </div>
</template>
