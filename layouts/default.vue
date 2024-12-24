<script setup lang="ts">
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

function toggleTheme() {
  colorMode.value = isDark.value ? 'light' : 'dark'
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-blue-600 text-white py-2 px-4 shadow-md">
      <div class="container flex items-center justify-between">
        <h1 class="text-xl font-bold">
          <NuxtLink to="/">
            Заметки
          </NuxtLink>
        </h1>
        <button
          class="px-4 py-2 rounded border text-sm"
          @click="toggleTheme"
        >
          {{ isDark ? 'Светлая тема' : 'Тёмная тема' }}
        </button>
      </div>
    </header>

    <main class="flex-1 container mx-auto p-4">
      <slot />
    </main>

    <footer class="bg-gray-800 text-white text-center py-2">
      <p class="text-sm">
        Todo app
      </p>
    </footer>
  </div>
</template>
