import { ref, computed } from 'vue'
import { levels } from '../components/levels'
import Mobile from '../components/levels/Mobile.vue'
import Thanks from '../components/Thanks.vue'
import { isMobile } from '../util/mobile'
import { id, otherParty, parseId } from './device-id'

const currentLevel = ref(0)
const levelComponent = computed(() => {
  if (isMobile) return Mobile
  if (completed.value) return Thanks
  return levels[currentLevel.value][1]
})
const completed = ref(false)

currentLevel.value = 0

// TODO: store in localStorage

const nextLevel = () => {
  if (currentLevel.value === levels.length - 1) {
    completed.value = true
    return ''
  }
  currentLevel.value++
  if (currentLevel.value === 3) {
    if (parseId(id).oscpu !== parseId(otherParty.value).oscpu) {
      currentLevel.value++
    }
  }
  return levels[currentLevel.value][0]
}

export const useLevelState = () => {
  return {
    currentLevel,
    levelComponent,
    nextLevel,
    completed,
  }
}
