import * as path from 'path'
import * as fs from 'fs'
import { logger } from '../utils/logger'

/**
 ** saveChunk function: Save a Base64 encoded "chunk" (file data fragment) to disk.
 *
 * @param storagePath - Directory path to store node data (e.g. ./data/node-4001)
 * @param fileId - Unique identifier for file or chunk (usually SHA-256 hash)
 * @param base64Chunk - Data content in Base64 format
 */
export function saveChunk(storagePath: string, fileId: string, base64Chunk: string) {
  const filePath = path.join(storagePath, fileId)
  const buffer = Buffer.from(base64Chunk, 'base64')

  fs.mkdirSync(storagePath, { recursive: true })
  fs.writeFileSync(filePath, buffer)
  logger.info(`[STORAGE] Saved chunk for ${fileId} at ${filePath}`)
}

/**
 ** readChunk function: Reads a stored "chunk" (file) and returns the data in Base64 format.
 *
 * @param storagePath - The directory where the node's data is stored
 * @param fileId - The identifier of the file to read
 * @returns A Base64 string containing the file data, or `null` if the file does not exist
 */
export function readChunk(storagePath: string, fileId: string): string | null {
  const filePath = path.join(storagePath, fileId)
  if (!fs.existsSync(filePath)) return null

  // Read file data → convert to Base64
  const buffer = fs.readFileSync(filePath)
  return buffer.toString('base64')
}

/**
 ** deleteChunk function: Delete a file (chunk) from the node storage directory.
 *
 * @param storagePath - Directory containing node data
 * @param fileId - File identifier to delete
 * @returns true if deletion is successful, false if file does not exist
 */
export function deleteChunk(storagePath: string, fileId: string): boolean {
  const filePath = path.join(storagePath, fileId)

  if (!fs.existsSync(filePath)) {
    logger.warn(`[STORAGE] Tried to delete missing chunk: ${fileId}`)
    return false
  }

  try {
    fs.unlinkSync(filePath)
    logger.info(`[STORAGE] Deleted chunk for ${fileId}`)
    return true
  } catch (error) {
    logger.error(`⚠️ Failed to delete chunk ${fileId}:`, error)
    return false
  }
}
