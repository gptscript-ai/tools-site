<template>
    <div class="w-full mx-auto">
        <form @submit.prevent="submitSearch">
        <div class="relative">
            <input
            v-model="searchTerm"
            type="text"
            :placeholder="props.placeholder"
            :class="`w-full px-4 py-2 pl-10 text-gray-700 bg-white border rounded-lg focus:outline-none focus:border-green-500`"
            />
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 18l6-6m0 0l-6-6m6 6H4"></path>
            </svg>
            </div>
        </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const props = defineProps({
  placeholder: String,
});

const searchTerm = ref('');
const router = useRouter();

const submitSearch = () => {
  router.push('/search?q=' + searchTerm.value);
};
</script>