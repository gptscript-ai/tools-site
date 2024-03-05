<template>
  <div class="w-full max-w-sm mx-auto">
    <form @submit.prevent="submitSearch">
      <input
        v-model="searchTerm"
        type="text"
        :placeholder="placeholder"
        :class="`w-full px-4 py-2 text-gray-700 bg-white border ${isInvalid ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-blue-500`"
      />
      <p v-if="isInvalid" class="text-red-500">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  isInvalid: Boolean,
  errorMessage: String,
  placeholder: String // Added placeholder prop
});

const searchTerm = ref('');
const router = useRouter();

const submitSearch = () => {
  router.push('/' + searchTerm.value);
};
</script>