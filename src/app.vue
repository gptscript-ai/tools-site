<script lang="ts" setup>
useHead({
  title: 'GPTScript Tools',
  meta:  [
    { charset: 'utf-8' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'format-detection', content: 'telephone=no' },
    { name: 'viewport', content: `width=device-width` },
  ],
})
</script>

<template>
  <div>
    <div class="grid grid-rows-[60px,1fr] fixed top-0 right-0 bottom-0 left-0">
      <Navigation class="h-[60px]" />
      <div class="overflow-auto border-t-2 border-transparent">
        <div class="p-5 lg:p-10 max-w-full w-full mx-auto lg:max-w-5xl">
          <NuxtPage />
        </div>
      </div>
    </div>
    <UNotifications />
  </div>
</template>:1
