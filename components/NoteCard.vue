<script lang="ts" setup>
import type { Note } from '@/stores/notes'

defineProps<{ note: Note }>()

const emit = defineEmits(['edit', 'delete'])
</script>

<template>
  <div class="border p-4 rounded shadow">
    <h2 class="text-lg font-bold mb-2">
      {{ note.title }}
    </h2>
    <ul>
      <li v-for="todo in note.todos.slice(0, 3)" :key="todo.id">
        <span :class="{ 'line-through': todo.completed }">{{ todo.text }}</span>
      </li>
      <li v-if="note.todos.length > 3" class="text-gray-500">
        и другие...
      </li>
    </ul>
    <div class="flex gap-2 mt-4">
      <button class="bg-blue-500 text-white px-3 py-1 rounded" @click="emit('edit', note.id)">
        Изменить
      </button>
      <button class="bg-red-500 text-white px-3 py-1 rounded" @click="emit('delete', note.id)">
        Удалить
      </button>
    </div>
  </div>
</template>
