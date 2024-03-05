<template>
  <div class="flex flex-col min-h-screen">
    <div class="flex-grow flex items-center justify-center">
      <Search :isInvalid="isInvalid" :errorMessage="errorMessage" />
    </div>
  </div>
</template>


<script setup lang="ts">

import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isInvalid = ref(false);
const errorMessage = ref('');

onMounted(() => {
  if (route.query.isInvalid === 'true') {
    isInvalid.value = true;
    errorMessage.value = 'Not a valid repo';
  }
});

</script>