<template>
  <div class="row-wrapper">
    <div
        class="row-item"
        :class="[{ 'drag-over': isDragOver }, { expanded: isExpanded(game.id) }, { dragging: isDragging }]"
        draggable="true"
        @dragstart="onDragStart"
        @dragenter="onDragEnter"
        @dragleave="onDragLeave"
        @dragover.prevent
        @drop="onDrop"
        @dragend="onDragEnd"
    >
      <div class="cell table-80">
        <div class="td-item">
          <span>№</span>
          <p>
            {{ indexDisplay }}
          </p>
        </div>
      </div>
      <div class="cell table-30">
        <div class="td-item">
          <span>Name</span>
          <p>
            <img v-if="game.children?.length" src="/assets/icons/File.svg" alt="File"  />
            <img v-else src="/assets/icons/Doc.svg" alt="Docs"  />
            {{ game.name }}
          </p>
        </div>
      </div>
      <div class="cell table-20">
        <div class="td-item">
          <span>Order</span>
          <p>{{ game.order }}</p>
        </div>
      </div>
      <div v-if="game.children" class="cell full-width">
        <div class="cell full-width justify-between">
          <div class="sub-categories">
            <span>Sub categories</span>
            <p class="td-item">{{ subCategoriesString(game) }}</p>
          </div>
          <span v-if="game.children && game.children.length" class="sub-count">
            {{ game.children ? game.children.length : 0 }}
          </span>
        </div>
      </div>
      <div class="cell table-150">

        <div class="exp-td">

          <span v-if="hasChildren" class="exp-arrow" @click.stop="toggleExpand(game.id)">
            <img src="/assets/icons/Vector.svg" alt="Toggle" :class="{ expanded: isExpanded(game.id) }" />
          </span>
          <span v-if="hasChildren" class="exp-menu">
            <img src="/assets/icons/Dots.svg" alt="Toggle"  />
          </span>
        </div>
      </div>
    </div>

    <transition name="expand">
      <div v-if="isExpanded(game.id)" class="expand-row">
        <div class="expand-content">
          <RowChild
              v-for="(child, idx) in game.children"
              :key="child.id"
              :game="child"
              :index="idx"
              :level="level + 1"
              :expandedRows="expandedRows"
              @edit-game="$emit('edit-game', $event)"
              @remove-game="$emit('remove-game', $event)"
              @dragged="$emit('dragged', $event.draggedId, $event.targetId)"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue'
import type { Game } from '~/stores/games'
import RowChild from './RowChild.vue'

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
const isDragging = ref(false)
const indexDisplay = computed(() => (props.level === 0 ? props.index + 1 : ''))
const hasChildren = computed(() => {
  return props.game.children && props.game.children.length > 0
})

function isExpanded(id: string) {
  return props.expandedRows[id] === true
}

function toggleExpand(id: string) {
  props.expandedRows[id] = !props.expandedRows[id]
}

function onDragStart(e: DragEvent) {
  e.dataTransfer?.setData('text/plain', props.game.id)
  e.dataTransfer?.setData('level', String(props.level))
  e.dataTransfer!.effectAllowed = 'move'
  isDragOver.value = false
  isDragging.value = true
}

function onDragEnter(e: DragEvent) {
  isDragOver.value = true
  isDragging.value = true
}

function onDragLeave(e: DragEvent) {
  isDragOver.value = false
  isDragging.value = false
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
  isDragging.value = false
}

const subCategoriesString = (value: any) => {
  return value.children?.map(item => item.name).join('/') || ''
}
</script>

<style scoped>
</style>