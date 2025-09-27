  import path from 'path'
  import { loadIdentity } from '../identity'
import { NodeConfig } from '../types'

  export async function createConfig(): Promise<NodeConfig> {
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 4001
    const storagePath = process.env.STORAGE_PATH || path.join('./data', `node-${port}`)
    const identity = await loadIdentity(storagePath)

    return {
      nodeId: identity.nodeId,
      encryptionKey: identity.encryptionKey,
      port,
      storagePath,
      bootstrapPeers: process.env.BOOTSTRAP ? process.env.BOOTSTRAP.split(',') : []
    }
  }
