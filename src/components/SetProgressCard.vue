<script setup lang="ts">
defineProps<{
  totalSets: number
  currentSet: number
}>()

const emit = defineEmits<{
  addSet: []
  selectSet: [set: number]
  resetSets: []
}>()
</script>

<template>
  <!-- Header card: current movement and sets -->
  <div class="rounded-[32px] bg-card-bg p-6 shadow-soft">
    <div class="mb-4 flex items-start justify-between">
      <div>
        <h1 class="text-2xl font-bold">GYM Interval Timer</h1>
      </div>
    </div>

    <!-- Sets title & description -->
    <div class="mb-4">
      <h2 class="text-sm font-semibold tracking-wider text-text-main uppercase">Progress</h2>
      <p class="mt-1 text-xs text-text-muted">Auto increase when Rest Timer is completed.</p>
    </div>

    <!-- Sets visualizer -->
    <div class="mb-2 flex flex-wrap justify-center gap-3 py-2">
      <div
        v-for="n in totalSets"
        :key="n"
        class="flex min-w-[60px] shrink-0 cursor-pointer flex-col items-center"
        @click="emit('selectSet', n)"
      >
        <div
          class="mb-2 flex h-12 w-12 items-center justify-center rounded-full border-2 text-lg font-medium transition-all duration-300"
          :class="[
            n < currentSet
              ? 'border-primary-dark bg-primary-dark text-white'
              : n === currentSet
                ? 'border-primary-dark bg-primary-light text-primary-dark'
                : 'border-gray-100 bg-gray-50 text-gray-400',
          ]"
        >
          <i v-if="n < currentSet" class="fa-solid fa-check text-sm"></i>
          <span v-else>{{ n }}</span>
        </div>
        <span
          class="text-xs font-medium"
          :class="n === currentSet ? 'text-primary-dark' : 'text-gray-400'"
        >
          {{ n === currentSet ? 'Active' : `Set ${n}` }}
        </span>
      </div>

      <!-- Button to dynamically add more sets -->
      <div class="mt-[2px] flex min-w-[60px] shrink-0 flex-col items-center">
        <button
          class="mb-2 flex h-11 w-11 items-center justify-center rounded-full border-2 border-dashed border-gray-300 bg-gray-50 text-gray-400 transition-colors hover:border-primary-dark hover:text-primary-dark"
          @click="emit('addSet')"
        >
          <i class="fa-solid fa-plus text-sm"></i>
        </button>
        <span class="text-xs font-medium text-gray-400">Add</span>
      </div>
    </div>

    <!-- Reset button -->
    <div class="mt-4 flex w-full justify-center border-t border-gray-100 pt-4">
      <button
        class="btn-transition flex items-center space-x-2 rounded-full bg-gray-50 px-5 py-2 text-sm font-medium text-text-muted transition-colors hover:bg-primary-light hover:text-primary-dark"
        @click="emit('resetSets')"
      >
        <i class="fa-solid fa-rotate-left"></i>
        <span>Reset All Sets</span>
      </button>
    </div>
  </div>
</template>
