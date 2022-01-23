import { ref } from 'vue'
import * as Tone from 'tone'
import { keycode } from '../util/keycodes'
import { pick, seed } from '../util/random'
import { waitCallback, waitUntil, timeout } from '../util/promise'
import { useRedlight } from '../services/redlight'

export const usePlayback = () => {
  const playing = ref(false)

  const makeSource = x => new Tone.Synth().connect(new Tone.Panner3D({
    panningModel: 'HRTF',
    positionX: x,
    positionY: 0,
    positionZ: 0,
  }).toDestination()).sync()
  Tone.Transport.bpm.value = 60

  let stop_
  const play = async (music, seed_) => {
    if (playing.value) return
    playing.value = true
    await Tone.start()
    Tone.Transport.start()
    let currentTime = 0
    const right = makeSource(5)
    const left = makeSource(-5)
    stop_ = () => {
      playing.value = false
      left.volume.value = right.volume.value = -Infinity
      Tone.Transport.stop()
      stop_ = null
    }
    seed(seed_)
    for (const { note, duration } of music) {
      if (note) {
        const source = pick([ left, right ])
        source.triggerAttackRelease(note, duration, currentTime)
      }
      currentTime += left.toSeconds(duration)
    }
  }

  const stop = () => stop_?.()
  return { playing, play, stop }
}

export const useChallengeInput = stop => {
  const { red, green } = useRedlight()

  const sequence = []

  const grace = 0.8 // seconds
  Tone.Transport.bpm.value = 60

  let extraneousHit = false
  const extraneousHitCallback = e => {
    if (e.keyCode === keycode.DELETE || e.keyCode === keycode.TAB) {
      e.preventDefault()
      red()
      stop()
      window.umami?.('fail-extra')
      extraneousHit = true
      window.removeEventListener('keydown', extraneousHitCallback)
    }
  }

  const play = async (music, seed_, onfail = () => {}) => {
    const fail = () => {
      window.umami?.('fail')
      window.umami?.('fail-' + music.name)
      onfail()
    }
    let currentTime = 0
    sequence.length = 0
    seed(seed_)
    for (const { note, duration } of music) {
      if (note) {
        const source = pick([ 'left', 'right' ])
        sequence.push([ source, Tone.Transport.toSeconds(duration), currentTime ])
      }
      currentTime += Tone.Transport.toSeconds(duration)
    }
    const now = Tone.now()
    for (const [ source, duration, time ] of sequence) {
      await waitUntil(() => Tone.now() > now + time)
      if (extraneousHit) {
        extraneousHit = false
        fail()
        return
      }
      const key = source === 'left' ? keycode.DELETE : keycode.TAB
      const [ promise, resolve, reject ] = waitCallback()
      const callback = e => {
        if (e.keyCode === keycode.DELETE || e.keyCode === keycode.TAB) {
          e.preventDefault()
          e.keyCode === key ? resolve() : reject()
        }
      }
      window.removeEventListener('keydown', extraneousHitCallback)
      window.addEventListener('keydown', callback)
      let ok = false
      try {
        await timeout(promise, (duration + grace) * 1000)
        green()
        ok = true
      } catch (_) {
        red()
        stop()
        fail()
        return
      } finally {
        window.removeEventListener('keydown', callback)
        if (ok) window.addEventListener('keydown', extraneousHitCallback)
      }
    }
    window.removeEventListener('keydown', extraneousHitCallback)
    await waitUntil(() => Tone.now() > now + currentTime)
    stop()
    okCallback()
  }

  const [ ok, okCallback ] = waitCallback()
  return { play, ok }
}
