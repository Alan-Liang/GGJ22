export const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
// eslint-disable-next-line no-async-promise-executor
export const waitUntil = predicate => new Promise(async resolve => {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const result = predicate()
    if (result) return resolve(result)
    await delay(100)
  }
})
export const waitCallback = () => {
  let resolve, reject
  const promise = new Promise((resolve_, reject_) => {
    resolve = resolve_
    reject = reject_
  })
  return [
    promise,
    async x => {
      while (!resolve) await delay(1)
      resolve(x)
    },
    async x => {
      while (!reject) await delay(1)
      reject(x)
    },
  ]
}
export const timeout = (promise, ms) => new Promise((resolve, reject) => {
  promise.then(resolve).catch(reject)
  delay(ms).then(() => reject(new Error('Timeout')))
})
