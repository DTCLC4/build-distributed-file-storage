import { loadIdentity } from './identity'

export async function createConfig() {
  const identity = await loadIdentity()

  return {
    nodeId: identity.nodeId,
    encryptionKey: identity.encryptionKey,
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 4001,
    bootstrapPeers: process.env.BOOTSTRAP ? process.env.BOOTSTRAP.split(',') : ['ws://localhost:4002'],
    storagePath: process.env.STORAGE_PATH
  }
}
