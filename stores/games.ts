import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export interface Game {
  id: string
  name: string
  order: number
  subCategories?: string
  children?: Game[]
}

export interface GamesState {
  games: Game[]
  undoStack: Game[][]
  redoStack: Game[][]
}

export const useGamesStore = defineStore('games', () => {
  const games: Ref<Game[]> = ref([])
  const undoStack: Ref<Game[][]> = ref([])
  const redoStack: Ref<Game[][]> = ref([])

  const persistState = (page: number) => {
    if (process.client) {
      localStorage.setItem(`games_data_page_${page}`, JSON.stringify(games.value))
      localStorage.setItem(`games_undo_page_${page}`, JSON.stringify(undoStack.value))
      localStorage.setItem(`games_redo_page_${page}`, JSON.stringify(redoStack.value))
    }
  }

  const loadState = (page: number) => {
    if (process.client) {
      const storedDataStr = localStorage.getItem(`games_data_page_${page}`)
      const storedUndo = localStorage.getItem(`games_undo_page_${page}`)
      const storedRedo = localStorage.getItem(`games_redo_page_${page}`)
      if (storedDataStr) {
        const storedGames = JSON.parse(storedDataStr)
        if (!games.value.length || JSON.stringify(games.value) !== JSON.stringify(storedGames)) {
          games.value = storedGames
        }
      }
      if (storedUndo) {
        undoStack.value = JSON.parse(storedUndo) ?? []
      }
      if (storedRedo) {
        redoStack.value = JSON.parse(storedRedo) ?? []
      }
    }
  }

  const pushUndoState = (page: number) => {
    undoStack.value.push(JSON.parse(JSON.stringify(games.value)))
    if (undoStack.value.length > 20) {
      undoStack.value.shift()
    }
    redoStack.value = []
    persistState(page)
  }

  const removeGameById = (list: Game[], id: string): Game | null => {
    for (let i = 0; i < list.length; i++) {
      if (list[i].id === id) {
        return list.splice(i, 1)[0]
      }
      if (list[i].children) {
        const child = removeGameById(list[i].children, id)
        if (child) return child
      }
    }
    return null
  }

  const insertGame = (list: Game[], targetId: string, game: Game): boolean => {
    for (const item of list) {
      if (item.id === targetId) {
        item.children = item.children || []
        item.children.push(game)
        return true
      }
      if (item.children && insertGame(item.children, targetId, game)) {
        return true
      }
    }
    return false
  }

  const moveGame = (draggedId: string, targetId: string, page: number) => {
    if (draggedId === targetId) return
    pushUndoState(page)
    const gameToMove = removeGameById(games.value, draggedId)
    if (!gameToMove) {
      persistState(page)
      return
    }
    if (targetId === 'root') {
      games.value.push(gameToMove)
    } else if (!insertGame(games.value, targetId, gameToMove)) {
      games.value.push(gameToMove)
    }
    persistState(page)
  }

  const undo = (page: number) => {
    if (!undoStack.value.length) return
    redoStack.value.push(JSON.parse(JSON.stringify(games.value)))
    const previousState = undoStack.value.pop()
    if (previousState) {
      games.value = previousState
    }
    persistState(page)
  }

  const redo = (page: number) => {
    if (!redoStack.value.length) return
    undoStack.value.push(JSON.parse(JSON.stringify(games.value)))
    const nextState = redoStack.value.pop()
    if (nextState) {
      games.value = nextState
    }
    persistState(page)
  }

  return {
    games,
    loadState,
    persistState,
    moveGame,
    undo,
    redo
  }
})