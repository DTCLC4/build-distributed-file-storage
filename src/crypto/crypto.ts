import { createHash, randomBytes, randomUUID } from 'crypto'

export function generateId(): string {
  return randomUUID()
}

export function hashKey(key: string): string {
  return createHash('sha256').update(key).digest('hex')
}

export function newEncryptionKey(): string {
  return randomBytes(32).toString('hex')
}
