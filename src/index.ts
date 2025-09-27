import { createConfig } from "./config/default"
import { P2PNode } from "./network/p2pNode"
import { Message } from "./types"

async function main() {
 const config = await createConfig()

  console.log('Node config:', config)

  const node = new P2PNode({ nodeId: config.nodeId, encryptionKey: config.encryptionKey })
  node.start(config.port)

  // ví dụ broadcast
  setTimeout(() => {
    const msg: Message = { type: 'PING', from: config.nodeId }
    node.broadcast(msg) // broadcast tới tất cả peer hiện có
  }, 10000)
}

main()
