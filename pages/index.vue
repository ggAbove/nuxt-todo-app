<!-- eslint-disable no-alert -->
<script lang="ts" setup>
import { useNotesStore } from '@/stores/notes'
import { useRouter } from 'vue-router'

const notesStore = useNotesStore()
const notes = computed(() => notesStore.notes)
const router = useRouter()

function createNote(): void {
  const newNote = {
    id: Date.now(),
    title: 'Новая заметка',
    todos: [],
  }
  notesStore.addNote(newNote)
  router.push(`/edit/${newNote.id}`)
}

const editNote = (id: number) => router.push(`/edit/${id}`)
function deleteNote(id: number): void {
  if (confirm('Удалить заметку?'))
    notesStore.deleteNote(id)
}
</script>

<template>
  <div class="container mx-auto p-4">
    <button class="bg-blue-500 text-white px-4 py-2 rounded mb-4" @click="createNote">
      Создать новую заметку
    </button>
    <div v-if="notes.length" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <NoteCard v-for="note in notes" :key="note.id" :note="note" @edit="editNote" @delete="deleteNote" />
    </div>
    <p v-else class="text-gray-500">
      Нет заметок
    </p>
  </div>
</template>
