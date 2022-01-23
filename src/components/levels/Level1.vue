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
import { usePlayback, useChallengeInput } from '../../services/lrc'
import { music } from '../../util/music'
import { keycode } from '../../util/keycodes'
import { addWindowListener } from '../../util/window-listener'
import { pick } from '../../util/random'

const { playing, play, stop } = usePlayback()
const { play: playInput, ok } = useChallengeInput(stop)

addWindowListener('keydown', e => {
  if (e.keyCode === keycode.ENTER) {
    e.preventDefault()
    if (playing.value) return
    const seed = Math.random()
    const music_ = pick(Object.values(music))
    play(music_, seed)
    playInput(music_, seed)
  }
})

const emit = defineEmits([ 'ok' ])
ok.then(() => emit('ok'))
</script>
