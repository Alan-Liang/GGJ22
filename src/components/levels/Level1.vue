<template>
  <div>
    <p>When you hear a sound from the left, press <kbd>Delete</kbd>.</p>
    <p>When you hear a sound from the right, press <kbd>Tab</kbd>.</p>
    <transition name="fade">
      <p v-if="!playing">Press <kbd>Enter</kbd> to start playing.</p>
    </transition>
  </div>
</template>

<script setup>
import { defineEmits, ref } from 'vue'
import * as Tone from 'tone'
import { keycode } from '../../util/keycodes'
import { addWindowListener } from '../../util/window-listener'
import { deviceSeed } from '../../services/device-id'
import { seed, pick } from '../../util/random'
import { waitCallback, waitUntil, timeout } from '../../util/promise'
import { useRedlight } from '../../services/redlight'

const { red, green } = useRedlight()

const playing = ref(false)

seed(deviceSeed)

// Omnipotent Youth Society - The Cable Temple
const music = `
A3 4n
G3 4n
E3 8n.
B3 16n
A3 2n
 4n
E4 4n
D4 4n
D4 8n.
B3 16n
B3 2n
`.split('\n')
  .filter(Boolean)
  .map(x => x.split(' '))
  .map(([ note, duration ]) => ({ note, duration }))

const makeSource = x => new Tone.Synth().connect(new Tone.Panner3D({
  panningModel: 'HRTF',
  positionX: x,
  positionY: 0,
  positionZ: 0,
}).toDestination()).sync()
Tone.Transport.bpm.value = 60

const sequence = []

const grace = 0.8 // seconds

const play = async () => {
  if (playing.value) return
  playing.value = true
  await Tone.start()
  Tone.Transport.start()
  let currentTime = 0
  sequence.length = 0
  const right = makeSource(5)
  const left = makeSource(-5)
  const stop = () => {
    playing.value = false
    left.volume.value = right.volume.value = -Infinity
    Tone.Transport.stop()
  }
  for (const { note, duration } of music) {
    if (note) {
      const source = pick([ left, right ])
      sequence.push([ source, source.toSeconds(duration), currentTime ])
      source.triggerAttackRelease(note, duration, currentTime)
    }
    currentTime += left.toSeconds(duration)
  }
  const now = Tone.now()
  for (const [ source, duration, time ] of sequence) {
    await waitUntil(() => Tone.now() > now + time)
    const key = source === left ? keycode.DELETE : keycode.TAB
    const [ promise, resolve, reject ] = waitCallback()
    const callback = e => {
      if (e.keyCode === keycode.DELETE || e.keyCode === keycode.TAB) {
        e.preventDefault()
        e.keyCode === key ? resolve() : reject()
      }
    }
    window.addEventListener('keydown', callback)
    try {
      await timeout(promise, (duration + grace) * 1000)
      green()
    } catch (_) {
      red()
      stop()
      return
    } finally {
      window.removeEventListener('keydown', callback)
    }
  }
  await waitUntil(() => Tone.now() > now + currentTime)
  stop()
  emit('ok')
}

const emit = defineEmits([ 'ok' ])
addWindowListener('keydown', e => {
  if (e.keyCode === keycode.ENTER) {
    e.preventDefault()
    play()
  }
})
</script>
