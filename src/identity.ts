import * as path from 'path'
import { generateId, newEncryptionKey } from './crypto/crypto'
import { readJSON, writeJSON } from './utils/fsUtils'
import 'dotenv/config'
import { logger } from './utils/logger'
import * as fs from 'fs'
import { Identity } from './types'

/**
 ** LoadIdentity function: read or create a new identity for the node
 */
export async function loadIdentity(storagePath: string): Promise<Identity> {
  const IDENTITY_FILE = path.join(storagePath, 'identity.json')

  // Make sure the storage directory exists, if not, create it (recursive = true → create both parent/child)
  await fs.promises.mkdir(storagePath, { recursive: true })

  // Try reading the identity.json file, if it exists, get the old identity
  let identity = await readJSON<Identity>(IDENTITY_FILE)

  if (!identity) {
    identity = {
      nodeId: generateId(),
      encryptionKey: newEncryptionKey()
    }

    // Write the new identity to the JSON file to use it again next time
    await writeJSON(IDENTITY_FILE, identity)
    logger.info('🔑 New identity generated:', identity.nodeId)
  } else {
    logger.info('✅ Loaded existing identity:', identity.nodeId)
  }

  return identity
}
