<!-- eslint-disable no-alert -->
<script lang="ts" setup>
import type { Note, Todo } from '@/stores/notes'
import { useNotesStore } from '@/stores/notes'

// Router and store
const router = useRouter()
const route = useRoute()
const notesStore = useNotesStore()

const noteId = Number.parseInt(route.params.id as string)

// Local note and action stacks
const localNote = ref<Note>()
const actionStack = ref<Array<{ action: string, todo: Todo, prevState?: Partial<Todo> }>>([])
const redoStack = ref<Array<{ action: string, todo: Todo, prevState?: Partial<Todo> }>>([])

// Initialize local note
const originalNote = notesStore.notes.find(n => n.id === noteId)

if (originalNote) {
  localNote.value = JSON.parse(JSON.stringify(originalNote))
}
else {
  alert('Заметка не найдена!')
  router.push('/')
}

// Functions for manipulating todos
function addTodo() {
  if (localNote.value) {
    const newTodo: Todo = { id: Date.now(), text: '', completed: false }
    localNote.value.todos.push(newTodo)
    actionStack.value.push({ action: 'add', todo: newTodo })
    redoStack.value = [] // Clear redo stack after new action
  }
}

function deleteTodo(todoId: number) {
  if (localNote.value) {
    const todoToDelete = localNote.value.todos.find(todo => todo.id === todoId)
    if (todoToDelete) {
      localNote.value.todos = localNote.value.todos.filter(todo => todo.id !== todoId)
      actionStack.value.push({ action: 'delete', todo: todoToDelete })
      redoStack.value = [] // Clear redo stack after new action
    }
  }
}

function toggleTodoCompleted(todoId: number) {
  if (localNote.value) {
    const todo = localNote.value.todos.find(t => t.id === todoId)
    if (todo) {
      const prevState = { completed: todo.completed }
      todo.completed = !todo.completed
      actionStack.value.push({ action: 'toggle', todo, prevState })
      redoStack.value = [] // Clear redo stack after new action
    }
  }
}

function updateTodoText(todoId: number, event: Event) {
  const newText = (event.target as HTMLInputElement).value
  if (localNote.value) {
    const todo = localNote.value.todos.find(t => t.id === todoId)
    if (todo) {
      const prevState = { text: todo.text }
      todo.text = newText
      actionStack.value.push({ action: 'edit', todo, prevState })
      redoStack.value = [] // Clear redo stack after new action
    }
  }
}

// Undo last action
function undoAction() {
  const lastAction = actionStack.value.pop()
  if (lastAction && localNote.value) {
    const { action, todo, prevState } = lastAction
    switch (action) {
      case 'add':
        localNote.value.todos = localNote.value.todos.filter(t => t.id !== todo.id)
        break
      case 'delete':
        localNote.value.todos.push(todo)
        break
      case 'toggle':
        if (prevState) {
          todo.completed = prevState.completed ?? todo.completed
        }
        break
      case 'edit':
        if (prevState) {
          todo.text = prevState.text ?? todo.text
        }
        break
    }
    redoStack.value.push(lastAction) // Move to redo stack
  }
}

// Redo last undone action
function redoAction() {
  const lastRedoAction = redoStack.value.pop()
  if (lastRedoAction && localNote.value) {
    const { action, todo, prevState } = lastRedoAction
    switch (action) {
      case 'add':
        localNote.value.todos.push(todo)
        break
      case 'delete':
        localNote.value.todos = localNote.value.todos.filter(t => t.id !== todo.id)
        break
      case 'toggle':
        todo.completed = !prevState?.completed // Redo toggle
        break
      case 'edit':
        todo.text = prevState?.text ?? todo.text
        break
    }
    actionStack.value.push(lastRedoAction) // Move back to action stack
  }
}

function saveChanges() {
  if (localNote.value) {
    notesStore.updateNote(localNote.value)
    router.push('/')
  }
}

function cancelChanges() {
  if (confirm('Отменить изменения?')) {
    router.push('/')
  }
}

function deleteNote() {
  if (confirm('Удалить заметку?')) {
    notesStore.deleteNote(noteId)
    router.push('/')
  }
}
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">
      Редактирование заметки
    </h1>
    <div v-if="localNote" class="space-y-4 flex flex-col gap-2">
      <input v-model="localNote.title" type="text" class="w-full p-2 border rounded" placeholder="Введите название">

      <ul class="flex flex-col gap-2">
        <li v-for="todo in localNote.todos" :key="todo.id" class="flex items-center gap-2">
          <input
            type="checkbox"
            :checked="todo.completed"
            @change="toggleTodoCompleted(todo.id)"
          >
          <input
            v-model="todo.text"
            type="text"
            class="flex-1 p-2 border rounded"
            placeholder="Введите текст задачи"
            @input="updateTodoText(todo.id, $event)"
          >
          <button class="text-red-500 hover:text-red-700" @click="deleteTodo(todo.id)">
            Удалить
          </button>
        </li>
      </ul>

      <button class="bg-blue-500 text-white px-4 py-2 rounded" @click="addTodo">
        Добавить задачу
      </button>

      <div class="flex gap-4 mt-4">
        <button class="bg-green-500 text-white px-4 py-2 rounded" @click="saveChanges">
          Сохранить изменения
        </button>
        <button class="bg-red-500 text-white px-4 py-2 rounded" @click="cancelChanges">
          Отменить изменения
        </button>
        <button class="bg-red-500 text-white px-4 py-2 rounded" @click="deleteNote">
          Удалить заметку
        </button>
        <button
          :disabled="actionStack.length === 0"
          class="bg-blue-500 text-white px-4 py-2 rounded"
          @click="undoAction"
        >
          Отменить последнее действие
        </button>
        <button
          v-if="redoStack.length > 0"
          class="bg-blue-500 text-white px-4 py-2 rounded"
          @click="redoAction"
        >
          Вернуть отмененное действие
        </button>
      </div>
    </div>
    <p v-else class="text-gray-500">
      Заметка не найдена
    </p>
  </div>
</template>
