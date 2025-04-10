<template>
  <div
      class="expended-td"
      :class="[{ 'drag-over': isDragOver }, { expanded: isExpanded(game.id) }]"
      draggable="true"
      @dragstart="onDragStart"
      @dragenter="onDragEnter"
      @dragleave="onDragLeave"
      @dragover.prevent
      @drop="onDrop"
      @dragend="onDragEnd"
  >
    <div class="expended-box expended-item">
      <div class="cell table-80">
        <div class="td-item">
          <span>№</span>
          <p>{{ game.id }}</p>
        </div>
      </div>
      <div class="cell table-30">
        <div class="td-item">
          <span>Name</span>
          <p>
            <img  src="/assets/icons/Doc.svg" alt="Docs"  />
            {{ game.name }}
          </p>
        </div>
      </div>
      <div class="cell table-20">

      </div>
      <div class="cell full-width">
        <div class="td-item ">
          <span>Order</span>
          <p>{{ game.order }}</p>
        </div>

      </div>
      <div class="cell table-80">
        <div class="exp-div">
          <span class="exp-menu">
            <img
                src="/assets/icons/Dots.svg"
                alt="Toggle"
                :class="{ expanded: isExpanded(game.id) }"
            />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue'
import type { Game } from '~/stores/games'

const props = defineProps<{
  game: Game
  index: number
  level: number
  expandedRows: Record<string, boolean>
}>()

const emits = defineEmits<{
  (e: 'edit-game', game: Game): void
  (e: 'remove-game', id: string): void
  (e: 'dragged', payload: { draggedId: string, targetId: string }): void
}>()

const isDragOver = ref(false)


function isExpanded(id: string) {
  return props.expandedRows[id] === true
}


function onDragStart(e: DragEvent) {
  // Сохраняем id и уровень перетаскиваемого элемента
  e.dataTransfer?.setData('text/plain', props.game.id)
  e.dataTransfer?.setData('level', String(props.level))
  e.dataTransfer!.effectAllowed = 'move'
  isDragOver.value = false
  console.log('dragstart: ' + props.game.id)
}

function onDragEnter(e: DragEvent) {
  isDragOver.value = true
}

function onDragLeave(e: DragEvent) {
  isDragOver.value = false
}

function onDrop(e: DragEvent) {
  e.preventDefault()
  isDragOver.value = false
  const draggedId = e.dataTransfer?.getData('text/plain')
  const draggedLevel = Number(e.dataTransfer?.getData('level'))
  const targetLevel = props.level

  if (draggedId && draggedId !== props.game.id && draggedLevel === targetLevel) {
    emits('dragged', { draggedId, targetId: props.game.id })
  } else {
    console.log('Drop not allowed: level mismatch')
  }
}

function onDragEnd(e: DragEvent) {
  isDragOver.value = false
}
</script>

<style scoped>
</style>