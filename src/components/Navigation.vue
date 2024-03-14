<template>
    <nav class="navbar bg-dark-gray p-4 flex justify-between items-center" style="height: 60px;">
        <div class="flex items-center h-full">
            <ul class="flex space-x-6 items-center">
                <li class="flex items-center">
                    <img src="@/assets/img/logo.svg" alt="Logo" class="h-10 w-10 mr-2">
                    <nuxt-link to="/" class="text-white hover:text-green-200">GPTScript</nuxt-link>
                </li>
            </ul>
        </div>
        <div class="flex items-center h-full mr-4">
            <ul class="flex space-x-6 items-center">
                <li class="grow w-72 md:w-96">
                    <Search :placeholder="placeHolder" />
                </li>
                <li><a :href="githubLink" class="text-white hover:text-green-200">GitHub</a></li>
                <li><a :href="docsLink" class="text-white hover:text-green-200">Docs</a></li>
            </ul>
        </div>
    </nav>
</template>

<script setup>
import { links } from '@/lib/links.ts';
import { ref } from 'vue';

const placeHolder = ref('Search for a GPTScript Tool...');

const githubLink = ref(links.github);
const docsLink = ref(links.docs);
</script>
