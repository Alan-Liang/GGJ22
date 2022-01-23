<template>
  <div>
    <transition name="fade" mode="out-in">
      <component :is="content" :code="code" :code-in="codeIn" @ok="advance" @fail="fail" />
    </transition>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { id, parseId } from '../../services/device-id'
import { seed, randint } from '../../util/random'
import { addWindowListener } from '../../util/window-listener'
import Level4Challenge from './Level4Challenge.vue'
import Level4Confirm from './Level4Confirm.vue'
import Level4Instructions from './Level4Instructions.vue'
import Level4Params from './Level4Params.vue'

addWindowListener('keyup', e => {
  if (e.key === 'Alt') advance(233)
})

const stage = ref(0)
const content = computed(() => [
  Level4Instructions,
  Level4Params,
  Level4Challenge,
  Level4Confirm,
][stage.value])

const code = ref(0)
const codeIn = ref(0)

const advance = otherCode => {
  if (stage.value === 0) {
    seed(Math.random())
    code.value = randint(1048576) + 4096
    seed(parseId(id).seed + code.value)
  }
  if (stage.value === 1) codeIn.value = otherCode
  if (stage.value === 3) {
    emit('ok')
    return
  }
  stage.value++
}

const fail = () => stage.value = 0

const emit = defineEmits([ 'ok' ])
</script>
