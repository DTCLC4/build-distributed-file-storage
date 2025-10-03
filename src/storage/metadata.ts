import * as fs from 'fs'
import * as path from 'path'
import { logger } from '../utils/logger'

const META_FILE = 'metadata.json'

/**
 ** saveMetadata function: Save metadata information (file name and creation time) to `metadata.json`.
 *
 * @param storagePath - Directory path to store node data
 * @param fileId - Unique identifier for the file (usually a UUID or hash)
 * @param fileName - Original file name
 */
export function saveMetadata(storagePath: string, fileId: string, fileName: string) {
  const metaPath = path.join(storagePath, META_FILE)
  let metadata: Record<string, any> = {}

  // If metadata.json already exists → read current data
  if (fs.existsSync(metaPath)) {
    try {
      metadata = JSON.parse(fs.readFileSync(metaPath, 'utf-8'))
    } catch (error) {
      logger.error('⚠️ Failed to parse metadata.json, recreating...', error)
      metadata = {}
    }
  }

  // Update or add new metadata for fileId
  metadata[fileId] = { fileName, createdAt: Date.now() }

  try {
    fs.writeFileSync(metaPath, JSON.stringify(metadata, null, 2), 'utf-8')
  } catch (error) {
    logger.error('[STORAGE] Failed to write metadata.json', error)
  }
}

/**
 ** getFileName function: Get the original file name from metadata.json based on fileId.
 *
 * @param storagePath - Path to the directory where the node data is stored
 * @param fileId - Identifier of the file to be searched
 * @returns File name if it exists, or null if not found
 */
export function getFileName(storagePath: string, fileId: string): string | null {
  const metaPath = path.join(storagePath, META_FILE)

  // If there is no metadata file → no data
  if (!fs.existsSync(metaPath)) return null

  try {
    const metadata = JSON.parse(fs.readFileSync(metaPath, 'utf-8'))
    return metadata[fileId]?.fileName || null
  } catch (error) {
    logger.error('⚠️ Failed to read metadata.json', error)
    return null
  }
}
/**
 ** listAllFiles function: Get the entire metadata list (fileId → { fileName, createdAt }).
 *
 * @param storagePath - Directory containing metadata.json
 * @returns Object containing all metadata or empty if none
 */
export function listAllFiles(storagePath: string): Record<string, any> {
  const metaPath = path.join(storagePath, META_FILE)
  if (!fs.existsSync(metaPath)) return {}

  try {
    const metadata = JSON.parse(fs.readFileSync(metaPath, 'utf-8'))
    return metadata
  } catch (error) {
    logger.error('⚠️ Failed to parse metadata.json', error)
    return {}
  }
}
/**
 ** deleteMetadata function: Delete metadata information of a file based on fileId.
 *
 *
 * @param storagePath - Directory containing metadata.json
 * @param fileId - File identifier to delete
 * @returns true if deletion is successful, false if fileId not found
 */
export function deleteMetadata(storagePath: string, fileId: string): boolean {
  const metaPath = path.join(storagePath, META_FILE)
  if (!fs.existsSync(metaPath)) return false

  try {
    const metadata = JSON.parse(fs.readFileSync(metaPath, 'utf-8'))
    if (!metadata[fileId]) return false

    delete metadata[fileId]
    fs.writeFileSync(metaPath, JSON.stringify(metadata, null, 2))
    return true
  } catch (error) {
    console.error('⚠️ Failed to delete metadata record', error)
    return false
  }
}
