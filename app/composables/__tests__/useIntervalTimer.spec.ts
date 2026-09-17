import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'

import * as ringtone from '@/audio/ringtone'
import { useIntervalTimer } from '@/composables/useIntervalTimer'

// Keep Tone.js (and its AudioContext) out of the jsdom environment.
vi.mock('@/audio/ringtone', () => ({
  prime: vi.fn<() => void>(),
  play: vi.fn<() => Promise<void>>(async () => {}),
  stop: vi.fn<() => void>(),
}))

type Timer = ReturnType<typeof useIntervalTimer>

/** Run the composable inside a real component instance so lifecycle hooks work. */
function withSetup(): Timer {
  let result!: Timer
  mount(
    defineComponent({
      setup() {
        result = useIntervalTimer()
        return () => h('div')
      },
    }),
  )
  return result
}

describe('useIntervalTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts at the default preset with the first set active', () => {
    const timer = withSetup()

    expect(timer.totalSets.value).toBe(4)
    expect(timer.currentSet.value).toBe(1)
    expect(timer.timeLeft.value).toBe(90)
    expect(timer.isRunning.value).toBe(false)
  })

  it('counts down every second while running and can be paused', async () => {
    const timer = withSetup()

    timer.toggleTimer()
    await vi.advanceTimersByTimeAsync(3000)
    expect(timer.timeLeft.value).toBe(87)
    expect(timer.isRunning.value).toBe(true)

    timer.toggleTimer()
    await vi.advanceTimersByTimeAsync(3000)
    expect(timer.timeLeft.value).toBe(87)
    expect(timer.isRunning.value).toBe(false)
  })

  it('rings when the countdown finishes and advances to the next set when stopped', async () => {
    const timer = withSetup()

    timer.setRestTime(2)
    timer.toggleTimer()
    // Tick 1: 2 -> 1, tick 2: 1 -> 0, tick 3: countdown done -> alarm.
    await vi.advanceTimersByTimeAsync(3000)

    expect(timer.isRunning.value).toBe(false)
    expect(timer.isRinging.value).toBe(true)
    expect(ringtone.play).toHaveBeenCalledTimes(1)

    timer.stopRingtone()
    expect(ringtone.stop).toHaveBeenCalledTimes(1)
    expect(timer.isRinging.value).toBe(false)
    expect(timer.currentSet.value).toBe(2)
    expect(timer.timeLeft.value).toBe(2)
  })

  it('auto-stops the alarm after 60 seconds', async () => {
    const timer = withSetup()

    timer.setRestTime(1)
    timer.toggleTimer()
    await vi.advanceTimersByTimeAsync(2000)
    expect(timer.isRinging.value).toBe(true)

    await vi.advanceTimersByTimeAsync(60_000)
    expect(timer.isRinging.value).toBe(false)
    expect(timer.currentSet.value).toBe(2)
  })

  it('skipRest jumps straight to the next set and stops the alarm if ringing', async () => {
    const timer = withSetup()

    timer.toggleTimer()
    timer.skipRest()
    expect(timer.isRunning.value).toBe(false)
    expect(timer.currentSet.value).toBe(2)
    expect(timer.timeLeft.value).toBe(90)

    timer.setRestTime(1)
    timer.toggleTimer()
    await vi.advanceTimersByTimeAsync(2000)
    expect(timer.isRinging.value).toBe(true)

    timer.skipRest()
    expect(timer.isRinging.value).toBe(false)
    expect(timer.currentSet.value).toBe(3)
  })

  it('grows the set list when the last set completes', () => {
    const timer = withSetup()

    timer.selectSet(4)
    timer.skipRest()

    expect(timer.totalSets.value).toBe(5)
    expect(timer.currentSet.value).toBe(5)
  })

  it('adjusts the rest time, clamped at zero and with a proportional ring', () => {
    const timer = withSetup()

    timer.adjustTime(30)
    expect(timer.timeLeft.value).toBe(120)
    expect(timer.totalRestTime.value).toBe(120)

    timer.adjustTime(-999)
    expect(timer.timeLeft.value).toBe(0)
  })

  it('resets the sets back to the baseline', () => {
    const timer = withSetup()

    timer.addSet()
    timer.addSet()
    timer.selectSet(3)
    timer.resetSets()

    expect(timer.totalSets.value).toBe(4)
    expect(timer.currentSet.value).toBe(1)
  })
})
