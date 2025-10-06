import { createConfig } from './config/default'
import { hashKey } from './crypto/crypto'
import { P2PNode } from './network/p2pNode'
import { saveChunk } from './storage/fileManager'
import { saveMetadata } from './storage/metadata'
import { logger } from './utils/logger'

async function main() {
  const config = await createConfig()

  console.log('Node config:', config)

  const node = new P2PNode({ nodeId: config.nodeId, encryptionKey: config.encryptionKey }, config.storagePath)
  node.start(config.port)

  setTimeout(() => {
    const data = Buffer.from('Hello from ' + config.nodeId)
    const chunk = data.toString('base64')

    const fileId = hashKey(chunk)
    const fileName = `image-${config.nodeId}.txt`

    saveChunk(config.storagePath, fileId, chunk)
    saveMetadata(config.storagePath, fileId, fileName)

    node.broadcast({
      type: 'STORE',
      fileId,
      chunk,
      fileName,
      from: config.nodeId
    })

    logger.info(`[STORE] 📤 Broadcasted file ${fileName} (${fileId}) to peers`)
  }, 5000)

}

main()
