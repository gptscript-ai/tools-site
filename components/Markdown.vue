<template>
    <div class="prose lg:prose-xl" v-html="renderedMarkdown"></div>
</template>
  
<script setup lang="ts">
  import { computed } from 'vue';
  import MarkdownIt from 'markdown-it';
  
  const props = defineProps({
    markdown: String
  });
  
  const md = new MarkdownIt();
  const renderedMarkdown = computed(() => md.render(props.markdown || ''));
</script>