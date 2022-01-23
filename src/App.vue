<template>
  <main class="container">
    <div id="main-lines" ref="mainLinesEl" :class="{ notransition }">
      <div id="lines" :class="{ notransition }" ref="linesEl">
        <p
          v-for="(str, i) in lines"
          :key="i"
          v-show="str"
          v-text="str"
          class="line"
          :class="{ [`line-${lines.length - i}`]: true }"
        />
      </div>
      <transition name="fade-in">
        <p v-if="shadowLine" v-text="shadowLine" />
      </transition>
      <p ref="refHeightEl">to play this game.</p>
    </div>
    <transition name="fade-in">
      <p v-if="finalLine">Thank you for playing.</p>
    </transition>
  </main>
  <div id="instructions" class="container">
    <transition name="fade" mode="out-in">
      <component :is="levelComponent" @ok="advance" />
    </transition>
  </div>
</template>

<script setup>
import { nextTick, ref, reactive } from 'vue'
import { useLevelState } from './services/state'
import { delay } from './util/promise'

const { levelComponent, nextLevel, completed } = useLevelState()

const advance = async () => {
  const text = nextLevel()
  if (!completed.value) await addLine(text)
  else await showThanks()
}

const lines = reactive([
  'You need two hands',
])
const shadowLine = ref('')
const finalLine = ref(false)

const linesEl = ref(null)
const mainLinesEl = ref(null)
const refHeightEl = ref(null)

const notransition = ref(false)
const addLine = async str => {
  notransition.value = true
  await nextTick()
  shadowLine.value = str
  lines.push('')
  await nextTick()
  const height = refHeightEl.value.getBoundingClientRect().height
  linesEl.value.style.transform = `translateY(${height}px)`
  await delay(10)
  linesEl.value.style.transform = ''
  notransition.value = false
  await nextTick()
  await delay(600)
  shadowLine.value = ''
  await delay(50)
  lines.pop()
  lines.push(str)
}

const showThanks = async () => {
  notransition.value = true
  await nextTick()
  finalLine.value = true
  lines.push('')
  await nextTick()
  const height = refHeightEl.value.getBoundingClientRect().height
  mainLinesEl.value.style.transform = `translateY(${height}px)`
  await delay(10)
  notransition.value = false
  await nextTick()
  mainLinesEl.value.style.transform = ''
  // TODO: make scrollable
}

// eslint-disable-next-line no-unused-vars
const test = () => {
  const linesToShow = `
  , and two ears

  , and two

  , and two email addresses
  in two domains

  , and two devices
  on two platforms
  in two cities
  in two continents

  , and two friends

  , and a dual-stack network

  , and two web servers
  , one in IPv4, one in IPv6
  `.split('\n').filter(Boolean)

  ;(async () => {
    for (const line of linesToShow) {
      await delay(2000)
      await addLine(line)
    }
    await delay(2000)
    showThanks()
  })()
}
</script>

<style scoped>
#lines, #main-lines {
  transform: translateY(0);
  will-change: transform;
  transition: transform .5s ease;
}
#lines.notransition, #main-lines.notransition {
  transition: none;
}

.line {
  opacity: 0.4;
  transition: opacity 0.5s ease;
}

.line.line-1, .line.line-2 { opacity: 1; }
.line.line-3 { opacity: 0.8; }
.line.line-4 { opacity: 0.6; }
</style>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
img { border: none; }
table { border-collapse: collapse; }
a { text-decoration: none; color: inherit !important; font-weight: bold; }
a:hover, a:active, a:focus { text-decoration: underline; }

p { padding: 0.25em 0; }

body {
  min-width: 100vw;
  min-height: 100vh;
  font-family: sans-serif;
  font-size: calc(10px + 0.33vw);
  background-color: #444a4f;
  color: rgba(255, 255, 255, 0.8);
}

.container {
  display: flex;
  align-items: center;
  text-align: center;
  flex-direction: column;
}

main {
  justify-content: end;
  font-size: 3em;
  height: 60vh;
  padding-bottom: 1.5em;
}
#instructions {
  justify-content: start;
  font-size: 1.25em;
  height: 40vh;
  opacity: .8;
}

.fade-in-enter-active, .fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-in-enter-from, .fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@keyframes redlight {
  from { background: rgba(255, 80, 64, .4); }
  to { background: transparent; }
}
@keyframes greenlight {
  from { background: rgba(80, 255, 64, .4); }
  to { background: transparent; }
}

#app.red { animation: redlight .4s; }
#app.green { animation: greenlight .4s; }
</style>
