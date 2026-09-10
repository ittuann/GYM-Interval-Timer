<script setup lang="ts">
import { computed } from 'vue'

import type { RestPreset } from '@/composables/useIntervalTimer'

const props = defineProps<{
  presets: RestPreset[]
  selectedPreset: number
  timeLeft: number
  totalRestTime: number
  isRunning: boolean
}>()

const emit = defineEmits<{
  selectPreset: [seconds: number]
  adjustTime: [amount: number]
}>()

// SVG circle geometry
const RADIUS = 46
const circumference = 2 * Math.PI * RADIUS

const strokeDashoffset = computed(() => {
  if (props.totalRestTime === 0) return circumference
  // The ring drains from a full circle down to empty.
  const progress = props.timeLeft / props.totalRestTime
  return circumference * (1 - progress)
})

const formattedTime = computed(() => {
  const minutes = Math.floor(Math.abs(props.timeLeft) / 60)
  const seconds = Math.abs(props.timeLeft) % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})
</script>

<template>
  <!-- Timer card -->
  <div class="relative flex flex-col items-center rounded-[32px] bg-card-bg p-6 shadow-soft">
    <!-- Circular timer -->
    <div class="relative mt-4 mb-8 flex h-64 w-64 items-center justify-center">
      <!-- SVG ring -->
      <svg class="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
        <!-- Background ring -->
        <circle
          class="stroke-current text-gray-100"
          stroke-width="6"
          cx="50"
          cy="50"
          r="46"
          fill="transparent"
        ></circle>
        <!-- Progress ring -->
        <circle
          class="progress-ring__circle stroke-current text-primary-light"
          stroke-width="6"
          stroke-linecap="round"
          cx="50"
          cy="50"
          r="46"
          fill="transparent"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="strokeDashoffset"
        ></circle>
      </svg>

      <!-- Timer text -->
      <div class="z-10 mt-4 flex flex-col items-center text-center">
        <span
          v-if="isRunning"
          class="mb-2 text-xs font-semibold tracking-widest text-text-muted uppercase"
        >
          Rest Period
        </span>
        <span v-else class="mb-2 text-xs font-semibold tracking-widest text-text-muted uppercase">
          Rest Timer
        </span>

        <div
          class="mb-2 text-6xl leading-none font-light tabular-nums"
          :class="{ 'text-text-main': isRunning, 'text-gray-400': !isRunning && timeLeft === 0 }"
        >
          {{ formattedTime }}
        </div>

        <span v-if="isRunning && timeLeft > 10" class="text-sm text-text-muted italic">
          Take a deep breath
        </span>
        <span
          v-else-if="isRunning && timeLeft <= 10"
          class="text-sm font-medium text-text-muted italic"
        >
          Get Ready!
        </span>
        <span v-else class="invisible text-sm text-text-muted italic">Placeholder</span>
      </div>
    </div>

    <!-- Rest adjustment buttons -->
    <div class="mb-8 flex w-full items-center justify-center space-x-4">
      <button
        class="btn-transition rounded-full bg-primary-light px-4 py-2 text-sm font-medium text-primary-dark"
        @click="emit('adjustTime', -15)"
      >
        -15s
      </button>
      <span class="text-sm font-medium text-text-muted">Rest Adjustment</span>
      <button
        class="btn-transition rounded-full bg-primary-light px-4 py-2 text-sm font-medium text-primary-dark"
        @click="emit('adjustTime', 15)"
      >
        +15s
      </button>
    </div>

    <hr class="mb-6 w-full border-gray-100" />

    <!-- Preset times -->
    <div class="flex w-full justify-between space-x-2">
      <button
        v-for="preset in presets"
        :key="preset.value"
        class="flex-1 rounded-full border py-2 text-sm font-medium transition-colors"
        :class="
          selectedPreset === preset.value
            ? 'border-primary-dark bg-primary-dark text-white'
            : 'border-gray-200 bg-white text-text-main hover:bg-gray-50'
        "
        @click="emit('selectPreset', preset.value)"
      >
        {{ preset.label }}
      </button>
    </div>
  </div>
</template>
