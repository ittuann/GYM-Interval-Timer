import { onUnmounted, ref } from 'vue'

import * as ringtone from '@/audio/ringtone'

export interface RestPreset {
  label: string
  value: number
}

/** Default number of sets, also used by "Reset All Sets". */
const DEFAULT_SETS = 4

/** The alarm stops by itself after this long and the next set begins. */
const RINGTONE_AUTO_STOP_MS = 60_000

/** Interval timer state: set tracking, rest countdown and alarm handling. */
export function useIntervalTimer() {
  // Exercise data
  const totalSets = ref(DEFAULT_SETS)
  const currentSet = ref(1)

  const presets: RestPreset[] = [
    { label: '30s', value: 30 },
    { label: '45s', value: 45 },
    { label: '60s', value: 60 },
    { label: '90s', value: 90 },
    { label: '2m', value: 120 },
  ]
  const selectedPreset = ref(90)

  // Timer state
  const totalRestTime = ref(selectedPreset.value)
  const timeLeft = ref(selectedPreset.value)
  const isRunning = ref(false)
  const isRinging = ref(false)

  let timerInterval: ReturnType<typeof setInterval> | undefined
  let ringtoneTimeout: ReturnType<typeof setTimeout> | undefined

  function addSet(): void {
    totalSets.value++
  }

  function resetSets(): void {
    currentSet.value = 1
    totalSets.value = DEFAULT_SETS
  }

  function selectSet(set: number): void {
    currentSet.value = set
  }

  function setRestTime(seconds: number): void {
    selectedPreset.value = seconds
    totalRestTime.value = seconds
    timeLeft.value = seconds
  }

  function adjustTime(amount: number): void {
    timeLeft.value = Math.max(0, timeLeft.value + amount)

    // Keep the ring proportional when the rest time grows.
    if (timeLeft.value > totalRestTime.value) {
      totalRestTime.value = timeLeft.value
    }
  }

  function startTimer(): void {
    isRunning.value = true
    timerInterval = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--
      } else {
        completeRest()
      }
    }, 1000)
  }

  function pauseTimer(): void {
    isRunning.value = false
    clearInterval(timerInterval)
    timerInterval = undefined
  }

  function toggleTimer(): void {
    if (isRunning.value) {
      pauseTimer()
      return
    }
    // Unlock audio on the first user interaction.
    ringtone.prime()
    if (timeLeft.value === 0) {
      setRestTime(selectedPreset.value)
    }
    startTimer()
  }

  function advanceSet(): void {
    // Grow the set list when the last set finishes.
    if (currentSet.value >= totalSets.value) {
      totalSets.value++
    }
    currentSet.value++

    timeLeft.value = selectedPreset.value
    totalRestTime.value = selectedPreset.value
  }

  async function playRingtone(): Promise<void> {
    await ringtone.play()
    isRinging.value = true

    // Auto-stop after 60 seconds and move on to the next set.
    ringtoneTimeout = setTimeout(() => {
      if (isRinging.value) {
        stopRingtone()
      }
    }, RINGTONE_AUTO_STOP_MS)
  }

  function stopRingtone(): void {
    clearTimeout(ringtoneTimeout)
    ringtoneTimeout = undefined
    ringtone.stop()
    isRinging.value = false

    // Officially move on to the next set once the alarm stops.
    advanceSet()
  }

  function skipRest(): void {
    if (isRinging.value) {
      stopRingtone()
      return
    }
    pauseTimer()
    timeLeft.value = 0
    advanceSet()
  }

  function completeRest(): void {
    pauseTimer()
    void playRingtone()
  }

  onUnmounted(() => {
    clearInterval(timerInterval)
    clearTimeout(ringtoneTimeout)
    ringtone.stop()
  })

  return {
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
  }
}
