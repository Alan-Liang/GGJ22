<template>
  <div>
    <p>Your device ID: <strong>{{ id }}</strong></p>
    <p>Enter the device ID of the other device: <input v-model="otherId"></p>
    <transition name="fade" mode="out-in">
      <p v-if="tip" v-text="tip" />
    </transition>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { id, parseId, otherParty } from '../../services/device-id'

const otherId = ref('')
const tip = ref('')
watch(otherId, () => {
  if (otherId.value === id) {
    tip.value = 'You need another device.'
    return
  }
  if (parseId(otherId.value)) {
    otherParty.value = otherId.value
    emit('ok')
  }
  else if (otherId.value.length === 8) tip.value = 'Invalid device ID.'
  else tip.value = ''
})

const emit = defineEmits([ 'ok' ])
</script>
