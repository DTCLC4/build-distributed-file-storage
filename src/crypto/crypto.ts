import { createHash, randomBytes, randomUUID } from 'crypto'

/**
 ** GenerateId function: Generate a unique Node ID.
 */
export function generateId(): string {
  return randomUUID()
}

/**
 ** HashKey function: Generate a SHA-256 hash for the given key.
 */
export function hashKey(key: string): string {
  return createHash('sha256').update(key).digest('hex')
}

/**
 ** newEncryptionKey function: Generate a new random encryption key.
 */
export function newEncryptionKey(): string {
  return randomBytes(32).toString('hex')
}
