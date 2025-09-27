import * as path from 'path'
import { generateId, newEncryptionKey } from './crypto/crypto'
import { readJSON, writeJSON } from './utils/fsUtils'
import "dotenv/config";

export type Identity = {
  nodeId: string
  encryptionKey: string
}

const IDENTITY_FILE = path.join(process.env.STORAGE_PATH!, 'identity.json')

export async function loadIdentity(): Promise<Identity> {
  let identity = await readJSON<Identity>(IDENTITY_FILE)

  if (!identity) {
    identity = {
      nodeId: generateId(),
      encryptionKey: newEncryptionKey()
    }
    await writeJSON(IDENTITY_FILE, identity)
    console.log('🔑 New identity generated:', identity.nodeId)
  } else {
    console.log('✅ Loaded existing identity:', identity.nodeId)
  }

  return identity
}
