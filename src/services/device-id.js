import { hash } from '../util/hash'
import { pick } from '../util/random'

const DATA_LENGTH = 6, HASH_LENGTH = 2
const ID_LENGTH = DATA_LENGTH + HASH_LENGTH

const checksum = data => hash(data).slice(0, HASH_LENGTH)
export const parseId = id => {
  if (id?.length != ID_LENGTH) return null
  const data = id.slice(0, DATA_LENGTH)
  const hashed = id.slice(DATA_LENGTH)
  if (checksum(data) !== hashed) return null
  return {} // TODO
}

const STORAGE_KEY = 'youneed-device-id'

const generateId = () => {
  // TODO
  const data = Array
    .from(Array(DATA_LENGTH).keys())
    .map(() => pick('23456789qwertyupasdfghjkzxcvbnm'))
    .join('')
  return data + checksum(data)
}

export const id = (() => {
  const storedId = localStorage[STORAGE_KEY]
  if (parseId(storedId)) return storedId
  const id = generateId()
  localStorage[STORAGE_KEY] = id
  return id
})()

export const deviceSeed = parseInt(hash(id).slice(0, 5), 36)
