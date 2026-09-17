/**
 * Rest-end alarm tone built on Tone.js.
 *
 * Browsers only allow audio after a user gesture, so the app calls `prime()`
 * from the first "Start Rest" click; after that the alarm can play freely.
 */
import { FMSynth, Loop, getTransport, start } from 'tone'

let synth: FMSynth | null = null
let audioLoop: Loop | null = null

/** Create the synth and the alarm loop. Must run inside a user gesture. */
async function init(): Promise<void> {
  if (synth) return

  // Unlock the audio context (requires a user interaction).
  await start()

  // Phone-notification-like tone (FMSynth).
  synth = new FMSynth({
    harmonicity: 3,
    modulationIndex: 10,
    oscillator: { type: 'sine' },
    envelope: { attack: 0.01, decay: 0.2, sustain: 0, release: 0.2 },
    modulation: { type: 'square' },
    modulationEnvelope: { attack: 0.01, decay: 0.2, sustain: 0, release: 0.2 },
  }).toDestination()
  synth.volume.value = -5

  // Short rising arpeggio, repeating every 1.5 seconds.
  audioLoop = new Loop((time) => {
    const s = synth
    if (!s) return
    s.triggerAttackRelease('E5', '32n', time)
    s.triggerAttackRelease('G#5', '32n', time + 0.1)
    s.triggerAttackRelease('B5', '32n', time + 0.2)
    s.triggerAttackRelease('E6', '32n', time + 0.3)
  }, 1.5)
}

/** Warm up the audio context so the alarm can play later without a gesture. */
export function prime(): void {
  void init()
}

/** Start the alarm loop. */
export async function play(): Promise<void> {
  await init()
  audioLoop?.start(0)
  getTransport().start()
}

/** Stop the alarm loop. */
export function stop(): void {
  audioLoop?.stop()
  getTransport().stop()
}
