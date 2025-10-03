import * as path from 'path'
import { generateId, newEncryptionKey } from './crypto/crypto'
import { readJSON, writeJSON } from './utils/fsUtils'
import 'dotenv/config'
import { logger } from './utils/logger'
import * as fs from 'fs'
import { Identity } from './types'

/**
 ** loadIdentity function: read or create a new identity for the node
 *
 * @param storagePath - Path to the directory where the node data is stored
 * @returns {Promise<Identity>} - Returns an object containing the node identifier
 */
export async function loadIdentity(storagePath: string): Promise<Identity> {
  const IDENTITY_FILE = path.join(storagePath, 'identity.json')

  // Make sure the storage directory exists, if not, create it
  await fs.promises.mkdir(storagePath, { recursive: true })

  // Try reading the identity.json file, if it exists, get the old identity
  let identity = await readJSON<Identity>(IDENTITY_FILE)

  if (!identity) {
    // If there is no file or there is an error reading → create a new identity
    identity = {
      nodeId: generateId(),
      encryptionKey: newEncryptionKey()
    }

    // Write the new identity to the JSON file to use it again next time
    await writeJSON(IDENTITY_FILE, identity)
    logger.info('🔑 New identity generated:', identity.nodeId)
  } else {
    // If the file already exists, log that the old identity was loaded successfully
    logger.info('✅ Loaded existing identity:', identity.nodeId)
  }

  return identity
}
