import { hashKey } from '../crypto/crypto'

describe('Crypto', () => {
  it('should hash a string consistently', () => {
    const input = 'hello world'
    const h1 = hashKey(input)
    const h2 = hashKey(input)
    expect(h1).toBe(h2)
    expect(h1).toHaveLength(64)
  })
})
