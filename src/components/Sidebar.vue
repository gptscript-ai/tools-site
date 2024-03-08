<template>
    <div class="sidebar">
        <div v-for="group in headerGroups" :key="group.id" class="mb-4 overflow-auto">
            <a :href="`#${group.id}`">{{ group.text || "root" }}</a>
            <button @click="toggleGroup(group)" class="px-4 py-2 text-xs font-thin cursor-pointer">
                {{ group.isOpen ? '▼' : '►' }}
            </button>
            
            <div class="ml-4" v-show="group.isOpen">
                <div v-for="header in group.headers" :key="header.id" class="m-2">
                    <a :href="`#${header.id}`">{{ header.text }}</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const headerGroups = ref([]);

onMounted(() => {
    fetchHeaders();
    achors();
});

const fetchHeaders = () => {
    const headers = Array.from(document.querySelectorAll('h2, h4'));
    const groups = [];

    for (let i = 0; i < headers.length; i++) {
        const header = headers[i];
        if (header.tagName === 'H2') {
            const group = {
                id: header.id,
                text: header.textContent,
                headers: [],
                isOpen: false
            };
            console.log(header.id)
            groups.push(group);
        } else if (header.tagName === 'H4' && groups.length > 0) {
            const group = groups[groups.length - 1];
            group.headers.push({
                id: header.id,
                text: header.textContent
            });
        }
    }

    headerGroups.value = groups;
}

const achors = () => {
    const navbarHeight = document.querySelector('.navbar').offsetHeight;
    const anchors = document.querySelectorAll('.sidebar a');

    anchors.forEach(anchor => {
        anchor.addEventListener('click', (event) => {
            event.preventDefault();
            const targetId = anchor.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            const offsetTop = targetElement.offsetTop - navbarHeight;

            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        });
    });
}

const toggleGroup = (group) => {
    group.isOpen = !group.isOpen;
}

</script>
