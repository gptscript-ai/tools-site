<template>
    <nav class="navbar bg-dark-gray p-4 flex justify-between items-center" style="height: 60px;">
        <div class="flex items-center h-full">
            <ul class="flex space-x-6 items-center">
                <li class="flex items-center">
                    <nuxt-link to="/" class="">
                        <img src="@/assets/img/logo.svg" alt="Logo" class="h-10 w-10 mr-2">
                    </nuxt-link>
                    <nuxt-link to="/" class="text-white hover:text-green-300 hidden sm:block">GPTScript</nuxt-link>
                </li>
            </ul>
        </div>
        <div class="flex items-center h-full">
            <ul class="flex md:space-x-6 items-center">
                <li><Search :placeholder="placeHolder" /></li>
                <li class="hidden md:block"><router-link to="/search?q=." class="text-white hover:text-green-300">
                    All Tools <UIcon name="i-heroicons-arrow-top-right-on-square"/>
                </router-link></li>
                <li class="hidden md:block"><a :href="githubLink" class="text-white hover:text-green-300">
                    GitHub <UIcon name="i-heroicons-arrow-top-right-on-square"/>
                </a></li>
                <li class="hidden md:block"><a :href="docsLink" class="text-white hover:text-green-300">
                    Docs <UIcon name="i-heroicons-arrow-top-right-on-square"/>
                </a></li>
                <li><DisplayMode/></li>
            </ul>
        </div>
    </nav>
</template>

<script setup>
import { links } from '@/lib/links.ts';
import { ref } from 'vue';

const placeHolder = ref('Search for a tool...');

const githubLink = ref(links.github);
const docsLink = ref(links.docs);
</script>
