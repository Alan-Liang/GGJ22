<template>
  <div>
    <p>Your verification code: <strong>{{ code }}</strong></p>
    <p>Enter the verification code on the other device: <input v-model="verify"></p>
    <transition name="fade" mode="out-in">
      <p v-if="tip" v-text="tip" />
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { id, otherParty } from '../../services/device-id'
import { hash } from '../../util/hash'

const props = defineProps([ 'code', 'codeIn' ])
const code = computed(() => hash(id + props.code).slice(0, 4))
const otherCode = computed(() => hash(otherParty.value + props.codeIn).slice(0, 4))

const verify = ref('')
const tip = ref('')
watch(verify, () => {
  if (verify.value.length < 4) {
    tip.value = ''
    return
  }
  if (verify.value !== otherCode.value) {
    tip.value = 'Invalid verification code.'
    return
  }
  tip.value = ''
  emit('ok')
})

const emit = defineEmits([ 'ok' ])
</script>
