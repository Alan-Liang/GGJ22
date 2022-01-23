let seed = Math.floor(Math.random() * 1048576)
const setSeed = x => { seed = x }
export { setSeed as seed }

/**
 * A seeded RNG, definitely not CSPRNG
 * @see https://stackoverflow.com/a/19303725
 * @returns {number}
 */
export const random = () => {
  const x = Math.sin(seed++) * 10000
  return x - Math.floor(x)
}

/**
 * Generates a random integer
 * @param {number} max generate a random number in [0, max)
 * @returns {number}
 */
export const randint = max => Math.floor(random() * max)

/**
 * Randomly pick one from many choices
 * @param {T[]} array possible choices
 * @returns {T}
 */
export const pick = array => array[randint(array.length)]
