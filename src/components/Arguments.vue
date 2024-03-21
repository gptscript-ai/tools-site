<script lang="ts" setup>
import type { Tool } from '@/lib/types'
import { ucFirst } from '@/utils/string'

interface Props {
  tool: Tool
}

const { tool } = defineProps<Props>()
</script>

<template>
  <Accordion v-if="tool.arguments?.properties" title="Arguments" color="gray">
    <div class="px-2 prose max-w-full dark:text-white">
      <table class="m-0">
        <tbody>
          <tr v-for="(properties, arg) in tool.arguments?.properties" :key="arg">
            <td class="font-semibold">
              {{ arg }}
            </td>
            <td>{{ ucFirst(`${properties.description.trim()}`) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </Accordion>
</template>
