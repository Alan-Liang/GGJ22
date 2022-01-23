import { delay, waitCallback } from '../util/promise'

let status = null
export const useRedlight = () => {
  const app = document.getElementById('app')
  const makeLight = name => async () => {
    if (status) {
      status()
      app.classList.remove('red')
      app.classList.remove('green')
      await delay(10)
    }
    const [ cancel, callback ] = waitCallback()
    status = () => callback('cancel')
    app.classList.add(name)
    if (await Promise.any([ delay(400), cancel ]) !== 'cancel') {
      app.classList.remove(name)
      status = null
    }
  }
  return {
    red: makeLight('red'),
    green: makeLight('green'),
  }
}
