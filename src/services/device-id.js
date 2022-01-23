import { ref } from 'vue'
import { hash } from '../util/hash'
import { pick } from '../util/random'

const DATA_LENGTH = 6, HASH_LENGTH = 2
const ID_LENGTH = DATA_LENGTH + HASH_LENGTH

const checksum = data => hash(data).slice(0, HASH_LENGTH)
export const parseId = id => {
  if (id?.length != ID_LENGTH) return null
  const data = id.slice(0, DATA_LENGTH)
  const hashed = id.slice(DATA_LENGTH)
  if (checksum(data) !== hashed || !/^[0-9a-z]+$/.test(data)) return null
  const [ a, b, c, d, e, f ] = data
  return {
    id,
    seed: parseInt(hash(id).slice(0, 5), 36),
    name: a + b + c + d,
    oscpu: e + f,
    checksum: hashed,
  }
}

const STORAGE_KEY = 'youneed-device-id'

const generateId = () => {
  const oscpu = hash(String(navigator.platform)).slice(0, 2)
  const data = Array
    .from(Array(DATA_LENGTH - 2).keys())
    .map(() => pick('23456789qwertyupasdfghjkzxcvbnm'))
    .join('') + oscpu
  return data + checksum(data)
}

export const id = (() => {
  const storedId = localStorage[STORAGE_KEY]
  if (parseId(storedId)) return storedId
  const id = generateId()
  localStorage[STORAGE_KEY] = id
  return id
})()

export const otherParty = ref('')
