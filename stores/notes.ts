import { defineStore } from 'pinia'

export interface Todo {
  id: number
  text: string
  completed: boolean
}

export interface Note {
  id: number
  title: string
  todos: Todo[]
}

export const useNotesStore = defineStore('notes', {
  state: () => ({
    notes: [] as Note[],
  }),
  persist: {
    storage: piniaPluginPersistedstate.localStorage(),
  },
  actions: {
    addNote(note: Note): void {
      this.notes.push(note)
    },
    deleteNote(id: number): void {
      this.notes = this.notes.filter(note => note.id !== id)
    },
    updateNote(updatedNote: Note): void {
      const index = this.notes.findIndex(note => note.id === updatedNote.id)
      if (index !== -1)
        this.notes[index] = updatedNote
    },
  },

})
