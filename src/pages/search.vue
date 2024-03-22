<script setup lang="ts">
import type { Tool } from '@/lib/types'

const pageSize = 10

const route = useRoute()
const searchResults = ref({} as Record<string, Tool[]>)
const error = ref({ status: 0, message: '' })
const loading = ref(true)
const page = ref(1)
const totalItems = ref(0)
const isWindowScrolled = ref(false)

definePageMeta({
  middleware: [
    (_from, to) => {
      const q = `${to.query.q}`.trim()

      if (!q) {
        return navigateTo('/')
      }

      if (/^(https?:\/\/)?(www\.)?github\.com\/[\w-]+\/[\w-]+(\/[\w-]+)*$/.test(q)) {
        return navigateTo(`/${q}`, { replace: true })
      }
    },
  ],
})

const q = computed(() => {
  return `${route.query.q}`.trim()
})

async function fetchData() {
  loading.value = true
  const results = await fetch(`/api/search?q=${ q.value }&page=${page.value}`)

  if (!results.ok) {
    error.value = { status: results.status, message: results.statusText }
    loading.value = false
    return
  }

  const { tools, totalCount } = await results.json()
  console.log(totalCount)
  searchResults.value = tools
  totalItems.value = totalCount
  loading.value = false
}

watch([() => route.query, page], () => fetchData())
onMounted(() => fetchData())

async function onPageChange(newPage: number) {
  page.value = newPage
}

</script>

<template>
  <Loading v-if="loading" />
  <Error v-else-if="error?.status || !searchResults" :title="`${error?.status || 0}`" :message="error?.message || 'Unknown'" />
  <div v-else>
    <h1 class="text-2xl font-semibold mb-8">
      <template v-if="q === '.' || q === ''">
        All Tools
      </template>
      <template v-else-if="q === ('sys.')">
        System Tools
      </template>
      <template v-else>
        Search Results: {{ q }}
      </template>
    </h1>

    <UPagination class="my-8" v-if="totalItems > pageSize" v-model="page" :page-count="10" :total="totalItems" @change="onPageChange" />

    <MiniCard v-for="(tools, url) in searchResults" :key="url" class="mb-4">
      <template #header>
        <UButton variant="ghost" class="text-xl font-semibold block w-full" :to="`/${url}`">
          {{ url }}
        </UButton>
      </template>

      <div class="p-2">
        <p v-if="tools?.[0]?.description">
          {{ tools[0].description }}
        </p>
        <p v-else class="italic">
          No description
        </p>
      </div>
    </MiniCard>

    <UPagination class="my-8" v-if="totalItems > pageSize" v-model="page" :page-count="10" :total="totalItems" @change="onPageChange" />

  </div>
</template>
