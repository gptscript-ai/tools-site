<template>
  <div class="flex flex-col justify-center items-center min-h-screen">
    <Search :isInvalid="isInvalid" :errorMessage="errorMessage" :placeholder="placeHolder" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isInvalid = ref(false);
const errorMessage = ref('');
const placeHolder = ref('Search for a GPTScript Tool...');

onMounted(() => {
  if (route.query.isInvalid === 'true') {
    isInvalid.value = true;
    errorMessage.value = 'Not a valid repo';
  }
});
</script>