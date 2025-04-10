<template>
  <div >
    <ul class="games-list">
      <li v-for="(game, index) in games" :key="game.id" class="game-item">
        <RowItem
            :game="game"
            :index="index"
            :level="0"
            :expandedRows="expandedRows"
            @edit-game="$emit('edit-game', $event)"
            @remove-game="$emit('remove-game', $event)"
            @dragged="onDragged"
        />
      </li>
    </ul>

    <div
        class="drop-zone-row"
        :class="{ 'drag-over': isRootDragOver }"
        @dragenter="onRootDragEnter"
        @dragover.prevent
        @dragleave="onRootDragLeave"
        @drop="onRootDrop"
    >
      <div class="drop-zone-text">
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
import type { Game } from '~/stores/games'
import RowItem from './RowItem.vue'

const props = defineProps<{
  games: Game[]
}>()

const emits = defineEmits<{
  (e: 'edit-game', game: Game): void
  (e: 'remove-game', id: string): void
  (e: 'dragged', payload: { draggedId: string; targetId: string }): void
}>()

const expandedRows = ref<Record<string, boolean>>({})
const isRootDragOver = ref(false)

function onDragged(payload: { draggedId: string; targetId: string }) {
  console.log('onDragged in GamesTable:', payload.draggedId, payload.targetId)
  emits('dragged', payload)
}

function onRootDragEnter(e: DragEvent) {
  isRootDragOver.value = true
  console.log('Drop‑zone: dragenter')
}

function onRootDragLeave(e: DragEvent) {
  isRootDragOver.value = false
  console.log('Drop‑zone: dragleave')
}

function onRootDrop(e: DragEvent) {
  e.preventDefault()
  isRootDragOver.value = false
  const draggedId = e.dataTransfer?.getData('text/plain')
  console.log('🔥 Drop‑zone onRootDrop, draggedId =', draggedId)
  if (draggedId) {
    emits('dragged', { draggedId, targetId: 'root' })
  }
}
</script>


<style scoped>

</style>