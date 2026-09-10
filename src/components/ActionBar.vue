<script setup lang="ts">
defineProps<{
  isRunning: boolean
  isRinging: boolean
}>()

const emit = defineEmits<{
  skip: []
  toggle: []
  stopAlarm: []
  addTime: [amount: number]
}>()
</script>

<template>
  <!-- Floating action bar -->
  <div class="fixed bottom-6 left-0 right-0 z-50 mx-auto flex space-x-3 px-4 md:max-w-md md:px-0">
    <div
      class="flex w-full items-center justify-between rounded-full border border-gray-100 bg-card-bg p-2 shadow-lg"
    >
      <button
        class="btn-transition flex h-14 w-20 flex-col items-center justify-center rounded-full bg-accent-red text-text-red"
        @click="emit('skip')"
      >
        <i class="fa-solid fa-forward-step mb-1 text-sm"></i>
        <span class="text-[10px] font-bold tracking-wider uppercase">Skip</span>
      </button>

      <button
        class="btn-transition mx-2 flex h-14 flex-1 items-center justify-center rounded-full text-lg font-semibold text-white shadow-md transition-colors duration-300"
        :class="isRinging ? 'animate-pulse bg-red-500' : 'bg-primary-dark'"
        @click="isRinging ? emit('stopAlarm') : emit('toggle')"
      >
        <i
          class="fa-solid"
          :class="isRinging ? 'fa-bell-slash' : isRunning ? 'fa-pause' : 'fa-play'"
        ></i>
        <span class="ml-2">{{
          isRinging ? 'Stop Alarm' : isRunning ? 'Pause' : 'Start Rest'
        }}</span>
      </button>

      <button
        class="btn-transition flex h-14 w-20 flex-col items-center justify-center rounded-full bg-primary-light text-primary-dark"
        @click="emit('addTime', 30)"
      >
        <i class="fa-solid fa-plus mb-1 text-sm"></i>
        <span class="text-[11px] font-bold">+30s</span>
      </button>
    </div>
  </div>
</template>
