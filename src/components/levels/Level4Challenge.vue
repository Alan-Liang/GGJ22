<template>
  <div>
    <p>{{ id }} | {{ props.codeText }}</p>
    <p>When you hear a sound from the left, press <kbd>Delete</kbd>.</p>
    <p>When you hear a sound from the right, press <kbd>Tab</kbd>.</p>
    <transition name="fade">
      <p v-if="!playing">Press <kbd>Enter</kbd> on two devices at the same time.</p>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { usePlayback, useChallengeInput } from '../../services/lrc'
import { music } from '../../util/music'
import { keycode } from '../../util/keycodes'
import { addWindowListener } from '../../util/window-listener'
import { id, otherParty, parseId } from '../../services/device-id'
import { pick, seed } from '../../util/random'

const props = defineProps([ 'code', 'codeIn', 'codeText' ])

// TODO: other music
const { play, stop } = usePlayback()
const { play: playInput, ok } = useChallengeInput(stop)

const playing = ref(false)

addWindowListener('keydown', e => {
  if (e.keyCode === keycode.ENTER) {
    e.preventDefault()
    if (playing.value) return
    playing.value = true
    const playSeed = parseId(id).seed + props.code
    const inSeed = parseId(otherParty.value).seed + props.codeIn
    seed(playSeed)
    const playMusic = pick(Object.values(music))
    seed(inSeed)
    const inMusic = pick(Object.values(music))
    play(playMusic, playSeed)
    playInput(inMusic, inSeed, () => emit('fail'))
  }
})

const emit = defineEmits([ 'ok', 'fail' ])
ok.then(() => emit('ok'))
</script>
