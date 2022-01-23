<template>
  <p><strong>Note from the designer:</strong> I have no idea what puzzle to put on these levels.</p>
  <p>TODO</p>
  <p><em>Press any key to continue</em></p>
</template>

<script setup>
import { addWindowListener } from '../../util/window-listener'

const emit = defineEmits([ 'ok' ])
addWindowListener('keydown', e => {
  e.preventDefault()
  emit('ok')
})
</script>
