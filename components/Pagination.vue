<template>
  <div class="pagination">
    <button
        class="btn-pagination"
        v-for="page in pagesCount"
        :key="page"
        :class="{ active: page === currentPage }"
        @click="onPageClick(page)"
    >
      {{ page }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{
  pagesCount: number,
  currentPage: number
}>()

const emits = defineEmits<{
  (e: 'page-change', page: number): void
}>()

function onPageClick(page: number) {
  emits('page-change', page)
}
</script>