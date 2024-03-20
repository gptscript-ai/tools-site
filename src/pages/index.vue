<template>
    <div class="flex flex-col justify-center items-center min-h-screen">
        <div class="w-full justify-center items-center mt-60 md:mt-24">
            <div class="text-center mb-10 max-w-screen">
                <h2 class="text-4xl md:text-5xl mb-4 mx-2">Welcome to tools.gptscript.ai</h2>
                <h3 class="text-lg text-gray-500 mx-10">Looking for something? There's probably a tool for it.</h3>
            </div>
            <div class="w-full mx-auto px-10">
                <Search class="w-full md:w-3/4 lg:w-1/2":placeholder="'Search for a tool or enter a GitHub URL to index one...'" />
                <UDivider class="sm:w-full md:hidden mx-auto mt-10 mb-5" :ui="{ label: 'text-gray-500 text-lg font-normal' }" />
                <div class="flex justify-center flex-col md:flex-row">
                    <ULink to="/github.com/gptscript-ai/search/brave" class="text-center rounded hover:text-green-400 p-4 m-2 text-lg">
                        <UIcon name="i-heroicons-magnifying-glass"/> Search
                    </ULink>
                    <ULink to="/github.com/gptscript-ai/vision" class="text-center rounded hover:text-green-400  p-4 m-2 text-lg">
                        <UIcon name="i-heroicons-camera"/> Vision
                    </ULink>
                    <ULink to="/github.com/gptscript-ai/image-generation" class="text-center rounded hover:text-green-400  p-4 m-2 text-lg">
                        <UIcon name="i-heroicons-paint-brush"/> Image Generation 
                    </ULink>
                    <ULink to="/github.com/gptscript-ai/browser" class="text-center rounded hover:text-green-400  p-4 m-2 text-lg">
                        <UIcon name="i-heroicons-tv"/> Browser 
                    </ULink>
                    <ULink to="/search?q=sys." class="text-center rounded hover:text-green-400  p-4 m-2 text-lg">
                        <UIcon name="i-heroicons-wrench"/> System Tools
                    </ULink>
                </div>
            </div>
        </div>
    </div>
</template>
