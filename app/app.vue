<script setup lang="ts">
// Components and the composable are auto-imported by Nuxt from app/ and app/components/.
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

      <a
        href="https://github.com/ittuann/GYM-Interval-Timer"
        target="_blank"
        rel=""
        class="block text-center text-sm text-text-muted underline-offset-2 hover:text-text-main hover:underline"
      >
        View source code on GitHub
      </a>

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
