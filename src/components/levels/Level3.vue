<template>
  <div>
    <p>Your device ID: <strong>{{ id }}</strong></p>
    <p>Enter the other device's device ID: <input v-model="otherId"></p>
    <transition name="fade" mode="out-in">
      <p v-if="tip" v-text="tip" />
    </transition>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { id, otherParty, parseId } from '../../services/device-id'

const otherId = ref(otherParty.value)
const tip = ref('')
watch(otherId, () => {
  if (otherId.value === id) {
    tip.value = 'You need another device.'
    return
  }
  if (parseId(otherId.value)) {
    if (parseId(otherId.value).oscpu === parseId(id).oscpu) {
      tip.value = 'You need a device on another platform.'
      return
    }
    emit('ok')
  }
  else if (otherId.value.length === 8) tip.value = 'Invalid device ID.'
  else tip.value = ''
})

const emit = defineEmits([ 'ok' ])
</script>
