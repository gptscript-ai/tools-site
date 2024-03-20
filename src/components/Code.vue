<template>
    <div class="w-full" @mouseover="showCopyButton = true" @mouseleave="showCopyButton = false">
        <div class="relative code-container">
            <pre class="dark:bg-dark-gray">{{ text }}</pre>
            <button v-if="showCopyButton" class="absolute top-0 right-0 h-full text-white px-4 py-2" @click="copyText">
                <UIcon :name="icon" />
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const toast = useToast();

const props = defineProps({
    text: {
        type: String,
        required: true
    }
});

const showCopyButton = ref(false);
const icon = ref("i-heroicons-clipboard");

const copyText = () => {
    icon.value = "i-heroicons-check-circle-20-solid";
    navigator.clipboard.writeText(props.text)
        .then(() => {
            toast.add({
                title: 'Copied to clipboard!',
                icon: 'i-heroicons-check-circle',
                timeout: 5000,
            })
            setTimeout(() => { icon.value = "i-heroicons-clipboard"}, 1000);
        })
        .catch((error) => {
            console.error("Failed to copy text:", error);
        });
}

</script>
