<template>
  <p>
    Press
    <kbd :class="{ ok: hasTab }">Tab</kbd>
    and
    <kbd :class="{ ok: hasDelete }">Delete</kbd>
    simultaneously
  </p>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { addWindowListener } from '../../util/window-listener'
import { keycode } from '../../util/keycodes'

const emit = defineEmits([ 'ok' ])
const keyPressed = reactive(new Set())
const hasTab = computed(() => keyPressed.has(keycode.TAB))
const hasDelete = computed(() => keyPressed.has(keycode.DELETE))
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

<style scoped>
.ok {
  color: #4f6;
  text-shadow: rgba(255, 255, 255, .8) 0.5px 0.5px 1px;
}
</style>
