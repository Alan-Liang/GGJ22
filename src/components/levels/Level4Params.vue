<template>
  <div>
    <p>Your code: <strong>{{ code }}</strong></p>
    <p>Enter the code on the other device: <input v-model="otherCode"></p>
    <transition name="fade" mode="out-in">
      <p v-if="tip" v-text="tip" />
    </transition>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { id, otherParty } from '../../services/device-id'
import { hash } from '../../util/hash'

const props = defineProps([ 'code' ])
const emit = defineEmits([ 'ok' ])
const code = computed(() => {
  const data = props.code.toString(36).padStart(4, '0')
  const checksum = hash(id + data).slice(0, 2)
  return data + checksum
})

const tip = ref('')
const otherCode = ref('')
watch(otherCode, () => {
  if (otherCode.value.length !== 6) {
    tip.value = ''
    return
  }
  const data = otherCode.value.slice(0, 4)
  const checksum = otherCode.value.slice(4)
  if (otherCode.value === code.value) {
    tip.value = 'Don\'t use your own code.'
    return
  }
  if (hash(otherParty.value + data).slice(0, 2) !== checksum || !/^[0-9a-z]+$/.test(data)) {
    tip.value = 'Invalid code.'
    return
  }
  emit('ok', parseInt(data, 36))
})
</script>
