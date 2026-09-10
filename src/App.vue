<script setup lang="ts">
import ActionBar from '@/components/ActionBar.vue'
import RestTimerCard from '@/components/RestTimerCard.vue'
import SetProgressCard from '@/components/SetProgressCard.vue'
import { useIntervalTimer } from '@/composables/useIntervalTimer'

const {
  totalSets,
  currentSet,
  presets,
  selectedPreset,
  totalRestTime,
  timeLeft,
  isRunning,
  isRinging,
  addSet,
  resetSets,
  selectSet,
  setRestTime,
  adjustTime,
  toggleTimer,
  stopRingtone,
  skipRest,
} = useIntervalTimer()
</script>

<template>
  <div class="flex min-h-screen justify-center p-4 font-sans text-text-main md:p-8">
    <div class="mx-auto w-full max-w-md space-y-6 pb-24">
      <SetProgressCard
        :total-sets="totalSets"
        :current-set="currentSet"
        @add-set="addSet"
        @select-set="selectSet"
        @reset-sets="resetSets"
      />

      <RestTimerCard
        :presets="presets"
        :selected-preset="selectedPreset"
        :time-left="timeLeft"
        :total-rest-time="totalRestTime"
        :is-running="isRunning"
        @select-preset="setRestTime"
        @adjust-time="adjustTime"
      />

      <ActionBar
        :is-running="isRunning"
        :is-ringing="isRinging"
        @skip="skipRest"
        @toggle="toggleTimer"
        @stop-alarm="stopRingtone"
        @add-time="adjustTime"
      />
    </div>
  </div>
</template>
