<template>
  <div class="flex flex-col mt-16 mx-24">
    <Tool class="w-3/4" :owner="owner" :repo="repo"/>
  </div>
</template>

<script setup lang="ts">
// todo: this calls the endpoint twice. the first time fails and the second succeeds.
//       at the time of writing this comment, I don't know why. This likely has something
//       to do with the lifecycle of the component since putting this behind onMounted
//       causes there to be no data at all.
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const owner = ref('');
const repo = ref('');

const path = route.path.replace(/^\//, '');
const validRepo = /^(https?:\/\/)?(www\.)?github\.com\/[\w-]+\/[\w-]+$/.test(path);

if (!validRepo) {
  router.push({ path: '/404' });
}

[owner.value, repo.value] = path.split('/').slice(-2);
</script>
