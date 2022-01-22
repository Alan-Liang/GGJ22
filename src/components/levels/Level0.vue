<template>
  <p>Press <kbd>Tab</kbd> + <kbd>Delete</kbd> simultaneously</p>
</template>

<script setup>
import { defineEmits } from 'vue'
import { addWindowListener } from '../../util/window-listener'

const KEYCODE_TAB = 9
const KEYCODE_DELETE = 46

const emit = defineEmits([ 'ok' ])
const keyPressed = new Set()
addWindowListener('keydown', e => {
  if (e.keyCode === KEYCODE_TAB || e.keyCode === KEYCODE_DELETE) {
    e.preventDefault()
    keyPressed.add(e.keyCode)
    if (keyPressed.size === 2) emit('ok')
  }
})
addWindowListener('keyup', e => {
  if (e.keyCode === KEYCODE_TAB || e.keyCode === KEYCODE_DELETE) {
    e.preventDefault()
    keyPressed.delete(e.keyCode)
  }
})
</script>
