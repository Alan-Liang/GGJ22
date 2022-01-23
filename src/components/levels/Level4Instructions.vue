<template>
  <div>
    <p>Listen to the <em>other</em> device.</p>
    <p>When you hear a sound from the left, press <kbd>Delete</kbd>.</p>
    <p>When you hear a sound from the right, press <kbd>Tab</kbd>.</p>
    <p>Press <kbd>Enter</kbd> to continue.</p>
    <p>Your device ID: {{ id }}</p>
  </div>
</template>

<script setup>
import { id } from '../../services/device-id'
import { keycode } from '../../util/keycodes'
import { addWindowListener } from '../../util/window-listener'

defineProps([ 'code' ])

const emit = defineEmits([ 'ok' ])
addWindowListener('keyup', e => {
  if (e.keyCode === keycode.ENTER) {
    e.preventDefault()
    emit('ok')
  }
})
</script>
