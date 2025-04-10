// stores/requests.ts
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export interface Request {
  id: string
  title: string
  children?: Request[]
}

export interface RequestsState {
  requests: Request[]
  undoStack: Request[][]  // история состояний списка
  redoStack: Request[][]  // стек для повторения действий
}

export const useRequestsStore = defineStore('requests', () => {
  console.log('store initialized')

  // Начальное состояние: пустой список запросов, стеки undo/redo
  const requests: Ref<Request[]> = ref([])
  const undoStack: Ref<Request[][]> = ref([])
  const redoStack: Ref<Request[][]> = ref([])

  // Функция сохранения состояния в localStorage (только на клиенте)
  const persistState = () => {
    if (process.client) {
      localStorage.setItem('requests', JSON.stringify(requests.value))
      localStorage.setItem('undoStack', JSON.stringify(undoStack.value))
      localStorage.setItem('redoStack', JSON.stringify(redoStack.value))
    }
  }

  // Функция загрузки состояния из localStorage (только на клиенте)
  const loadState = () => {
    if (process.client) {
      const storedRequests = localStorage.getItem('requests')
      const storedUndo = localStorage.getItem('undoStack')
      const storedRedo = localStorage.getItem('redoStack')

      if (storedRequests) {
        requests.value = (JSON.parse(storedRequests) as Request[]) ?? []
      }
      if (storedUndo) {
        undoStack.value = (JSON.parse(storedUndo) as Request[][]) ?? []
      }
      if (storedRedo) {
        redoStack.value = (JSON.parse(storedRedo) as Request[][]) ?? []
      }
    }
  }

  /**
   * Функция перемещения запроса.
   * Перемещает запрос с id draggedId в элемент с id targetId.
   */
  const moveRequest = (draggedId: string, targetId: string) => {
    // Сохраняем текущее состояние для undo
    undoStack.value.push(JSON.parse(JSON.stringify(requests.value)))
    if (undoStack.value.length > 20) {
      undoStack.value.shift()
    }
    // Очищаем стек redo
    redoStack.value = []

    // Рекурсивно ищем и удаляем запрос по id
    function removeRequest(list: Request[], id: string): Request | null {
      for (let i = 0; i < list.length; i++) {
        if (list[i].id === id) {
          return list.splice(i, 1)[0]
        }
        if (list[i].children) {
          const child = removeRequest(list[i].children, id)
          if (child) return child
        }
      }
      return null
    }

    // Рекурсивно ищем целевой элемент для вставки запроса в его children
    function insertRequest(list: Request[], targetId: string, req: Request): boolean {
      for (const item of list) {
        if (item.id === targetId) {
          item.children = item.children || []
          item.children.push(req)
          return true
        }
        if (item.children && insertRequest(item.children, targetId, req)) {
          return true
        }
      }
      return false
    }

    const requestToMove = removeRequest(requests.value, draggedId)
    if (requestToMove) {
      if (!insertRequest(requests.value, targetId, requestToMove)) {
        // Если не найден целевой элемент, добавляем запрос в конец списка
        requests.value.push(requestToMove)
      }
    }
    persistState()
  }

  const undo = () => {
    if (!undoStack.value.length) return
    // Сохраняем текущее состояние для redo
    redoStack.value.push(JSON.parse(JSON.stringify(requests.value)))
    const previousState = undoStack.value.pop()
    if (previousState) requests.value = previousState
    persistState()
  }

  const redo = () => {
    if (!redoStack.value.length) return
    // Сохраняем текущее состояние для undo
    undoStack.value.push(JSON.parse(JSON.stringify(requests.value)))
    const nextState = redoStack.value.pop()
    if (nextState) requests.value = nextState
    persistState()
  }

  // Загружаем сохраненное состояние (если на клиенте)
  loadState()

  return { requests, moveRequest, undo, redo }
})