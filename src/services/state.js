import { ref, computed } from 'vue'
import { levels } from '../components/levels'
import Thanks from '../components/Thanks.vue'

const currentLevel = ref(0)
const levelComponent = computed(() => {
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
