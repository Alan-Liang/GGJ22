<template>
  <p>TODO: press any key to pass</p>
</template>

<script setup>
import { defineEmits } from 'vue'
import { addWindowListener } from '../../util/window-listener'

const emit = defineEmits([ 'ok' ])
addWindowListener('keyup', () => {
  emit('ok')
})
</script>
