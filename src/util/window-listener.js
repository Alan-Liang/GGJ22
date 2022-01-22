import { onMounted, onBeforeUnmount } from 'vue'

/** @type { typeof window.addEventListener } */
export const addWindowListener = (event, listener) => {
  onMounted(() => { window.addEventListener(event, listener) })
  onBeforeUnmount(() => { window.removeEventListener(event, listener) })
}
