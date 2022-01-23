<template>
  <p>Press <kbd>Tab</kbd> + <kbd>Delete</kbd> simultaneously</p>
</template>

<script setup>
import { addWindowListener } from '../../util/window-listener'
import { keycode } from '../../util/keycodes'

const emit = defineEmits([ 'ok' ])
const keyPressed = new Set()
addWindowListener('keydown', e => {
  if (e.keyCode === keycode.TAB || e.keyCode === keycode.DELETE) {
    e.preventDefault()
    keyPressed.add(e.keyCode)
    if (keyPressed.size === 2) emit('ok')
  }
})
addWindowListener('keyup', e => {
  if (e.keyCode === keycode.TAB || e.keyCode === keycode.DELETE) {
    e.preventDefault()
    keyPressed.delete(e.keyCode)
  }
})
</script>
