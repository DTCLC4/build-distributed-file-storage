import { createHash, randomBytes, randomUUID } from 'crypto'

/**
 ** generateId function: Generate a unique Node ID.
 *
 * @returns {string} A UUID
 */
export function generateId(): string {
  return randomUUID()
}

/**
 ** hashKey function: Generate a SHA-256 hash for the given key.
 *
 * @returns {string} SHA-256 hash string in hexadecimal form (64 characters).
 */
export function hashKey(key: string): string {
  return createHash('sha256').update(key).digest('hex')
}

/**
 ** newEncryptionKey function: Generate a new random encryption key.
 *
 * @returns {string} Random hex encryption key (64 characters).
 */
export function newEncryptionKey(): string {
  return randomBytes(32).toString('hex')
}
