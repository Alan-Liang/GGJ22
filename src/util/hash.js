/**
 * Performs caesar shift
 * @param {number} shift shift count
 * @param {string} str the string to be shifted
 * @returns {string}
 */
export const caesar = (shift, str) => [ ...str ]
  .map(x => x.codePointAt(0))
  .map(x => x >= 0x61 && x <= 0x7A ? (x - 0x61 + shift) % 26 + 0x61 : x)
  .map(x => String.fromCodePoint(x))
  .join('')
/**
 * Performs rot13.
 * @param {string} str the string to be rot13'd
 * @returns {string}
 */
export const rot13 = str => caesar(13, str)

const hashRound = (str, result) => {
  const mod = i => (i + result.length) % result.length
  for (const [ i, c ] of [ ...str ].entries()) {
    const ix = mod(i)
    result[ix] = caesar(c.codePointAt(0), result[ix])
    for (let j = mod(ix + 1); j !== ix; j = mod(j + 1)) {
      result[j] = caesar(c.codePointAt(0) + result[mod(j - 1)].codePointAt(0), result[mod(j + 1)])
    }
  }
}

/**
 * A hash function that is not cryptographically safe at all
 * @param {string} str the string to be hashed
 * @returns {string}
 */
export const hash = str => {
  const result = 'insidethecabletemple'.split('')
  // eslint-disable-next-line no-unused-vars
  for (const _ of Array(42).keys()) hashRound(str, result)
  return result.join('')
}
