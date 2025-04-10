<template>
  <div class="games-page games-table-wrapper container">
    <h1>Games List</h1>
    <div class="controls">
      <button @click="undo">Undo</button>
      <button @click="redo">Redo</button>
    </div>
    <GamesTable
        :games="gamesStore.games"
        @edit-game="editGame"
        @remove-game="removeGame"
        @dragged="onItemDragged"
    />
    <div class="footer-pagination">
      <Pagination
          :pagesCount="pagesCount"
          :currentPage="currentPage"
          @page-change="loadGames"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGamesStore } from '~/stores/games'
import GamesTable from '~/components/GamesTable.vue'
import Pagination from '~/components/Pagination.vue'

const gamesStore = useGamesStore()

const currentPage = ref(1)
const totalItems = ref(0)
const pageSize = 5
const pagesCount = computed(() => Math.ceil(totalItems.value / pageSize))

async function loadGames(page = 1) {
  currentPage.value = page
  const { data, error } = await useFetch(`/api/games?page=${page}`)
  if (error.value) {
    console.error('Error loading games:', error.value)
    return
  }
  if (data.value) {
    const newItems = data.value.items
    const storageKey = `games_data_page_${page}`
    const storedDataStr = localStorage.getItem(storageKey)
    if (storedDataStr) {
      gamesStore.games = JSON.parse(storedDataStr)
      gamesStore.loadState(page)
    } else {
      gamesStore.games = newItems
      localStorage.setItem(storageKey, JSON.stringify(newItems))
    }
    totalItems.value = data.value.total
  }
}

if (!gamesStore.games.length) {
  loadGames(1)
}

function onItemDragged(payload: { draggedId: string, targetId: string }) {
  gamesStore.moveGame(payload.draggedId, payload.targetId, currentPage.value)
}

function editGame(game) {
  alert(`Edit game: ${game.name}`)
}

function removeGame(id: string) {
  if (confirm('Are you sure you want to delete this game?')) {
    const removeGameFromList = (list: any[], id: string): boolean => {
      for (let i = 0; i < list.length; i++) {
        if (list[i].id === id) {
          list.splice(i, 1)
          return true
        }
        if (list[i].children && removeGameFromList(list[i].children, id)) return true
      }
      return false
    }
    removeGameFromList(gamesStore.games, id)
  }
}

function undo() {
  gamesStore.undo(currentPage.value)
}
function redo() {
  gamesStore.redo(currentPage.value)
}
</script>

<style scoped>
</style>