<template>
    <div class="w-full" @mouseover="showCopyButton = true" @mouseleave="showCopyButton = false">
        <div class="relative code-container">
            <pre>{{ text }}</pre>
            <button v-if="showCopyButton" :class="['absolute', 'top-0', 'right-0', 'h-full', 'text-white', 'px-4', 'py-2', { 'spin': isSpinning }]" @click="copyText">
                <Icon :icon="'ic:baseline-content-copy'" />
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { ref } from "vue";

const props = defineProps({
    text: {
        type: String,
        required: true
    }
});

const showCopyButton = ref(false);
const isSpinning = ref(false);

const copyText = () => {
    isSpinning.value = true;
    navigator.clipboard.writeText(props.text)
        .then(() => {
            setTimeout(() => {
                isSpinning.value = false;
            }, 250);
        })
        .catch((error) => {
            console.error("Failed to copy text:", error);
            isSpinning.value = false;
        });
}

</script>

<style scoped>
.spin {
    animation: spin 0.25s infinite linear;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
</style>
