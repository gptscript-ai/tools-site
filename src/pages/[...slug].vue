<template>
  <div class="flex">
    <div class="hidden md:block border-r border-gray-200">
      <Sidebar class="mx-20 sticky top-8 pt-10"/>
    </div>
    <div class="pt-10 mx-auto w-auto sm:mx-20">
      <Tool :owner="owner" :path="path"/>
    </div>
  </div>
</template>

<script setup lang="ts">
// todo: this calls the endpoint twice. the first time fails and the second succeeds.
//       at the time of writing this comment, I don't know why. This likely has something
//       to do with the lifecycle of the component since putting this behind onMounted
//       causes there to be no data at all.
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const owner = ref("");
const path = ref("");

const githubURL = route.path.replace(/^\//, "");
const validRepo = /^(https?:\/\/)?(www\.)?github\.com\/[\w-]+\/[\w-]+$/.test(githubURL);

if (!validRepo) {
  router.push({ path: "/404" });
}

[owner.value, path.value] = githubURL.split("/").slice(-2);
</script>
