import path from 'path'
import { loadIdentity } from '../identity'
import { NodeConfig } from '../types'

/**
 ** CreateConfig function: Create configuration for a node in the P2P network.
 *
 * @returns {Promise<NodeConfig>} - Full configuration for the node
 */
export async function createConfig(): Promise<NodeConfig> {
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 4001

  const storagePath = process.env.STORAGE_PATH || path.join('./data', `node-${port}`)

  // Call the loadIdentity function to read or create a new node identity
  const identity = await loadIdentity(storagePath)

  return {
    nodeId: identity.nodeId,
    encryptionKey: identity.encryptionKey,
    port,
    storagePath,
    bootstrapPeers: process.env.BOOTSTRAP ? process.env.BOOTSTRAP.split(',') : []
  }
}
