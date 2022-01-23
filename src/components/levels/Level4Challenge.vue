<template>
  <div>
    <div>
      <p>When you hear a sound from the left, press <kbd>Delete</kbd>.</p>
      <p>When you hear a sound from the right, press <kbd>Tab</kbd>.</p>
      <transition name="fade">
        <p v-if="!playing">Press <kbd>Enter</kbd> on two devices at the same time.</p>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { usePlayback, useChallengeInput } from '../../services/lrc'
import { music } from '../../util/music'
import { keycode } from '../../util/keycodes'
import { addWindowListener } from '../../util/window-listener'
import { id, otherParty, parseId } from '../../services/device-id'

const props = defineProps([ 'code', 'codeIn' ])

// TODO: other music
const { playing, play, stop } = usePlayback(music.THE_CABLE_TEMPLE)
const { play: playInput, ok } = useChallengeInput(music.THE_CABLE_TEMPLE, stop)

addWindowListener('keydown', e => {
  if (e.keyCode === keycode.ENTER) {
    e.preventDefault()
    play(parseId(id).seed + props.code)
    playInput(parseId(otherParty.value).seed + props.codeIn)
  }
})

const emit = defineEmits([ 'ok' ])
ok.then(() => emit('ok'))
</script>
